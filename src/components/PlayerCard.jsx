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
            {/* Compact View */}
            <div className="pc-compact">
                <div className="pc-avatar-area">
                    <span className="pc-avatar">{char.avatar}</span>
                    {player.role === 'dm' && <span className="pc-dm-badge">DM</span>}
                </div>
                <div className="pc-info">
                    <div className="pc-name-row">
                        <span className="pc-name">{char.name}</span>
                        <span className="pc-bloodline-badge" style={{ color: bloodline.color }}>{bloodline.icon}</span>
                    </div>
                    <div className="pc-hp-row">
                        <div className="pc-hp-bar">
                            <div className="pc-hp-fill" style={{ width: `${hpPct}%`, backgroundColor: hpColor }} />
                        </div>
                        <span className="pc-hp-text" style={{ color: hpColor }}>{char.hp.current}/{char.hp.max}</span>
                    </div>
                </div>
                {(isMe || isDM) && (
                    <div className="pc-hp-controls">
                        <button className="hp-btn hp-minus" onClick={(e) => { e.stopPropagation(); onHpChange(-1) }}>−</button>
                        <button className="hp-btn hp-plus" onClick={(e) => { e.stopPropagation(); onHpChange(1) }}>+</button>
                    </div>
                )}
            </div>

            {/* Expanded: just stats + power */}
            {expanded && (
                <div className="pc-expanded animate-fade-in" onClick={e => e.stopPropagation()}>
                    <div className="pc-stats-grid">
                        {Object.entries(char.stats).map(([key, val]) => (
                            <div key={key} className="pc-stat">
                                <span className="pc-stat-mod">{formatModifier(val)}</span>
                                <span className="pc-stat-name">{STAT_NAMES[key].abbrev}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pc-power text-xs">
                        ⚡ {bloodline.domainPowers[0].name}
                    </div>
                </div>
            )}
        </div>
    )
}
