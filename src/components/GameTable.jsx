import { useState, useEffect, useCallback, useRef } from 'react'
import CharacterCreator from './CharacterCreator'
import CharacterSheet from './CharacterSheet'
import PlayerCard from './PlayerCard'
import DiceRoller from './DiceRoller'
import ChatPanel from './ChatPanel'
import DMScreen from './DMScreen'
import InitiativeTracker from './InitiativeTracker'
import { BLOODLINES } from '../data/bloodlines'
import {
    getSessionPlayers,
    upsertPlayer,
    updateCharacter,
    setPlayerOnline,
    subscribeToPlayers,
    createGameChannel,
    subscribeGameEvents,
    broadcastEvent,
} from '../utils/supabase'
import './GameTable.css'

export default function GameTable({ session, onLeave }) {
    const [players, setPlayers] = useState({})
    const [myCharacter, setMyCharacter] = useState(null)
    const [showCreator, setShowCreator] = useState(false)
    const [showDMScreen, setShowDMScreen] = useState(false)
    const [showMySheet, setShowMySheet] = useState(false)
    const [showChat, setShowChat] = useState(true)
    const [expandedCard, setExpandedCard] = useState(null)
    const [diceHistory, setDiceHistory] = useState([])
    const [chatMessages, setChatMessages] = useState([])
    const [combatState, setCombatState] = useState(null)
    const [npcs, setNpcs] = useState([])
    const [copied, setCopied] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState('connecting')
    const channelRef = useRef(null)
    const playerSubRef = useRef(null)
    const isDM = session.role === 'dm'

    // ─── Initialize: load players from DB, set up real-time ───
    useEffect(() => {
        let isMounted = true

        async function init() {
            // Load saved character from sessionStorage
            const savedChar = sessionStorage.getItem(`ida_char_${session.code}`)
            let parsedChar = null
            if (savedChar) {
                try { parsedChar = JSON.parse(savedChar) } catch (e) { /* ignore */ }
            }
            if (parsedChar && isMounted) setMyCharacter(parsedChar)

            // Fetch existing players from Supabase
            try {
                const dbPlayers = await getSessionPlayers(session.id)
                if (isMounted) {
                    const map = {}
                    dbPlayers.forEach(p => {
                        map[p.player_id] = {
                            id: p.player_id,
                            name: p.name,
                            role: p.role,
                            character: p.character_data,
                            isOnline: p.is_online,
                            dbId: p.id,
                        }
                    })
                    // Ensure we're in the map
                    if (!map[session.playerId]) {
                        map[session.playerId] = {
                            id: session.playerId,
                            name: session.playerName,
                            role: session.role,
                            character: parsedChar,
                            isOnline: true,
                        }
                    }
                    setPlayers(map)
                }
            } catch (err) {
                console.error('Failed to load players:', err)
                // Fallback to local-only
                if (isMounted) {
                    setPlayers({
                        [session.playerId]: {
                            id: session.playerId,
                            name: session.playerName,
                            role: session.role,
                            character: parsedChar,
                            isOnline: true,
                        }
                    })
                }
            }

            // Subscribe to player table changes (join/leave/character updates)
            playerSubRef.current = subscribeToPlayers(session.id, (payload) => {
                if (!isMounted) return
                const { eventType, new: newRow, old: oldRow } = payload
                if (eventType === 'INSERT' || eventType === 'UPDATE') {
                    setPlayers(prev => ({
                        ...prev,
                        [newRow.player_id]: {
                            id: newRow.player_id,
                            name: newRow.name,
                            role: newRow.role,
                            character: newRow.character_data,
                            isOnline: newRow.is_online,
                            dbId: newRow.id,
                        }
                    }))
                } else if (eventType === 'DELETE' && oldRow) {
                    setPlayers(prev => {
                        const next = { ...prev }
                        delete next[oldRow.player_id]
                        return next
                    })
                }
            })

            // Set up broadcast channel for ephemeral game events
            const channel = createGameChannel(session.code)
            channelRef.current = channel

            subscribeGameEvents(channel, {
                playerId: session.playerId,
                playerName: session.playerName,

                onDiceRoll: (roll) => {
                    if (!isMounted) return
                    setDiceHistory(prev => [roll, ...prev].slice(0, 50))
                    // Add to chat as system message
                    if (!roll.isPrivate || roll.playerId === session.playerId) {
                        const critText = roll.critical === 'critical-hit' ? ' 🎯 KRİTİK!' :
                            roll.critical === 'critical-fail' ? ' 💀 BAŞARISIZ!' : ''
                        setChatMessages(prev => [...prev, {
                            id: roll.id || crypto.randomUUID(),
                            playerId: roll.playerId,
                            playerName: roll.playerName,
                            message: `🎲 ${roll.formula}: [${roll.rolls.join(', ')}]${roll.modifier ? (roll.modifier > 0 ? '+' : '') + roll.modifier : ''} = ${roll.total}${critText}`,
                            type: 'system',
                            timestamp: roll.timestamp || Date.now(),
                        }])
                    }
                },

                onChat: (msg) => {
                    if (!isMounted) return
                    setChatMessages(prev => [...prev, msg])
                },

                onCombat: (state) => {
                    if (!isMounted) return
                    setCombatState(state)
                },

                onNpc: (npcList) => {
                    if (!isMounted) return
                    setNpcs(npcList)
                },

                onPresence: (presenceState) => {
                    if (!isMounted) return
                    setConnectionStatus('connected')
                },
            })
        }

        init()

        // Cleanup on unmount
        return () => {
            isMounted = false
            setPlayerOnline(session.id, session.playerId, false).catch(() => { })
            if (channelRef.current) channelRef.current.unsubscribe()
            if (playerSubRef.current) playerSubRef.current.unsubscribe()
        }
    }, [session])

    // ─── Sync character to Supabase when it changes ───
    useEffect(() => {
        if (myCharacter) {
            sessionStorage.setItem(`ida_char_${session.code}`, JSON.stringify(myCharacter))
            // Update in DB
            updateCharacter(session.id, session.playerId, myCharacter).catch(console.error)
            // Update local players map
            setPlayers(prev => ({
                ...prev,
                [session.playerId]: {
                    ...prev[session.playerId],
                    character: myCharacter,
                }
            }))
        }
    }, [myCharacter, session.code, session.playerId, session.id])

    // ─── Handlers ─────────────────────────────────────────────

    const handleCharacterCreated = useCallback((char) => {
        setMyCharacter(char)
        setShowCreator(false)
    }, [])

    const handleCharacterUpdate = useCallback((updates) => {
        setMyCharacter(prev => ({ ...prev, ...updates }))
    }, [])

    const handlePlayerHpChange = useCallback((playerId, delta) => {
        if (playerId === session.playerId && myCharacter) {
            const newHp = Math.max(0, Math.min(myCharacter.hp.max, myCharacter.hp.current + delta))
            setMyCharacter(prev => ({ ...prev, hp: { ...prev.hp, current: newHp } }))
        }
    }, [session.playerId, myCharacter])

    const handleDiceRoll = useCallback((roll) => {
        const entry = {
            id: crypto.randomUUID(),
            playerId: session.playerId,
            playerName: session.playerName,
            timestamp: Date.now(),
            ...roll,
        }
        // Broadcast to all players via Supabase
        if (channelRef.current) {
            broadcastEvent(channelRef.current, 'dice_roll', entry)
        }
    }, [session])

    const handleChatSend = useCallback((msg) => {
        const entry = {
            id: crypto.randomUUID(),
            playerId: session.playerId,
            playerName: session.playerName,
            timestamp: Date.now(),
            ...msg,
        }
        // Broadcast to all players
        if (channelRef.current) {
            broadcastEvent(channelRef.current, 'chat_message', entry)
        }
    }, [session])

    const handleCopyCode = useCallback(() => {
        navigator.clipboard.writeText(session.code).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }, [session.code])

    const handleCombatUpdate = useCallback((state) => {
        setCombatState(state)
        if (channelRef.current) {
            broadcastEvent(channelRef.current, 'combat_update', state)
        }
    }, [])

    const handleNpcUpdate = useCallback((npcList) => {
        setNpcs(npcList)
        if (channelRef.current) {
            broadcastEvent(channelRef.current, 'npc_update', npcList)
        }
    }, [])

    // ─── Render ───────────────────────────────────────────────

    // Character creator flow
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

    const playerList = Object.values(players)

    return (
        <div className="game-table">
            {/* Top Bar */}
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
                    <span className="player-count">👥 {playerList.filter(p => p.isOnline).length} oyuncu</span>
                </div>
                <div className="header-right">
                    {myCharacter && (
                        <button className={`btn btn-ghost btn-sm ${showMySheet ? 'active' : ''}`} onClick={() => setShowMySheet(!showMySheet)}>
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

            {/* Main Virtual Table */}
            <div className="game-content">
                <main className="virtual-table">
                    {/* Table Surface */}
                    <div className="table-surface">
                        <div className="table-ornament">⚡</div>
                        <div className="table-title">İda'nın Son Muhafızları</div>

                        {combatState?.isActive && (
                            <InitiativeTracker
                                combatState={combatState}
                                onUpdate={handleCombatUpdate}
                                isDM={isDM}
                                players={players}
                            />
                        )}

                        <DiceRoller
                            onRoll={handleDiceRoll}
                            history={diceHistory}
                            isDM={isDM}
                        />
                    </div>

                    {/* Player Cards Around the Table */}
                    <div className="table-seats">
                        {playerList.map(player => (
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

                {/* Chat Panel */}
                {showChat && (
                    <aside className="panel-chat">
                        <ChatPanel
                            messages={chatMessages}
                            onSend={handleChatSend}
                            isDM={isDM}
                            playerName={session.playerName}
                        />
                    </aside>
                )}
            </div>

            {/* My Character Sheet (slide-over) */}
            {showMySheet && myCharacter && (
                <div className="sheet-overlay" onClick={() => setShowMySheet(false)}>
                    <div className="sheet-panel animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="sheet-panel-header">
                            <h3>📜 Karakter Sayfam</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowMySheet(false)}>✕</button>
                        </div>
                        <div className="sheet-panel-content">
                            <CharacterSheet
                                character={myCharacter}
                                onUpdate={handleCharacterUpdate}
                                bloodline={BLOODLINES[myCharacter.bloodline]}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* DM Screen */}
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
        </div>
    )
}
