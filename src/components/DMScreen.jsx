import { useState } from 'react'
import { BESTIARY, createNpcFromBestiary } from '../data/bestiary'
import { rollD20 } from '../utils/dice'
import './DMScreen.css'

export default function DMScreen({ onClose, onDiceRoll, onNarration, combatState, onCombatUpdate, npcs, onNpcUpdate, players }) {
    const [tab, setTab] = useState('bestiary')
    const [narrationText, setNarrationText] = useState('')
    const [customNpcName, setCustomNpcName] = useState('')
    const [customNpcHp, setCustomNpcHp] = useState(20)
    const [customNpcAc, setCustomNpcAc] = useState(12)

    const handleNarration = () => {
        if (!narrationText.trim()) return
        onNarration(narrationText.trim())
        setNarrationText('')
    }

    const handlePrivateRoll = (mod = 0) => {
        const result = rollD20(mod)
        onDiceRoll({ ...result, isPrivate: true, critical: result.natural === 20 ? 'critical-hit' : result.natural === 1 ? 'critical-fail' : null })
    }

    const handleAddNpc = (bestiaryId) => {
        const npc = createNpcFromBestiary(bestiaryId)
        if (npc) onNpcUpdate([...npcs, npc])
    }

    const handleAddCustomNpc = () => {
        if (!customNpcName.trim()) return
        const npc = {
            instanceId: crypto.randomUUID(),
            id: 'custom',
            name: customNpcName,
            icon: '👹',
            hp: { current: customNpcHp, max: customNpcHp },
            ac: customNpcAc,
        }
        onNpcUpdate([...npcs, npc])
        setCustomNpcName('')
    }

    const adjustNpcHp = (instanceId, delta) => {
        onNpcUpdate(npcs.map(n =>
            n.instanceId === instanceId
                ? { ...n, hp: { ...n.hp, current: Math.max(0, Math.min(n.hp.max, n.hp.current + delta)) } }
                : n
        ))
    }

    const removeNpc = (instanceId) => {
        onNpcUpdate(npcs.filter(n => n.instanceId !== instanceId))
    }

    const handleStartCombat = () => {
        const initiative = [
            ...Object.values(players).filter(p => p.character).map(p => ({
                id: p.id, name: p.character.name, roll: 0, isNPC: false
            })),
            ...npcs.map(n => ({
                id: n.instanceId, name: n.name, roll: 0, isNPC: true
            }))
        ]
        onCombatUpdate({ isActive: true, round: 1, turnIndex: 0, initiative })
    }

    const handleEndCombat = () => {
        onCombatUpdate({ ...combatState, isActive: false })
    }

    return (
        <div className="dm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className="dm-screen card animate-fade-in-scale">
                <div className="dm-header">
                    <h3>🏛️ DM Ekranı</h3>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
                </div>

                <div className="dm-tabs">
                    {[
                        { id: 'bestiary', label: '📖 Yaratıklar' },
                        { id: 'npcs', label: '👹 NPC\'ler' },
                        { id: 'narration', label: '📜 Anlatı' },
                        { id: 'rolls', label: '🎲 Gizli Zar' },
                        { id: 'combat', label: '⚔️ Savaş' },
                    ].map(t => (
                        <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="dm-content">
                    {/* Bestiary Tab */}
                    {tab === 'bestiary' && (
                        <div className="bestiary-list">
                            {BESTIARY.map(mon => (
                                <details key={mon.id} className="monster-block">
                                    <summary className="monster-header">
                                        <span className="mon-icon">{mon.icon}</span>
                                        <span className="mon-name">{mon.name}</span>
                                        <span className="badge badge-crimson">{mon.challenge}</span>
                                        <button className="btn btn-sm btn-ghost" onClick={(e) => { e.preventDefault(); handleAddNpc(mon.id) }} title="Savaşa ekle">
                                            + Ekle
                                        </button>
                                    </summary>
                                    <div className="monster-stats">
                                        <div className="mon-stat-row">
                                            <span>HP: <strong>{mon.hp.max}</strong></span>
                                            <span>AC: <strong>{mon.ac}</strong></span>
                                            <span>Tür: {mon.type}</span>
                                        </div>
                                        <div className="mon-attacks">
                                            <h5>Saldırılar:</h5>
                                            {mon.attacks.map((atk, i) => (
                                                <div key={i} className="atk-item">
                                                    <strong>{atk.name}</strong>: {atk.bonus}, {atk.damage} ({atk.type})
                                                    {atk.description && <p className="text-xs text-muted">{atk.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mon-abilities">
                                            <h5>Yetenekler:</h5>
                                            <ul>{mon.abilities.map((a, i) => <li key={i} className="text-sm">{a}</li>)}</ul>
                                        </div>
                                        <div className="mon-weak">
                                            <h5>Zayıflıklar:</h5>
                                            <ul>{mon.weaknesses.map((w, i) => <li key={i} className="text-sm text-gold">{w}</li>)}</ul>
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}

                    {/* NPCs Tab */}
                    {tab === 'npcs' && (
                        <div className="npc-manager">
                            <div className="npc-add-form">
                                <input className="input" placeholder="NPC Adı" value={customNpcName} onChange={e => setCustomNpcName(e.target.value)} />
                                <input className="input" type="number" placeholder="HP" value={customNpcHp} onChange={e => setCustomNpcHp(+e.target.value)} style={{ width: 70 }} />
                                <input className="input" type="number" placeholder="AC" value={customNpcAc} onChange={e => setCustomNpcAc(+e.target.value)} style={{ width: 70 }} />
                                <button className="btn btn-primary btn-sm" onClick={handleAddCustomNpc}>+</button>
                            </div>
                            <div className="npc-list">
                                {npcs.map(npc => {
                                    const hpPct = (npc.hp.current / npc.hp.max) * 100
                                    return (
                                        <div key={npc.instanceId} className="npc-card">
                                            <div className="npc-top">
                                                <span className="npc-icon">{npc.icon}</span>
                                                <span className="npc-name">{npc.name}</span>
                                                <span className="text-muted text-xs">AC {npc.ac}</span>
                                                <button className="btn btn-ghost btn-sm" onClick={() => removeNpc(npc.instanceId)}>✕</button>
                                            </div>
                                            <div className="npc-hp">
                                                <div className="hp-bar"><div className="hp-fill" style={{ width: `${hpPct}%`, backgroundColor: hpPct > 50 ? 'var(--crimson-light)' : 'var(--crimson)' }} /></div>
                                                <span className="text-sm">{npc.hp.current}/{npc.hp.max}</span>
                                            </div>
                                            <div className="npc-hp-btns">
                                                <button className="btn btn-sm btn-danger" onClick={() => adjustNpcHp(npc.instanceId, -1)}>−1</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => adjustNpcHp(npc.instanceId, -5)}>−5</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => adjustNpcHp(npc.instanceId, -10)}>−10</button>
                                                <button className="btn btn-sm" onClick={() => adjustNpcHp(npc.instanceId, 5)} style={{ borderColor: 'var(--emerald-light)' }}>+5</button>
                                            </div>
                                        </div>
                                    )
                                })}
                                {npcs.length === 0 && <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-lg)' }}>Henüz NPC eklenmedi. Yaratıklar sekmesinden ekleyin.</p>}
                            </div>
                        </div>
                    )}

                    {/* Narration Tab */}
                    {tab === 'narration' && (
                        <div className="narration-tab">
                            <p className="text-muted text-sm">Tüm oyunculara gönderilecek anlatı metni:</p>
                            <textarea
                                className="input narration-input"
                                value={narrationText}
                                onChange={e => setNarrationText(e.target.value)}
                                placeholder="Karanlık orman yolunda ilerlerken, uzaktan davulların sesi duyulur..."
                                rows={5}
                            />
                            <button className="btn btn-primary" onClick={handleNarration} disabled={!narrationText.trim()}>
                                📜 Anlatıyı Gönder
                            </button>
                        </div>
                    )}

                    {/* Private Rolls Tab */}
                    {tab === 'rolls' && (
                        <div className="private-rolls-tab">
                            <p className="text-muted text-sm">Bu zarlar sadece sana görünür:</p>
                            <div className="quick-rolls">
                                {[0, 1, 2, 3, 5, -2].map(mod => (
                                    <button key={mod} className="btn btn-sm" onClick={() => handlePrivateRoll(mod)}>
                                        🔒 d20{mod !== 0 ? (mod > 0 ? `+${mod}` : mod) : ''}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Combat Tab */}
                    {tab === 'combat' && (
                        <div className="combat-tab">
                            {!combatState?.isActive ? (
                                <div className="combat-start">
                                    <p className="text-muted text-sm">Mevcut NPC'ler ve oyuncularla savaş başlat:</p>
                                    <button className="btn btn-primary btn-lg" onClick={handleStartCombat}>
                                        ⚔️ Savaşı Başlat
                                    </button>
                                </div>
                            ) : (
                                <div className="combat-active">
                                    <p>Tur: <strong>{combatState.round}</strong></p>
                                    <button className="btn btn-danger" onClick={handleEndCombat}>Savaşı Bitir</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
