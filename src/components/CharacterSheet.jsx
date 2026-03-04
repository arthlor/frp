import { BLOODLINES, STAT_NAMES, formatModifier } from '../data/bloodlines'
import './CharacterSheet.css'

export default function CharacterSheet({ character, onUpdate, bloodline }) {
    if (!character || !bloodline) return null

    const hpPct = Math.max(0, (character.hp.current / character.hp.max) * 100)
    const hpColor = hpPct > 60 ? 'var(--emerald-light)' : hpPct > 25 ? 'var(--gold)' : 'var(--crimson-light)'

    const adjustHp = (delta) => {
        const newHp = Math.max(0, Math.min(character.hp.max, character.hp.current + delta))
        onUpdate({ hp: { ...character.hp, current: newHp } })
    }

    const toggleStatus = (effect) => {
        const has = character.statusEffects.includes(effect)
        onUpdate({
            statusEffects: has
                ? character.statusEffects.filter(e => e !== effect)
                : [...character.statusEffects, effect]
        })
    }

    const STATUS_OPTIONS = ['Charmed', 'Stunned', 'Blinded', 'Poisoned', 'Frightened', 'Prone', 'Invisible']

    return (
        <div className="char-sheet">
            {/* Header */}
            <div className="cs-header" style={{ borderColor: bloodline.color }}>
                <div className="cs-avatar">{character.avatar}</div>
                <div className="cs-identity">
                    <h3 className="cs-name">{character.name}</h3>
                    <div className="cs-bloodline badge badge-gold">
                        {bloodline.icon} {bloodline.name}
                    </div>
                    <div className="cs-archetype text-muted text-xs">
                        {character.modernArchetype || bloodline.modernArchetype}
                    </div>
                </div>
                <div className="cs-level">
                    <span className="level-num">{character.level}</span>
                    <span className="level-label">Seviye</span>
                </div>
            </div>

            {/* HP Bar */}
            <div className="cs-hp-section">
                <div className="hp-info">
                    <span className="hp-label">HP</span>
                    <span className="hp-value" style={{ color: hpColor }}>
                        {character.hp.current}/{character.hp.max}
                    </span>
                    <span className="hp-ac">🛡️ AC {character.ac}</span>
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

            {/* Stats */}
            <div className="cs-stats">
                {Object.entries(character.stats).map(([key, val]) => {
                    const info = STAT_NAMES[key]
                    const isPrimary = key === bloodline.primaryStat
                    const isSecondary = key === bloodline.secondaryStat
                    return (
                        <div key={key} className={`stat-block ${isPrimary ? 'primary' : isSecondary ? 'secondary' : ''}`}>
                            <span className="stat-icon">{info.icon}</span>
                            <span className="stat-mod">{formatModifier(val)}</span>
                            <span className="stat-val">{val}</span>
                            <span className="stat-name">{info.abbrev}</span>
                        </div>
                    )
                })}
            </div>

            <hr className="divider" />

            {/* Domain Powers */}
            <div className="cs-section">
                <h4>⚡ İlahi Güçler</h4>
                <div className="powers-list">
                    {bloodline.domainPowers.map(power => {
                        const active = character.domainPowers.includes(power.name)
                        const locked = power.level > character.level
                        return (
                            <div key={power.name} className={`power-item ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}>
                                <div className="power-header">
                                    <span className="power-name">{power.name}</span>
                                    <span className="power-level badge badge-gold">Lv {power.level}</span>
                                </div>
                                <p className="power-desc text-sm">{power.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Flaws */}
            <div className="cs-section">
                <h4>⚠️ Kusurlar</h4>
                <ul className="flaws-list">
                    {character.flaws.map((flaw, i) => (
                        <li key={i} className="text-sm text-muted">{flaw}</li>
                    ))}
                </ul>
            </div>

            {/* Status Effects */}
            <div className="cs-section">
                <h4>🔮 Durum Efektleri</h4>
                <div className="status-grid">
                    {STATUS_OPTIONS.map(effect => (
                        <button
                            key={effect}
                            className={`status-chip ${character.statusEffects.includes(effect) ? 'active' : ''}`}
                            onClick={() => toggleStatus(effect)}
                        >
                            {effect}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory */}
            <div className="cs-section">
                <h4>🎒 Envanter</h4>
                {character.inventory.length === 0 ? (
                    <p className="text-muted text-sm">Boş</p>
                ) : (
                    <ul className="inventory-list">
                        {character.inventory.map((item, i) => (
                            <li key={i} className="inv-item">
                                <span className="inv-name">{item.name}</span>
                                {item.quantity > 1 && <span className="inv-qty">x{item.quantity}</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Notes */}
            <div className="cs-section">
                <h4>📝 Notlar</h4>
                <textarea
                    className="input cs-notes"
                    value={character.notes}
                    onChange={e => onUpdate({ notes: e.target.value })}
                    placeholder="Arka plan, oturum notları..."
                    rows={3}
                />
            </div>
        </div>
    )
}
