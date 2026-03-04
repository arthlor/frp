import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import CharacterCreator from './CharacterCreator'
import CharacterSheet from './CharacterSheet'
import PlayerCard from './PlayerCard'
import DiceRoller from './DiceRoller'
import ChatPanel from './ChatPanel'
import DMScreen from './DMScreen'
import InitiativeTracker from './InitiativeTracker'
import { BLOODLINES, STAT_NAMES, getModifier } from '../data/bloodlines'
import { rollD20, getCritical, describeRollOutcome } from '../utils/dice'
import {
    getSessionPlayers,
    updateCharacter,
    subscribeToPlayers,
    getSessionState,
    upsertSessionState,
    subscribeToSessionState,
    createGameChannel,
    subscribeGameEvents,
    broadcastEvent,
} from '../utils/supabase'
import './GameTable.css'

const MAX_DICE_HISTORY = 50
const MAX_CHAT_MESSAGES = 200
const ONBOARDING_STEP_KEYS = ['openSheet', 'rollD20', 'sendChat', 'endTurn']

function mapDbPlayerToUI(row) {
    const userId = row.user_id || row.player_id
    if (!userId) return null

    return {
        id: userId,
        name: row.name,
        role: row.role,
        character: row.character_data,
        isOnline: row.is_online,
        dbId: row.id,
    }
}

function getOnlineIdsFromPresenceState(presenceState) {
    const onlineIds = new Set()

    Object.values(presenceState || {}).forEach((entries) => {
        if (!Array.isArray(entries)) return
        entries.forEach((entry) => {
            if (entry?.player_id) {
                onlineIds.add(entry.player_id)
            }
        })
    })

    return onlineIds
}

function cloneCharacter(character) {
    return JSON.parse(JSON.stringify(character))
}

