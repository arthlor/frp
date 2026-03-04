import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
 * Get or create anonymous player ID (persisted in sessionStorage)
 */
export function getOrCreatePlayerId() {
  let id = sessionStorage.getItem('ida_player_id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('ida_player_id', id)
  }
  return id
}

// ─── Session CRUD ───────────────────────────────────────────

/**
 * Create a new session in Supabase
 */
export async function createSession(code, name, dmPlayerId) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ code, name, dm_player_id: dmPlayerId })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Find a session by its code
 */
export async function findSession(code) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()
  if (error) return null
  return data
}

// ─── Player CRUD ────────────────────────────────────────────

/**
 * Add or update a player in a session
 */
export async function upsertPlayer(sessionId, playerId, name, role, characterData = null) {
  const { data, error } = await supabase
    .from('players')
    .upsert({
      session_id: sessionId,
      player_id: playerId,
      name,
      role,
      character_data: characterData,
      is_online: true,
    }, { onConflict: 'session_id,player_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Update player's character data
 */
export async function updateCharacter(sessionId, playerId, characterData) {
  const { error } = await supabase
    .from('players')
    .update({ character_data: characterData })
    .eq('session_id', sessionId)
    .eq('player_id', playerId)
  if (error) throw error
}

/**
 * Get all players in a session
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
 * Set player online/offline
 */
export async function setPlayerOnline(sessionId, playerId, isOnline) {
  await supabase
    .from('players')
    .update({ is_online: isOnline })
    .eq('session_id', sessionId)
    .eq('player_id', playerId)
}

// ─── Realtime Channels ──────────────────────────────────────

/**
 * Subscribe to real-time player changes in a session
 */
export function subscribeToPlayers(sessionId, onUpdate) {
  return supabase
    .channel(`players:${sessionId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'players',
      filter: `session_id=eq.${sessionId}`,
    }, (payload) => {
      onUpdate(payload)
    })
    .subscribe()
}

/**
 * Create a broadcast channel for ephemeral events (dice, chat, combat)
 */
export function createGameChannel(sessionCode) {
  return supabase.channel(`game:${sessionCode}`, {
    config: { broadcast: { self: true } },
  })
}

/**
 * Subscribe to broadcast events on a game channel
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

  if (handlers.onCombat) {
    ch = ch.on('broadcast', { event: 'combat_update' }, ({ payload }) => {
      handlers.onCombat(payload)
    })
  }

  if (handlers.onNpc) {
    ch = ch.on('broadcast', { event: 'npc_update' }, ({ payload }) => {
      handlers.onNpc(payload)
    })
  }

  if (handlers.onPresence) {
    ch = ch.on('presence', { event: 'sync' }, () => {
      handlers.onPresence(channel.presenceState())
    })
  }

  return ch.subscribe(async (status) => {
    if (status === 'SUBSCRIBED' && handlers.onPresence) {
      await channel.track({ player_id: handlers.playerId, name: handlers.playerName })
    }
  })
}

/**
 * Send a broadcast event
 */
export function broadcastEvent(channel, event, payload) {
  channel.send({ type: 'broadcast', event, payload })
}
