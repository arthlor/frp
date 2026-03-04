import { useState } from 'react'
import { BLOODLINE_LIST, BLOODLINES, createDefaultCharacter } from '../data/bloodlines'
import './CharacterCreator.css'

const PRESET_ARCHETYPES = [
    {
        id: 'tank',
        name: 'Tank',
        icon: '🛡️',
        bloodlineId: 'ares',
        summary: 'Önden gider, darbe yer, takımı korur.',
        hpBonus: 4,
        acBonus: 1,
    },
    {
        id: 'healer',
        name: 'Healer',
        icon: '💚',
        bloodlineId: 'apollo',
        summary: 'Takımı ayakta tutar, toparlanma sağlar.',
        hpBonus: 2,
        acBonus: 0,
    },
    {
        id: 'scout',
        name: 'Scout',
        icon: '🏹',
        bloodlineId: 'hermes',
        summary: 'Hızlı oynar, riskli hamleleri dener.',
        hpBonus: 0,
        acBonus: 2,
    },
    {
        id: 'controller',
        name: 'Kontrol',
        icon: '🧠',
        bloodlineId: 'hades',
        summary: 'Rakibi zayıflatır, alanı kontrol eder.',
        hpBonus: 1,
        acBonus: 1,
    },
    {
        id: 'leader',
        name: 'Lider',
        icon: '⚡',
        bloodlineId: 'zeus',
        summary: 'Karar alır, ekibi yönlendirir.',
        hpBonus: 2,
        acBonus: 0,
    },
    {
        id: 'support',
        name: 'Destek',
        icon: '🌿',
        bloodlineId: 'demeter',
        summary: 'İyileştirir, güvenli oyun kurar.',
        hpBonus: 3,
        acBonus: 0,
    },
]

function createPresetCharacter(name, preset) {
    const base = createDefaultCharacter(name, preset.bloodlineId)
    if (!base) return null

    const hpMax = base.hp.max + preset.hpBonus
    const ac = base.ac + preset.acBonus

    return {
        ...base,
        hp: { current: hpMax, max: hpMax },
        ac,
        notes: `Başlangıç Rolü: ${preset.name}. ${preset.summary}`,
        archetype: preset.id,
    }
}

export default function CharacterCreator({ onComplete, onBack }) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [buildMode, setBuildMode] = useState('preset') // 'preset' | 'custom'
    const [bloodlineId, setBloodlineId] = useState(null)
    const [presetId, setPresetId] = useState(null)

    const selectedBloodline = bloodlineId ? BLOODLINE_LIST.find((b) => b.id === bloodlineId) : null
    const selectedPreset = presetId ? PRESET_ARCHETYPES.find((p) => p.id === presetId) : null
    const presetBloodline = selectedPreset ? BLOODLINES[selectedPreset.bloodlineId] : null

    const handleFinish = () => {
        if (!name.trim()) return

        if (buildMode === 'preset') {
            if (!selectedPreset) return
            const char = createPresetCharacter(name.trim(), selectedPreset)
            if (char) onComplete(char)
            return
        }

        if (!bloodlineId) return
        const char = createDefaultCharacter(name.trim(), bloodlineId)
        onComplete(char)
    }

    return (
        <div className="creator-overlay">
            <div className="creator-container animate-fade-in">
                <div className="creator-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}>1</div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step === 2 ? 'current' : ''}`}>2</div>
                </div>

                {step === 1 && (
                    <div className="creator-step">
                        <h2>⚔️ Kahramanını Adlandır</h2>
                        <p className="text-muted">İda'nın yeni muhafızı kimdir?</p>
                        <div className="form-group">
                            <label>Karakter Adı</label>
                            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn: Kaan, Elif, Demir..." autoFocus maxLength={30} />
                        </div>
                        <div className="creator-actions">
                            <button type="button" className="btn btn-ghost" onClick={onBack}>← Geri</button>
                            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!name.trim()}>Devam →</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="creator-step">
                        <h2>🏛️ Karakterini Seç</h2>
                        <p className="text-muted">Hızlı başlangıç için hazır karakter seçebilir veya soyunu elle belirleyebilirsin.</p>

                        <div className="build-mode-toggle">
                            <button
                                type="button"
                                className={`btn btn-sm ${buildMode === 'preset' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setBuildMode('preset')}
                            >
                                Hazır Karakterler (Önerilen)
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${buildMode === 'custom' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setBuildMode('custom')}
                            >
                                Kendi Soyumu Seç
                            </button>
                        </div>

                        {buildMode === 'preset' ? (
                            <>
                                <div className="preset-grid">
                                    {PRESET_ARCHETYPES.map((preset) => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            className={`preset-card ${presetId === preset.id ? 'selected' : ''}`}
                                            onClick={() => setPresetId(preset.id)}
                                        >
                                            <span className="preset-icon">{preset.icon}</span>
                                            <span className="preset-name">{preset.name}</span>
                                            <span className="preset-bloodline text-xs">{BLOODLINES[preset.bloodlineId].name}</span>
                                            <span className="preset-desc text-xs">{preset.summary}</span>
                                        </button>
                                    ))}
                                </div>
                                {selectedPreset && presetBloodline && (
                                    <div className="bl-preview card animate-fade-in">
                                        <div className="bl-preview-header">
                                            <span style={{ fontSize: '1.5rem' }}>{selectedPreset.icon}</span>
                                            <div>
                                                <strong>{selectedPreset.name}</strong> — {presetBloodline.name}
                                            </div>
                                        </div>
                                        <p className="text-sm">{selectedPreset.summary}</p>
                                        <div className="bl-power text-sm">
                                            <strong>Başlangıç Güç:</strong> {presetBloodline.domainPowers[0].name}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="bloodline-grid">
                                    {BLOODLINE_LIST.map((bl) => (
                                        <button
                                            key={bl.id}
                                            type="button"
                                            className={`bloodline-card ${bloodlineId === bl.id ? 'selected' : ''}`}
                                            onClick={() => setBloodlineId(bl.id)}
                                            style={{ '--bl-color': bl.color }}
                                        >
                                            <span className="bl-icon">{bl.icon}</span>
                                            <span className="bl-name">{bl.name}</span>
                                            <span className="bl-title text-xs">{bl.title}</span>
                                        </button>
                                    ))}
                                </div>
                                {selectedBloodline && (
                                    <div className="bl-preview card animate-fade-in">
                                        <div className="bl-preview-header">
                                            <span style={{ fontSize: '1.5rem' }}>{selectedBloodline.icon}</span>
                                            <div>
                                                <strong>{selectedBloodline.name}</strong> — {selectedBloodline.title}
                                            </div>
                                        </div>
                                        <p className="text-sm">{selectedBloodline.description}</p>
                                        <div className="bl-power text-sm">
                                            <strong>Güç:</strong> {selectedBloodline.domainPowers[0].name}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="creator-actions">
                            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Geri</button>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleFinish}
                                disabled={buildMode === 'preset' ? !presetId : !bloodlineId}
                            >
                                ⚡ Maceraya Başla!
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