export default function GameTable({ session, onLeave, showOnboarding = false, onCompleteOnboarding }) {
    const [players, setPlayers] = useState({})
    const [myCharacter, setMyCharacter] = useState(null)
    const [myRole, setMyRole] = useState(null)
    const [showCreator, setShowCreator] = useState(false)
    const [showDMScreen, setShowDMScreen] = useState(false)
    const [showMySheet, setShowMySheet] = useState(false)
    const [showChat, setShowChat] = useState(true)
    const [expandedCard, setExpandedCard] = useState(null)
    const [diceHistory, setDiceHistory] = useState([])
    const [chatMessages, setChatMessages] = useState([])
    const [combatState, setCombatState] = useState(null)
    const [npcs, setNpcs] = useState([])
    const [onlinePlayerIds, setOnlinePlayerIds] = useState(() => new Set())
    const [copied, setCopied] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState('connecting')
    const [beginnerMode, setBeginnerMode] = useState(true)
    const [onboardingProgress, setOnboardingProgress] = useState({
        openSheet: false,
        rollD20: false,
        sendChat: false,
        endTurn: false,
    })
    const [hpUndo, setHpUndo] = useState(null)

    const channelRef = useRef(null)
    const playerSubRef = useRef(null)
    const stateSubRef = useRef(null)
    const myRoleRef = useRef(null)
    const combatStateRef = useRef(null)
    const npcsRef = useRef([])
    const hpUndoTimeoutRef = useRef(null)

    useEffect(() => {
        myRoleRef.current = myRole
    }, [myRole])

    useEffect(() => {
        combatStateRef.current = combatState
    }, [combatState])

    useEffect(() => {
        npcsRef.current = npcs
    }, [npcs])

    const isDM = myRole === 'dm'

    const beginnerModeStorageKey = useMemo(() => `ida_beginner_mode_${session.playerId}`, [session.playerId])

    useEffect(() => {
        const saved = sessionStorage.getItem(beginnerModeStorageKey)
        if (saved === null) {
            setBeginnerMode(true)
            return
        }
        setBeginnerMode(saved !== '0')
    }, [beginnerModeStorageKey])

    const markOnboardingStep = useCallback((key) => {
        if (!showOnboarding || !ONBOARDING_STEP_KEYS.includes(key)) return

        setOnboardingProgress((prev) => {
            if (prev[key]) return prev
            return { ...prev, [key]: true }
        })
    }, [showOnboarding])

    useEffect(() => {
        if (!showOnboarding) return
        setOnboardingProgress({
            openSheet: false,
            rollD20: false,
            sendChat: false,
            endTurn: false,
        })
    }, [showOnboarding, session.id])

    const onboardingDone = ONBOARDING_STEP_KEYS.every((k) => onboardingProgress[k])

    useEffect(() => {
        if (!showOnboarding || !onboardingDone) return
        onCompleteOnboarding?.()
    }, [showOnboarding, onboardingDone, onCompleteOnboarding])

    const currentOnboardingStep = useMemo(
        () => ONBOARDING_STEP_KEYS.find((key) => !onboardingProgress[key]) || null,
        [onboardingProgress],
    )

    const clearHpUndoTimer = useCallback(() => {
        if (hpUndoTimeoutRef.current) {
            clearTimeout(hpUndoTimeoutRef.current)
            hpUndoTimeoutRef.current = null
        }
    }, [])

    useEffect(() => {
        return () => {
            clearHpUndoTimer()
        }
    }, [clearHpUndoTimer])

    const queueHpUndo = useCallback((playerId, previousCharacter) => {
        clearHpUndoTimer()
        const snapshot = cloneCharacter(previousCharacter)

        setHpUndo({
            playerId,
            character: snapshot,
            expiresAt: Date.now() + 10000,
        })

        hpUndoTimeoutRef.current = setTimeout(() => {
            setHpUndo(null)
            hpUndoTimeoutRef.current = null
        }, 10000)
    }, [clearHpUndoTimer])

    const formatRollMessage = useCallback((roll) => {
        const critText = roll.critical === 'critical-hit'
            ? ' 🎯 KRİTİK!'
            : roll.critical === 'critical-fail'
                ? ' 💀 KRİTİK BAŞARISIZLIK!'
                : ''

        const outcome = roll.outcome || describeRollOutcome(roll.total, roll.natural)
        return `🎲 ${roll.formula}: [${roll.rolls.join(', ')}]${roll.modifier ? (roll.modifier > 0 ? '+' : '') + roll.modifier : ''} = ${roll.total}${critText} — ${outcome.short}: ${outcome.meaning}`
    }, [])

    // ─── Initialize: load DB state + set up real-time ───
    useEffect(() => {
        let isMounted = true

        async function init() {
            const savedChar = sessionStorage.getItem(`ida_char_${session.code}`)
            let parsedChar = null
            if (savedChar) {
                try {
                    parsedChar = JSON.parse(savedChar)
                } catch {
                    // Ignore malformed local cache.
                }
            }
            if (parsedChar && isMounted) setMyCharacter(parsedChar)

            try {
                const [dbPlayers, dbState] = await Promise.all([
                    getSessionPlayers(session.id),
                    getSessionState(session.id),
                ])

                if (isMounted) {
                    const map = {}

                    dbPlayers.forEach((p) => {
                        const mapped = mapDbPlayerToUI(p)
                        if (mapped) {
                            map[mapped.id] = mapped
                        }
                    })

                    if (!map[session.playerId]) {
                        map[session.playerId] = {
                            id: session.playerId,
                            name: session.playerName,
                            role: 'player',
                            character: parsedChar,
                            isOnline: true,
                        }
                    }

                    setPlayers(map)
                    setMyRole(map[session.playerId]?.role || 'player')

                    if (dbState) {
                        setCombatState(dbState.combat_state || null)
                        setNpcs(Array.isArray(dbState.npc_state) ? dbState.npc_state : [])
                    }
                }
            } catch (err) {
                console.error('Failed to load session state:', err)

                if (isMounted) {
                    setPlayers({
                        [session.playerId]: {
                            id: session.playerId,
                            name: session.playerName,
                            role: 'player',
                            character: parsedChar,
                            isOnline: true,
                        },
                    })
                    setMyRole('player')
                }
            }

            playerSubRef.current = subscribeToPlayers(session.id, (payload) => {
                if (!isMounted) return

                const { eventType, new: newRow, old: oldRow } = payload

                if (eventType === 'INSERT' || eventType === 'UPDATE') {
                    const mapped = mapDbPlayerToUI(newRow)
                    if (!mapped) return

                    setPlayers((prev) => ({
                        ...prev,
                        [mapped.id]: mapped,
                    }))

                    if (mapped.id === session.playerId) {
                        setMyRole(mapped.role)
                    }
                } else if (eventType === 'DELETE' && oldRow) {
                    const oldId = oldRow.user_id || oldRow.player_id
                    if (!oldId) return

                    setPlayers((prev) => {
                        const next = { ...prev }
                        delete next[oldId]
                        return next
                    })
                }
            })

            stateSubRef.current = subscribeToSessionState(session.id, (payload) => {
                if (!isMounted) return

                const { eventType, new: newRow } = payload

                if ((eventType === 'INSERT' || eventType === 'UPDATE') && newRow) {
                    setCombatState(newRow.combat_state || null)
                    setNpcs(Array.isArray(newRow.npc_state) ? newRow.npc_state : [])
                } else if (eventType === 'DELETE') {
                    setCombatState(null)
                    setNpcs([])
                }
            })

            const channel = createGameChannel(session.code)
            channelRef.current = channel

            subscribeGameEvents(channel, {
                playerId: session.playerId,
                playerName: session.playerName,

                onDiceRoll: (roll) => {
                    if (!isMounted) return

                    const amDm = myRoleRef.current === 'dm'
                    const canSeeRoll = !roll.isPrivate || amDm || roll.playerId === session.playerId
                    if (!canSeeRoll) return

                    setDiceHistory((prev) => [roll, ...prev].slice(0, MAX_DICE_HISTORY))

                    setChatMessages((prev) => ([...prev, {
                        id: roll.id || crypto.randomUUID(),
                        playerId: roll.playerId,
                        playerName: roll.playerName,
                        message: formatRollMessage(roll),
                        type: 'system',
                        timestamp: roll.timestamp || Date.now(),
                    }]).slice(-MAX_CHAT_MESSAGES))
                },

                onChat: (msg) => {
                    if (!isMounted) return
                    setChatMessages((prev) => ([...prev, msg]).slice(-MAX_CHAT_MESSAGES))
                },

                onPresence: (presenceState) => {
                    if (!isMounted) return
                    setOnlinePlayerIds(getOnlineIdsFromPresenceState(presenceState))
                    setConnectionStatus('connected')
                },

                onStatus: (status) => {
                    if (!isMounted) return

                    if (status === 'SUBSCRIBED') {
                        setConnectionStatus('connected')
                        return
                    }

                    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                        setConnectionStatus('connecting')
                    }
                },
            })
        }

        init()

        return () => {
            isMounted = false

            if (channelRef.current) channelRef.current.unsubscribe()
            if (playerSubRef.current) playerSubRef.current.unsubscribe()
            if (stateSubRef.current) stateSubRef.current.unsubscribe()
        }
    }, [session, formatRollMessage])

    // ─── Sync my character to Supabase when it changes ───
    useEffect(() => {
        if (!myCharacter) return

        sessionStorage.setItem(`ida_char_${session.code}`, JSON.stringify(myCharacter))

        updateCharacter(session.id, session.playerId, myCharacter).catch((err) => {
            console.error('Failed to sync my character:', err)
        })

        setPlayers((prev) => ({
            ...prev,
            [session.playerId]: {
                ...(prev[session.playerId] || {
                    id: session.playerId,
                    name: session.playerName,
                    role: myRole || 'player',
                    isOnline: true,
                }),
                character: myCharacter,
            },
        }))
    }, [myCharacter, session.code, session.playerId, session.playerName, session.id, myRole])

    // ─── Handlers ─────────────────────────────────────────────

    const handleCharacterCreated = useCallback((char) => {
        setMyCharacter(char)
        setShowCreator(false)
    }, [])

    const handleCharacterUpdate = useCallback((updates) => {
        setMyCharacter((prev) => ({ ...prev, ...updates }))
    }, [])

    const handleUndoLastHpChange = useCallback(() => {
        if (!hpUndo?.character) return

        clearHpUndoTimer()

        if (hpUndo.playerId === session.playerId) {
            setMyCharacter(hpUndo.character)
            setHpUndo(null)
            return
        }

        setPlayers((prev) => ({
            ...prev,
            [hpUndo.playerId]: {
                ...prev[hpUndo.playerId],
                character: hpUndo.character,
            },
        }))

        updateCharacter(session.id, hpUndo.playerId, hpUndo.character).catch((err) => {
            console.error('Failed to undo HP change:', err)
        })

        setHpUndo(null)
    }, [hpUndo, session.playerId, session.id, clearHpUndoTimer])

    const handlePlayerHpChange = useCallback((playerId, delta) => {
        const target = players[playerId]
        if (!target?.character?.hp) return

        const canEdit = playerId === session.playerId || isDM
        if (!canEdit) return

        const previousCharacter = cloneCharacter(target.character)
        const newHp = Math.max(0, Math.min(target.character.hp.max, target.character.hp.current + delta))
        const updatedCharacter = {
            ...target.character,
            hp: {
                ...target.character.hp,
                current: newHp,
            },
        }

        queueHpUndo(playerId, previousCharacter)

        if (playerId === session.playerId) {
            setMyCharacter(updatedCharacter)
            return
        }

        setPlayers((prev) => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                character: updatedCharacter,
            },
        }))

        updateCharacter(session.id, playerId, updatedCharacter).catch((err) => {
            console.error('Failed to update target HP:', err)
        })
    }, [players, session.playerId, session.id, isDM, queueHpUndo])

    const handleDiceRoll = useCallback((roll) => {
        markOnboardingStep('rollD20')

        const entry = {
            id: crypto.randomUUID(),
            playerId: session.playerId,
            playerName: session.playerName,
            timestamp: Date.now(),
            outcome: roll.outcome || describeRollOutcome(roll.total, roll.natural),
            ...roll,
        }

        if (channelRef.current) {
            broadcastEvent(channelRef.current, 'dice_roll', entry).catch((err) => {
                console.error('Dice roll broadcast failed:', err)
            })
        }
    }, [session.playerId, session.playerName, markOnboardingStep])

    const handleChatSend = useCallback((msg) => {
        markOnboardingStep('sendChat')

        const entry = {
            id: crypto.randomUUID(),
            playerId: session.playerId,
            playerName: session.playerName,
            timestamp: Date.now(),
            ...msg,
        }

        if (channelRef.current) {
            broadcastEvent(channelRef.current, 'chat_message', entry).catch((err) => {
                console.error('Chat broadcast failed:', err)
            })
        }
    }, [session.playerId, session.playerName, markOnboardingStep])

    const handleCopyCode = useCallback(() => {
        navigator.clipboard.writeText(session.code).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }).catch((err) => {
            console.error('Failed to copy session code:', err)
        })
    }, [session.code])

    const handleCombatUpdate = useCallback((state) => {
        if (!isDM) return

        setCombatState(state)
        upsertSessionState(session.id, {
            combatState: state,
            npcState: npcsRef.current,
        }).catch((err) => {
            console.error('Failed to update combat state:', err)
        })
    }, [isDM, session.id])

    const handleNpcUpdate = useCallback((npcList) => {
        if (!isDM) return

        setNpcs(npcList)
        upsertSessionState(session.id, {
            combatState: combatStateRef.current,
            npcState: npcList,
        }).catch((err) => {
            console.error('Failed to update NPC state:', err)
        })
    }, [isDM, session.id])

    const handleToggleBeginnerMode = useCallback(() => {
        setBeginnerMode((prev) => {
            const next = !prev
            sessionStorage.setItem(beginnerModeStorageKey, next ? '1' : '0')
            return next
        })
    }, [beginnerModeStorageKey])

    const handleBeginnerAction = useCallback((action) => {
        const configs = {
            attack: {
                formula: 'Saldır (d20+2)',
                modifier: 2,
                guidance: 'Yakınındaki tehdidi hedef al.',
            },
            power: {
                formula: 'Yetenek (d20+3)',
                modifier: 3,
                guidance: 'Soy gücünü yaratıcı kullan.',
            },
            assist: {
                formula: 'Yardım (d20+1)',
                modifier: 1,
                guidance: 'Bir ekip arkadaşına destek sağla.',
            },
        }

        const selected = configs[action]
        if (!selected) return

        const result = rollD20(selected.modifier)
        const critical = getCritical(result.natural)
        const outcome = describeRollOutcome(result.total, result.natural)

        handleDiceRoll({
            ...result,
            formula: selected.formula,
            critical,
            outcome,
            isPrivate: false,
        })

        handleChatSend({
            type: 'chat',
            message: `${selected.guidance} (${outcome.short.toLowerCase()})`,
        })
    }, [handleDiceRoll, handleChatSend])

    const handleStatCheck = useCallback((statKey, statValue) => {
        const modifier = getModifier(statValue)
        const result = rollD20(modifier)
        const critical = getCritical(result.natural)
        const outcome = describeRollOutcome(result.total, result.natural)
        const statName = STAT_NAMES[statKey]?.name || statKey

        handleDiceRoll({
            ...result,
            formula: `${statName} Kontrolü`,
            critical,
            outcome,
            isPrivate: false,
        })
    }, [handleDiceRoll])

    const handleTurnAdvanced = useCallback(() => {
        markOnboardingStep('endTurn')
    }, [markOnboardingStep])

    const handleToggleMySheet = useCallback(() => {
        setShowMySheet((prev) => {
            const next = !prev
            if (next) markOnboardingStep('openSheet')
            return next
        })
    }, [markOnboardingStep])

    const getSuggestedAction = useCallback(() => {
        if (!myCharacter) {
            return 'Önce karakterini tamamla ve sayfanı aç.'
        }

        if (combatState?.isActive) {
            const current = combatState.initiative?.[combatState.turnIndex]
            if (current?.id === session.playerId) {
                return 'Sıra sende: Saldır veya Yardım aksiyonunu seç.'
            }
            return `Şu an sıra ${current?.name || 'başka bir oyuncuda'}. Hazırlığını yap ve kısa bir plan yaz.`
        }

        if (beginnerMode) {
            return 'Başlangıç aksiyonlarından birine bas: Saldır, Yetenek veya Yardım.'
        }

        return 'd20 at, sonra ne yapmak istediğini bir cümleyle yaz.'
    }, [myCharacter, combatState, session.playerId, beginnerMode])

    const handleOnboardingAction = useCallback(() => {
        if (!currentOnboardingStep) return

        if (currentOnboardingStep === 'openSheet') {
            setShowMySheet(true)
            markOnboardingStep('openSheet')
            return
        }

        if (currentOnboardingStep === 'rollD20') {
            const result = rollD20(0)
            handleDiceRoll({
                ...result,
                formula: 'Alıştırma d20',
                critical: getCritical(result.natural),
                outcome: describeRollOutcome(result.total, result.natural),
                isPrivate: false,
            })
            return
        }

        if (currentOnboardingStep === 'sendChat') {
            handleChatSend({ type: 'chat', message: 'Hazırım, başlayabiliriz!' })
            return
        }

        if (currentOnboardingStep === 'endTurn') {
            markOnboardingStep('endTurn')
        }
    }, [currentOnboardingStep, handleDiceRoll, handleChatSend, markOnboardingStep])

    // ─── Render ───────────────────────────────────────────────

    if (!myCharacter && !showCreator) {
        return (
            <div className="game-table-empty">
                <div className="empty-card card animate-fade-in">
                    <h2>⚔️ Karakter Oluştur</h2>
                    <p>İda'nın Son Muhafızlarına katılmak için bir karakter oluşturmalısın.</p>
                    <p className="text-sm text-muted">
                        Oturum Kodu: <strong className="text-gold">{session.code}</strong>
                        <br />Bu kodu arkadaşlarınla paylaş!
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={() => setShowCreator(true)}>
                        Karakter Oluştur
                    </button>
                </div>
            </div>
        )
    }

    if (showCreator) {
        return <CharacterCreator onComplete={handleCharacterCreated} onBack={() => setShowCreator(false)} />
    }

    const playerList = Object.values(players).map((player) => ({
        ...player,
        isOnline: onlinePlayerIds.size > 0
            ? onlinePlayerIds.has(player.id)
            : player.isOnline,
    }))

    return (
        <div className="game-table">
            <header className="game-header">
                <div className="header-left">
                    <button className="btn btn-ghost btn-sm" onClick={onLeave}>← Çıkış</button>
                    <div className="header-session">
                        <h4 className="session-name">{session.name || 'İda Oturumu'}</h4>
                        <button className="session-code-btn" onClick={handleCopyCode} title="Kodu kopyala">
                            <span className="code-text">{session.code}</span>
                            <span className="code-copy">{copied ? '✓' : '📋'}</span>
                        </button>
                        <span className={`connection-dot ${connectionStatus}`} title={connectionStatus === 'connected' ? 'Bağlı' : 'Bağlanıyor...'} />
                    </div>
                </div>
                <div className="header-center">
                    <span className="player-count">👥 {playerList.filter((p) => p.isOnline).length} oyuncu</span>
                </div>
                <div className="header-right">
                    <button className={`btn btn-ghost btn-sm ${beginnerMode ? 'active' : ''}`} onClick={handleToggleBeginnerMode}>
                        🧭 Başlangıç
                    </button>
                    {myCharacter && (
                        <button className={`btn btn-ghost btn-sm ${showMySheet ? 'active' : ''}`} onClick={handleToggleMySheet}>
                            📜 Sayfam
                        </button>
                    )}
                    <button className={`btn btn-ghost btn-sm ${showChat ? 'active' : ''}`} onClick={() => setShowChat(!showChat)}>
                        💬
                    </button>
                    {isDM && (
                        <button className={`btn btn-sm ${showDMScreen ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShowDMScreen(!showDMScreen)}>
                            🏛️ DM
                        </button>
                    )}
                </div>
            </header>

            <div className="game-content">
                <main className="virtual-table">
                    <div className="table-surface">
                        <div className="table-ornament">⚡</div>
                        <div className="table-title">İda'nın Son Muhafızları</div>

                        <div className="table-glossary">
                            <span className="glossary-chip" title="Zırh (AC): Karakterin ne kadar zor vurulduğunu gösterir.">Zırh (AC)</span>
                            <span className="glossary-chip" title="İnisiyatif: Savaşta kimin önce oynayacağını belirler.">İnisiyatif</span>
                            <span className="glossary-chip" title="Kritik: d20 sonucunda 20 (çok iyi) veya 1 (çok kötü).">Kritik</span>
                        </div>

                        {combatState?.isActive && (
                            <InitiativeTracker
                                combatState={combatState}
                                onUpdate={handleCombatUpdate}
                                onTurnAdvance={handleTurnAdvanced}
                                onPracticeTurnEnd={handleTurnAdvanced}
                                isDM={isDM}
                                players={players}
                            />
                        )}

                        {beginnerMode ? (
                            <div className="beginner-actions card animate-fade-in">
                                <h4>🎯 Başlangıç Aksiyonları</h4>
                                <p className="text-sm text-muted">Sadece birini seç. Sonucu sohbette göreceksin.</p>
                                <div className="beginner-action-row">
                                    <button className="btn btn-primary" onClick={() => handleBeginnerAction('attack')}>⚔️ Saldır</button>
                                    <button className="btn" onClick={() => handleBeginnerAction('power')}>⚡ Yetenek</button>
                                    <button className="btn btn-ghost" onClick={() => handleBeginnerAction('assist')}>🤝 Yardım</button>
                                </div>
                            </div>
                        ) : (
                            <DiceRoller
                                onRoll={handleDiceRoll}
                                history={diceHistory}
                                isDM={isDM}
                            />
                        )}
                    </div>

                    <div className="table-seats">
                        {playerList.map((player) => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                isMe={player.id === session.playerId}
                                isDM={isDM}
                                onHpChange={(delta) => handlePlayerHpChange(player.id, delta)}
                                expanded={expandedCard === player.id}
                                onToggle={() => setExpandedCard(expandedCard === player.id ? null : player.id)}
                            />
                        ))}
                        {playerList.length < 6 && Array.from({ length: Math.min(2, 6 - playerList.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="seat-empty">
                                <span className="seat-empty-icon">👤</span>
                                <span className="seat-empty-text">Boş Koltuk</span>
                            </div>
                        ))}
                    </div>
                </main>

                {showChat && (
                    <aside className="panel-chat">
                        <ChatPanel
                            messages={chatMessages}
                            onSend={handleChatSend}
                            isDM={isDM}
                            playerName={session.playerName}
                            onNeedSuggestion={getSuggestedAction}
                        />
                    </aside>
                )}
            </div>

            {showMySheet && myCharacter && (
                <div className="sheet-overlay" onClick={() => setShowMySheet(false)}>
                    <div className="sheet-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="sheet-panel-header">
                            <h3>📜 Karakter Sayfam</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowMySheet(false)}>✕</button>
                        </div>
                        <div className="sheet-panel-content">
                            <CharacterSheet
                                character={myCharacter}
                                onUpdate={handleCharacterUpdate}
                                onStatCheck={handleStatCheck}
                                bloodline={BLOODLINES[myCharacter.bloodline]}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showDMScreen && isDM && (
                <DMScreen
                    onClose={() => setShowDMScreen(false)}
                    onDiceRoll={handleDiceRoll}
                    onNarration={(text) => handleChatSend({ message: text, type: 'narration' })}
                    combatState={combatState}
                    onCombatUpdate={handleCombatUpdate}
                    npcs={npcs}
                    onNpcUpdate={handleNpcUpdate}
                    players={players}
                />
            )}

            {showOnboarding && !onboardingDone && (
                <div className="onboarding-overlay">
                    <div className="onboarding-card card animate-fade-in">
                        <h3>👋 Hızlı Başlangıç</h3>
                        <p className="text-sm text-muted">4 adımı tamamla, sonra oyun otomatik devam eder.</p>
                        <div className="onboarding-list">
                            <div className={`onboarding-item ${onboardingProgress.openSheet ? 'done' : ''}`}>1. Sayfamı aç</div>
                            <div className={`onboarding-item ${onboardingProgress.rollD20 ? 'done' : ''}`}>2. d20 zarı at</div>
                            <div className={`onboarding-item ${onboardingProgress.sendChat ? 'done' : ''}`}>3. Sohbete mesaj gönder</div>
                            <div className={`onboarding-item ${onboardingProgress.endTurn ? 'done' : ''}`}>4. Turu bitir</div>
                        </div>
                        <button className="btn btn-primary" onClick={handleOnboardingAction}>
                            {currentOnboardingStep === 'openSheet' && '📜 Sayfamı Aç'}
                            {currentOnboardingStep === 'rollD20' && '🎲 d20 At'}
                            {currentOnboardingStep === 'sendChat' && '💬 Mesaj Gönder'}
                            {currentOnboardingStep === 'endTurn' && '✅ Turu Bitir'}
                        </button>
                    </div>
                </div>
            )}

            {hpUndo && (
                <div className="hp-undo-toast">
                    <span>HP değişikliği uygulandı.</span>
                    <button className="btn btn-sm btn-ghost" onClick={handleUndoLastHpChange}>↩ Geri Al</button>
                </div>
            )}
        </div>
    )
}
