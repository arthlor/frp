import { BLOODLINES, STAT_NAMES, formatModifier } from '../data/bloodlines'
import './PlayerCard.css'

export default function PlayerCard({ player, isMe, isDM, onHpChange, expanded, onToggle }) {
    const char = player.character
    if (!char) {
        return (
            <div className={`player-card no-char ${isMe ? 'is-me' : ''}`}>
                <div className="pc-avatar">👤</div>
                <div className="pc-name">{player.name}</div>
                {player.role === 'dm' && <span className="pc-dm-badge">DM</span>}
                <div className="pc-status text-muted text-xs">Karakter oluşturuyor...</div>
            </div>
        )
    }

    const bloodline = BLOODLINES[char.bloodline]
    if (!bloodline) return null

    const hpPct = Math.max(0, (char.hp.current / char.hp.max) * 100)
    const hpColor = hpPct > 60 ? 'var(--emerald-light)' : hpPct > 25 ? 'var(--gold)' : 'var(--crimson-light)'

    return (
        <div
            className={`player-card ${isMe ? 'is-me' : ''} ${player.role === 'dm' ? 'is-dm' : ''} ${hpPct <= 0 ? 'down' : ''}`}
            style={{ '--bl-color': bloodline.color }}
            onClick={onToggle}
        >
            {/* Compact View (always visible) */}
            <div className="pc-compact">
                <div className="pc-avatar-area">
                    <span className="pc-avatar">{char.avatar}</span>
                    {player.role === 'dm' && <span className="pc-dm-badge">DM</span>}
                </div>
                <div className="pc-info">
                    <div className="pc-name-row">
                        <span className="pc-name">{char.name}</span>
                        <span className="pc-bloodline-badge" style={{ color: bloodline.color }}>{bloodline.icon} {bloodline.name}</span>
                    </div>
                    <div className="pc-hp-row">
                        <div className="pc-hp-bar">
                            <div className="pc-hp-fill" style={{ width: `${hpPct}%`, backgroundColor: hpColor }} />
                        </div>
                        <span className="pc-hp-text" style={{ color: hpColor }}>{char.hp.current}/{char.hp.max}</span>
                        <span className="pc-ac">🛡️{char.ac}</span>
                    </div>
                    {/* Status Effects */}
                    {char.statusEffects.length > 0 && (
                        <div className="pc-effects">
                            {char.statusEffects.map(e => (
                                <span key={e} className="pc-effect-chip">{e}</span>
                            ))}
                        </div>
                    )}
                </div>
                {/* HP buttons for own card or DM */}
                {(isMe || isDM) && (
                    <div className="pc-hp-controls">
                        <button className="hp-btn hp-minus" onClick={(e) => { e.stopPropagation(); onHpChange(-1) }}>−</button>
                        <button className="hp-btn hp-plus" onClick={(e) => { e.stopPropagation(); onHpChange(1) }}>+</button>
                    </div>
                )}
            </div>

            {/* Expanded View (click to toggle) */}
            {expanded && (
                <div className="pc-expanded animate-fade-in" onClick={e => e.stopPropagation()}>
                    <div className="pc-stats-grid">
                        {Object.entries(char.stats).map(([key, val]) => {
                            const info = STAT_NAMES[key]
                            const isPrimary = key === bloodline.primaryStat
                            return (
                                <div key={key} className={`pc-stat ${isPrimary ? 'primary' : ''}`}>
                                    <span className="pc-stat-icon">{info.icon}</span>
                                    <span className="pc-stat-mod">{formatModifier(val)}</span>
                                    <span className="pc-stat-name">{info.abbrev}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="pc-powers">
                        <div className="pc-section-title">İlahi Güçler</div>
                        {bloodline.domainPowers.filter(p => char.domainPowers.includes(p.name)).map(p => (
                            <div key={p.name} className="pc-power">
                                <strong>{p.name}</strong>: {p.description}
                            </div>
                        ))}
                    </div>

                    {char.flaws.length > 0 && (
                        <div className="pc-flaws">
                            <div className="pc-section-title">Kusurlar</div>
                            {char.flaws.map((f, i) => (
                                <span key={i} className="pc-flaw-chip">⚠ {f}</span>
                            ))}
                        </div>
                    )}

                    {char.inventory.length > 0 && (
                        <div className="pc-inventory">
                            <div className="pc-section-title">Envanter</div>
                            {char.inventory.map((item, i) => (
                                <span key={i} className="pc-inv-item">{item.name}{item.quantity > 1 ? ` x${item.quantity}` : ''}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
