import { useState } from 'react'
import { BESTIARY, createNpcFromBestiary } from '../data/bestiary'
import { rollD20 } from '../utils/dice'
import './DMScreen.css'

export default function DMScreen({ onClose, onDiceRoll, onNarration, combatState, onCombatUpdate, npcs, onNpcUpdate, players }) {
    const [tab, setTab] = useState('creatures')
    const [narrationText, setNarrationText] = useState('')

    const handleNarration = () => {
        if (!narrationText.trim()) return
        onNarration(narrationText.trim())
        setNarrationText('')
    }

    const handlePrivateRoll = () => {
        const result = rollD20()
        onDiceRoll({ ...result, isPrivate: true, critical: result.natural === 20 ? 'critical-hit' : result.natural === 1 ? 'critical-fail' : null })
    }

    const handleAddNpc = (bestiaryId) => {
        const npc = createNpcFromBestiary(bestiaryId)
        if (npc) onNpcUpdate([...npcs, npc])
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

    return (
        <div className="dm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className="dm-screen card animate-fade-in-scale">
                <div className="dm-header">
                    <h3>🏛️ DM Ekranı</h3>
                    <div className="dm-header-actions">
                        <button className="btn btn-sm btn-ghost" onClick={handlePrivateRoll} title="Gizli d20 at">🔒 d20</button>
                        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="dm-tabs">
                    <button className={`tab-btn ${tab === 'creatures' ? 'active' : ''}`} onClick={() => setTab('creatures')}>👹 Yaratıklar</button>
                    <button className={`tab-btn ${tab === 'narration' ? 'active' : ''}`} onClick={() => setTab('narration')}>📜 Anlatı</button>
                    <button className={`tab-btn ${tab === 'combat' ? 'active' : ''}`} onClick={() => setTab('combat')}>⚔️ Savaş</button>
                </div>

                <div className="dm-content">
                    {/* Creatures Tab — Bestiary + Active NPCs */}
                    {tab === 'creatures' && (
                        <div className="creatures-tab">
                            {/* Active NPCs */}
                            {npcs.length > 0 && (
                                <div className="active-npcs">
                                    <h4>Aktif NPC'ler</h4>
                                    {npcs.map(npc => {
                                        const hpPct = (npc.hp.current / npc.hp.max) * 100
                                        return (
                                            <div key={npc.instanceId} className="npc-row">
                                                <span className="npc-icon">{npc.icon}</span>
                                                <span className="npc-name">{npc.name}</span>
                                                <div className="npc-hp-mini">
                                                    <div className="hp-bar"><div className="hp-fill" style={{ width: `${hpPct}%`, backgroundColor: hpPct > 50 ? 'var(--crimson-light)' : 'var(--crimson)' }} /></div>
                                                    <span className="text-xs">{npc.hp.current}/{npc.hp.max}</span>
                                                </div>
                                                <button className="btn btn-sm btn-danger" onClick={() => adjustNpcHp(npc.instanceId, -5)}>−5</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => adjustNpcHp(npc.instanceId, -1)}>−1</button>
                                                <button className="hp-btn hp-plus" onClick={() => adjustNpcHp(npc.instanceId, 1)}>+</button>
                                                <button className="btn btn-ghost btn-sm" onClick={() => removeNpc(npc.instanceId)}>✕</button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Bestiary */}
                            <h4>Yaratık Ekle</h4>
                            <div className="bestiary-grid">
                                {BESTIARY.map(mon => (
                                    <button key={mon.id} className="bestiary-btn" onClick={() => handleAddNpc(mon.id)}>
                                        <span className="mon-icon">{mon.icon}</span>
                                        <span className="mon-name">{mon.name}</span>
                                        <span className="text-xs text-muted">HP {mon.hp.max} | AC {mon.ac}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Narration Tab */}
                    {tab === 'narration' && (
                        <div className="narration-tab">
                            <p className="text-muted text-sm">Tüm oyunculara gönderilecek anlatı:</p>
                            <textarea
                                className="input narration-input"
                                value={narrationText}
                                onChange={e => setNarrationText(e.target.value)}
                                placeholder="Karanlık orman yolunda ilerlerken..."
                                rows={4}
                            />
                            <button className="btn btn-primary" onClick={handleNarration} disabled={!narrationText.trim()}>
                                📜 Gönder
                            </button>
                        </div>
                    )}

                    {/* Combat Tab */}
                    {tab === 'combat' && (
                        <div className="combat-tab">
                            {!combatState?.isActive ? (
                                <div className="combat-start">
                                    <p className="text-muted text-sm">Oyuncular ve NPC'lerle savaş başlat</p>
                                    <button className="btn btn-primary btn-lg" onClick={handleStartCombat} disabled={npcs.length === 0}>
                                        ⚔️ Savaş Başlat
                                    </button>
                                    {npcs.length === 0 && <p className="text-xs text-muted">Önce Yaratıklar sekmesinden NPC ekle</p>}
                                </div>
                            ) : (
                                <div className="combat-active">
                                    <p>Tur: <strong>{combatState.round}</strong></p>
                                    <button className="btn btn-danger" onClick={() => onCombatUpdate({ ...combatState, isActive: false })}>
                                        Savaşı Bitir
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
