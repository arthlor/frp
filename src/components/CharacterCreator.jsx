import { useState } from 'react'
import { BLOODLINE_LIST, STAT_NAMES, STAT_KEYS, createDefaultCharacter, formatModifier } from '../data/bloodlines'
import './CharacterCreator.css'

export default function CharacterCreator({ onComplete, onBack }) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [bloodlineId, setBloodlineId] = useState(null)

    const selectedBloodline = bloodlineId ? BLOODLINE_LIST.find(b => b.id === bloodlineId) : null

    const handleFinish = () => {
        if (!name.trim() || !bloodlineId) return
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

                {/* Step 1: Name */}
                {step === 1 && (
                    <div className="creator-step">
                        <h2>⚔️ Kahramanını Adlandır</h2>
                        <p className="text-muted">İda'nın yeni muhafızı kimdir?</p>
                        <div className="form-group">
                            <label>Karakter Adı</label>
                            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Kaan, Elif, Demir..." autoFocus maxLength={30} />
                        </div>
                        <div className="creator-actions">
                            <button type="button" className="btn btn-ghost" onClick={onBack}>← Geri</button>
                            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!name.trim()}>Devam →</button>
                        </div>
                    </div>
                )}

                {/* Step 2: Bloodline + Confirm */}
                {step === 2 && (
                    <div className="creator-step">
                        <h2>🏛️ İlahi Soyunu Seç</h2>
                        <p className="text-muted">Hangi Olimposlu'nun kanı damarlarında akıyor?</p>
                        <div className="bloodline-grid">
                            {BLOODLINE_LIST.map(bl => (
                                <button
                                    key={bl.id}
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
                        <div className="creator-actions">
                            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Geri</button>
                            <button className="btn btn-primary btn-lg" onClick={handleFinish} disabled={!bloodlineId}>
                                ⚡ Maceraya Başla!
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
