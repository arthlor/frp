import { STAT_NAMES, formatModifier } from '../data/bloodlines'
import './CharacterSheet.css'

export default function CharacterSheet({ character, onUpdate, bloodline, onStatCheck }) {
    if (!character || !bloodline) return null

    const hpPct = Math.max(0, (character.hp.current / character.hp.max) * 100)
    const hpColor = hpPct > 60 ? 'var(--emerald-light)' : hpPct > 25 ? 'var(--gold)' : 'var(--crimson-light)'

    const adjustHp = (delta) => {
        const newHp = Math.max(0, Math.min(character.hp.max, character.hp.current + delta))
        onUpdate({ hp: { ...character.hp, current: newHp } })
    }

    return (
        <div className="char-sheet">
            <div className="cs-header" style={{ borderColor: bloodline.color }}>
                <div className="cs-avatar">{character.avatar}</div>
                <div className="cs-identity">
                    <h3 className="cs-name">{character.name}</h3>
                    <div className="cs-bloodline badge badge-gold">
                        {bloodline.icon} {bloodline.name}
                    </div>
                </div>
                <div className="cs-level">
                    <span className="level-num">{character.level}</span>
                    <span className="level-label">Seviye</span>
                </div>
            </div>

            <div className="cs-hp-section">
                <div className="hp-info">
                    <span className="hp-label">Can (HP)</span>
                    <span className="hp-value" style={{ color: hpColor }}>{character.hp.current}/{character.hp.max}</span>
                    <span className="hp-ac">🛡️ <abbr className="glossary-term" title="Zırh (AC): Sana vurmanın ne kadar zor olduğunu gösterir.">Zırh (AC)</abbr> {character.ac}</span>
                </div>
                <div className="hp-bar">
                    <div className="hp-fill" style={{ width: `${hpPct}%`, backgroundColor: hpColor }} />
                </div>
                <div className="hp-controls">
                    <button className="btn btn-sm btn-danger" onClick={() => adjustHp(-1)}>−1</button>
                    <button className="btn btn-sm btn-danger" onClick={() => adjustHp(-5)}>−5</button>
                    <button className="btn btn-sm" onClick={() => adjustHp(5)} style={{ borderColor: 'var(--emerald-light)', color: 'var(--emerald-light)' }}>+5</button>
                    <button className="btn btn-sm" onClick={() => adjustHp(1)} style={{ borderColor: 'var(--emerald-light)', color: 'var(--emerald-light)' }}>+1</button>
                </div>
            </div>

            <hr className="divider" />

            <div className="cs-stats">
                {Object.entries(character.stats).map(([key, val]) => {
                    const info = STAT_NAMES[key]
                    return (
                        <button
                            key={key}
                            type="button"
                            className="stat-block stat-clickable"
                            onClick={() => onStatCheck?.(key, val)}
                            title={`${info.name} kontrolü için tıkla`}
                        >
                            <span className="stat-icon">{info.icon}</span>
                            <span className="stat-mod">{formatModifier(val)}</span>
                            <span className="stat-val">{val}</span>
                            <span className="stat-name">{info.abbrev}</span>
                        </button>
                    )
                })}
            </div>
            <p className="text-xs text-muted">İpucu: Bir stata tıklayarak hızlı kontrol zarı atabilirsin.</p>

            <hr className="divider" />

            <div className="cs-section">
                <h4>⚡ İlahi Güç</h4>
                <div className="power-item active">
                    <div className="power-name">{bloodline.domainPowers[0].name}</div>
                    <p className="power-desc text-sm">{bloodline.domainPowers[0].description}</p>
                </div>
            </div>

            <div className="cs-section">
                <h4>📝 Notlar</h4>
                <textarea
                    className="input cs-notes"
                    value={character.notes}
                    onChange={e => onUpdate({ notes: e.target.value })}
                    placeholder="Oturum notları..."
                    rows={3}
                />
            </div>
        </div>
    )
}
