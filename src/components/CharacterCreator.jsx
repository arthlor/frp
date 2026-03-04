import { useState } from 'react'
import { BLOODLINE_LIST, STAT_NAMES, STAT_KEYS, createDefaultCharacter, getModifier, formatModifier } from '../data/bloodlines'
import './CharacterCreator.css'

const POINT_BUY_TOTAL = 27
const STAT_MIN = 8
const STAT_MAX = 15

function calcPointCost(val) {
    if (val <= 13) return val - 8
    if (val === 14) return 7
    if (val === 15) return 9
    return 0
}

function calcTotalPoints(stats) {
    return Object.values(stats).reduce((sum, v) => sum + calcPointCost(v), 0)
}

export default function CharacterCreator({ onComplete, onBack }) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [archetype, setArchetype] = useState('')
    const [bloodlineId, setBloodlineId] = useState(null)
    const [stats, setStats] = useState({
        güç: 10, çeviklik: 10, dayanıklılık: 10, zeka: 10, irade: 10, karizma: 10,
    })

    const selectedBloodline = bloodlineId ? BLOODLINE_LIST.find(b => b.id === bloodlineId) : null
    const pointsUsed = calcTotalPoints(stats)
    const pointsRemaining = POINT_BUY_TOTAL - pointsUsed

    const adjustStat = (key, delta) => {
        const newVal = stats[key] + delta
        if (newVal < STAT_MIN || newVal > STAT_MAX) return
        const newStats = { ...stats, [key]: newVal }
        if (calcTotalPoints(newStats) > POINT_BUY_TOTAL) return
        setStats(newStats)
    }

    const handleFinish = () => {
        const char = createDefaultCharacter(name, bloodlineId)
        char.modernArchetype = archetype
        // Apply custom stat allocation
        const finalStats = { ...stats }
        if (selectedBloodline) {
            finalStats[selectedBloodline.primaryStat] += selectedBloodline.primaryBonus
            finalStats[selectedBloodline.secondaryStat] += selectedBloodline.secondaryBonus
        }
        char.stats = finalStats
        char.hp.max = 10 + getModifier(finalStats.dayanıklılık) * 2
        char.hp.current = char.hp.max
        char.ac = 10 + getModifier(finalStats.çeviklik)
        onComplete(char)
    }

    return (
        <div className="creator-overlay">
            <div className="creator-container animate-fade-in">
                <div className="creator-progress">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`progress-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
                            {s}
                        </div>
                    ))}
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
                        <div className="form-group">
                            <label>Modern Meslek / Arketip</label>
                            <input className="input" value={archetype} onChange={e => setArchetype(e.target.value)} placeholder="Örn: Arkeoloji öğrencisi, Dağcı, İtfaiyeci..." maxLength={60} />
                        </div>
                        <div className="creator-actions">
                            <button type="button" className="btn btn-ghost" onClick={onBack}>← Geri</button>
                            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!name.trim()}>Devam →</button>
                        </div>
                    </div>
                )}

                {/* Step 2: Bloodline */}
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
                                    <span className="bl-bonus text-xs">
                                        +2 {STAT_NAMES[bl.primaryStat].abbrev} / +1 {STAT_NAMES[bl.secondaryStat].abbrev}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {selectedBloodline && (
                            <div className="bl-preview card animate-fade-in">
                                <p className="text-sm">{selectedBloodline.description}</p>
                                <div className="bl-power">
                                    <strong>Başlangıç Gücü:</strong> {selectedBloodline.domainPowers[0].name} — {selectedBloodline.domainPowers[0].description}
                                </div>
                            </div>
                        )}
                        <div className="creator-actions">
                            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Geri</button>
                            <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!bloodlineId}>Devam →</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Stats */}
                {step === 3 && (
                    <div className="creator-step">
                        <h2>📊 Statülerini Dağıt</h2>
                        <p className="text-muted">
                            {POINT_BUY_TOTAL} puanı 6 statü arasında dağıt.
                            Kalan: <strong className={pointsRemaining > 0 ? 'text-gold' : ''}>{pointsRemaining}</strong>
                        </p>
                        <div className="stat-allocator">
                            {STAT_KEYS.map(key => {
                                const info = STAT_NAMES[key]
                                const val = stats[key]
                                const bonus = key === selectedBloodline?.primaryStat ? selectedBloodline.primaryBonus :
                                    key === selectedBloodline?.secondaryStat ? selectedBloodline.secondaryBonus : 0
                                const finalVal = val + bonus
                                return (
                                    <div key={key} className="alloc-row">
                                        <span className="alloc-icon">{info.icon}</span>
                                        <span className="alloc-name">{info.name}</span>
                                        <button className="btn btn-sm btn-ghost" onClick={() => adjustStat(key, -1)} disabled={val <= STAT_MIN}>−</button>
                                        <span className="alloc-val">{val}</span>
                                        <button className="btn btn-sm btn-ghost" onClick={() => adjustStat(key, 1)} disabled={val >= STAT_MAX || pointsRemaining <= 0}>+</button>
                                        {bonus > 0 && <span className="alloc-bonus text-gold">+{bonus}</span>}
                                        <span className="alloc-final">= {finalVal} ({formatModifier(finalVal)})</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="creator-actions">
                            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Geri</button>
                            <button className="btn btn-primary" onClick={() => setStep(4)} disabled={pointsRemaining < 0}>Devam →</button>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                    <div className="creator-step">
                        <h2>✨ Karakterini Onayla</h2>
                        <div className="review-card card">
                            <div className="review-header">
                                <span className="review-avatar">{selectedBloodline?.icon}</span>
                                <div>
                                    <h3>{name}</h3>
                                    <span className="badge badge-gold">{selectedBloodline?.name}</span>
                                    {archetype && <span className="text-muted text-xs" style={{ display: 'block', marginTop: 4 }}>{archetype}</span>}
                                </div>
                            </div>
                            <div className="review-stats">
                                {STAT_KEYS.map(key => {
                                    const info = STAT_NAMES[key]
                                    const bonus = key === selectedBloodline?.primaryStat ? selectedBloodline.primaryBonus :
                                        key === selectedBloodline?.secondaryStat ? selectedBloodline.secondaryBonus : 0
                                    const finalVal = stats[key] + bonus
                                    return (
                                        <div key={key} className="review-stat">
                                            <span>{info.icon} {info.abbrev}</span>
                                            <strong>{finalVal} ({formatModifier(finalVal)})</strong>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="review-power">
                                <strong>İlahi Güç:</strong> {selectedBloodline?.domainPowers[0].name}
                            </div>
                        </div>
                        <div className="creator-actions">
                            <button className="btn btn-ghost" onClick={() => setStep(3)}>← Geri</button>
                            <button className="btn btn-primary btn-lg" onClick={handleFinish}>⚡ Maceraya Başla!</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
