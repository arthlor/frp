import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

let pendingAuthPromise = null

/**
 * Ensure every browser client has an authenticated identity.
 * Uses Supabase anonymous auth (must be enabled in project auth settings).
 */
export async function ensureAuthenticatedUser() {
  if (pendingAuthPromise) return pendingAuthPromise

  pendingAuthPromise = (async () => {
    const { data: existing, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    if (existing.session?.user) {
      return existing.session.user
    }

    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      throw new Error(`Anon auth failed: ${error.message}`)
    }

    if (!data.session?.user) {
      throw new Error('Anon auth failed: missing user session')
    }

    return data.session.user
  })()

  try {
    return await pendingAuthPromise
  } finally {
    pendingAuthPromise = null
  }
}

/**
 * Generate a short session code (6-char alphanumeric, no ambiguous chars)
 */
export function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

/**
 * Create a new session in Supabase with retry on code collisions.
 */
export async function createSession(name, dmUserId, maxAttempts = 6) {
  let attempt = 0
  let lastError = null

  while (attempt < maxAttempts) {
    const code = generateSessionCode()
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        code,
        name,
        dm_user_id: dmUserId,
        dm_player_id: dmUserId,
      })
      .select('*')
      .single()

    if (!error) return data

    lastError = error
    // Unique conflict -> regenerate code and retry.
    if (error.code === '23505') {
      attempt += 1
      continue
    }

    throw error
  }

  const collisionError = new Error('Could not allocate a unique session code.')
  collisionError.cause = lastError
  throw collisionError
}

/**
 * Find an active session by its code.
 */
export async function findSession(code) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Add or update a player in a session.
 * Role is enforced by database trigger (dm if session dm_user_id, else player).
 */
export async function upsertPlayer(sessionId, userId, name, characterData = null) {
  const payload = {
    session_id: sessionId,
    user_id: userId,
    player_id: userId,
    name,
    character_data: characterData,
    is_online: true,
  }

  const { data, error } = await supabase
    .from('players')
    .upsert(payload, { onConflict: 'session_id,user_id' })
    .select('*')
    .single()

  if (error) throw error
  return data
}

/**
 * Update player's character data.
 * Caller can be player owner or session DM (enforced via RLS).
 */
export async function updateCharacter(sessionId, userId, characterData) {
  const { error } = await supabase
    .from('players')
    .update({ character_data: characterData })
    .eq('session_id', sessionId)
    .eq('user_id', userId)

  if (error) throw error
}

/**
 * Get all players in a session.
 */
export async function getSessionPlayers(sessionId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('session_id', sessionId)
    .order('joined_at', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Set player online/offline.
 */
export async function setPlayerOnline(sessionId, userId, isOnline) {
  const { error } = await supabase
    .from('players')
    .update({ is_online: isOnline })
    .eq('session_id', sessionId)
    .eq('user_id', userId)

  if (error) throw error
}

/**
 * DM-controlled shared state (combat + NPC lists).
 */
export async function getSessionState(sessionId) {
  const { data, error } = await supabase
    .from('session_state')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertSessionState(sessionId, updates) {
  const payload = {
    session_id: sessionId,
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'combatState')) {
    payload.combat_state = updates.combatState
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'npcState')) {
    payload.npc_state = updates.npcState
  }

  const { data, error } = await supabase
    .from('session_state')
    .upsert(payload, { onConflict: 'session_id' })
    .select('*')
    .single()

  if (error) throw error
  return data
}

/**
 * Subscribe to real-time player changes in a session.
 */
export function subscribeToPlayers(sessionId, onUpdate) {
  return supabase
    .channel(`players:${sessionId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'players',
      filter: `session_id=eq.${sessionId}`,
    }, onUpdate)
    .subscribe()
}

/**
 * Subscribe to DM-controlled session state changes.
 */
export function subscribeToSessionState(sessionId, onUpdate) {
  return supabase
    .channel(`session_state:${sessionId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'session_state',
      filter: `session_id=eq.${sessionId}`,
    }, onUpdate)
    .subscribe()
}

/**
 * Create a broadcast channel for ephemeral events (dice, chat, presence).
 */
export function createGameChannel(sessionCode) {
  return supabase.channel(`game:${sessionCode}`, {
    config: { broadcast: { self: true } },
  })
}

/**
 * Subscribe to broadcast/presence events on a game channel.
 */
export function subscribeGameEvents(channel, handlers) {
  let ch = channel

  if (handlers.onDiceRoll) {
    ch = ch.on('broadcast', { event: 'dice_roll' }, ({ payload }) => {
      handlers.onDiceRoll(payload)
    })
  }

  if (handlers.onChat) {
    ch = ch.on('broadcast', { event: 'chat_message' }, ({ payload }) => {
      handlers.onChat(payload)
    })
  }

  if (handlers.onPresence) {
    ch = ch.on('presence', { event: 'sync' }, () => {
      handlers.onPresence(channel.presenceState())
    })
  }

  return ch.subscribe(async (status) => {
    if (handlers.onStatus) handlers.onStatus(status)

    if (status === 'SUBSCRIBED' && handlers.onPresence) {
      await channel.track({ player_id: handlers.playerId, name: handlers.playerName })
    }
  })
}

/**
 * Send a broadcast event and return delivery status.
 */
export async function broadcastEvent(channel, event, payload) {
  const result = await channel.send({ type: 'broadcast', event, payload })

  if (result === 'error' || result === 'timed out') {
    throw new Error(`Broadcast failed (${result}) for event: ${event}`)
  }

  return result
}
