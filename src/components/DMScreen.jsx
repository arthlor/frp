import { useState } from 'react'
import { BESTIARY, createNpcFromBestiary } from '../data/bestiary'
import { rollD20, describeRollOutcome } from '../utils/dice'
import './DMScreen.css'

const ENCOUNTER_PRESETS = [
    {
        id: 'easy',
        label: 'Kolay',
        description: 'Yeni grup için yumuşak giriş.',
        roster: ['satyr', 'satyr', 'truva-hayaletleri'],
    },
    {
        id: 'medium',
        label: 'Orta',
        description: 'Denge savaşı, dikkat ister.',
        roster: ['satyr', 'truva-hayaletleri', 'drakon-phrygios'],
    },
    {
        id: 'hard',
        label: 'Zor',
        description: 'Sert çatışma, ekip koordinasyonu şart.',
        roster: ['drakon-phrygios', 'tahta-at-golemi', 'truva-hayaletleri'],
    },
]

const OPENING_TEMPLATES = [
    'Gece çöktü. Kaz Dağları sessiz ama hava tuhaf bir enerjiyle titriyor. Uzakta bir ışık yarığı açılıyor...',
    'Sazlı Köyü meydanında insanlar telaşlı. Toprak sarsıldı ve tepenin üzerinden mor bir parıltı yükseldi.',
    'Rüzgar bir anda yön değiştirdi. Köpekler aynı noktaya havlıyor. Eski bir kapı yeniden açılıyor olabilir.',
]

export default function DMScreen({ onClose, onDiceRoll, onNarration, combatState, onCombatUpdate, npcs, onNpcUpdate, players }) {
    const [tab, setTab] = useState('creatures')
    const [narrationText, setNarrationText] = useState('')
    const [checklist, setChecklist] = useState({
        intro: false,
        firstRoll: false,
        firstCombat: false,
    })

    const handleNarration = () => {
        if (!narrationText.trim()) return
        onNarration(narrationText.trim())
        setChecklist((prev) => ({ ...prev, intro: true }))
        setNarrationText('')
    }

    const handlePrivateRoll = () => {
        const result = rollD20()
        const outcome = describeRollOutcome(result.total, result.natural)
        onDiceRoll({
            ...result,
            isPrivate: true,
            outcome,
            critical: result.natural === 20 ? 'critical-hit' : result.natural === 1 ? 'critical-fail' : null,
        })
        setChecklist((prev) => ({ ...prev, firstRoll: true }))
    }

    const handleAddNpc = (bestiaryId) => {
        const npc = createNpcFromBestiary(bestiaryId)
        if (npc) onNpcUpdate([...npcs, npc])
    }

    const handleApplyPreset = (presetId) => {
        const preset = ENCOUNTER_PRESETS.find((p) => p.id === presetId)
        if (!preset) return

        const generated = preset.roster
            .map((id) => createNpcFromBestiary(id))
            .filter(Boolean)

        if (generated.length === 0) return
        onNpcUpdate([...npcs, ...generated])
    }

    const adjustNpcHp = (instanceId, delta) => {
        onNpcUpdate(npcs.map((n) => (
            n.instanceId === instanceId
                ? { ...n, hp: { ...n.hp, current: Math.max(0, Math.min(n.hp.max, n.hp.current + delta)) } }
                : n
        )))
    }

    const removeNpc = (instanceId) => {
        onNpcUpdate(npcs.filter((n) => n.instanceId !== instanceId))
    }

    const handleStartCombat = () => {
        const initiative = [
            ...Object.values(players).filter((p) => p.character).map((p) => ({
                id: p.id,
                name: p.character.name,
                roll: 0,
                isNPC: false,
            })),
            ...npcs.map((n) => ({
                id: n.instanceId,
                name: n.name,
                roll: 0,
                isNPC: true,
            })),
        ]
        onCombatUpdate({ isActive: true, round: 1, turnIndex: 0, initiative })
        setChecklist((prev) => ({ ...prev, firstCombat: true }))
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
                    {tab === 'creatures' && (
                        <div className="creatures-tab">
                            <div className="encounter-presets card">
                                <h4>⚙️ Hızlı Karşılaşma</h4>
                                <div className="preset-buttons">
                                    {ENCOUNTER_PRESETS.map((preset) => (
                                        <button key={preset.id} className="btn btn-sm" onClick={() => handleApplyPreset(preset.id)}>
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-muted">Kolay / Orta / Zor paketleri mevcut NPC listesine eklenir.</p>
                            </div>

                            {npcs.length > 0 && (
                                <div className="active-npcs">
                                    <h4>Aktif NPC'ler</h4>
                                    {npcs.map((npc) => {
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

                            <h4>Yaratık Ekle</h4>
                            <div className="bestiary-grid">
                                {BESTIARY.map((mon) => (
                                    <button key={mon.id} className="bestiary-btn" onClick={() => handleAddNpc(mon.id)}>
                                        <span className="mon-icon">{mon.icon}</span>
                                        <span className="mon-name">{mon.name}</span>
                                        <span className="text-xs text-muted">Can (HP) {mon.hp.max} | Zırh (AC) {mon.ac}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === 'narration' && (
                        <div className="narration-tab">
                            <p className="text-muted text-sm">Tüm oyunculara gönderilecek anlatı:</p>

                            <div className="narration-templates">
                                {OPENING_TEMPLATES.map((template, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => setNarrationText(template)}
                                    >
                                        Açılış Şablonu {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className="input narration-input"
                                value={narrationText}
                                onChange={(e) => setNarrationText(e.target.value)}
                                placeholder="Karanlık orman yolunda ilerlerken..."
                                rows={4}
                            />
                            <button className="btn btn-primary" onClick={handleNarration} disabled={!narrationText.trim()}>
                                📜 Gönder
                            </button>
                        </div>
                    )}

                    {tab === 'combat' && (
                        <div className="combat-tab">
                            <div className="dm-checklist card">
                                <h4>✅ Oturum Başlangıç Kontrol Listesi</h4>
                                <label><input type="checkbox" checked={checklist.intro} onChange={(e) => setChecklist((prev) => ({ ...prev, intro: e.target.checked }))} /> Giriş anlatısını yaptım</label>
                                <label><input type="checkbox" checked={checklist.firstRoll} onChange={(e) => setChecklist((prev) => ({ ...prev, firstRoll: e.target.checked }))} /> İlk zarı attırdım</label>
                                <label><input type="checkbox" checked={checklist.firstCombat} onChange={(e) => setChecklist((prev) => ({ ...prev, firstCombat: e.target.checked }))} /> İlk savaşı başlattım</label>
                            </div>

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
