import './PlayerBar.css'

export default function PlayerBar({ players, currentPlayerId }) {
    const playerList = Object.values(players)

    return (
        <div className="player-bar">
            {playerList.map(p => {
                const char = p.character
                const isMe = p.id === currentPlayerId
                const hpPct = char ? Math.max(0, (char.hp.current / char.hp.max) * 100) : 100
                const hpColor = hpPct > 60 ? 'var(--emerald-light)' : hpPct > 25 ? 'var(--gold)' : 'var(--crimson-light)'
                return (
                    <div key={p.id} className={`player-pip ${isMe ? 'is-me' : ''} ${p.isOnline ? '' : 'offline'}`}>
                        <span className="pip-avatar">{char?.avatar || '👤'}</span>
                        <div className="pip-info">
                            <span className="pip-name">
                                {p.name}
                                {p.role === 'dm' && <span className="pip-dm">DM</span>}
                            </span>
                            {char && (
                                <div className="pip-hp-bar">
                                    <div className="pip-hp-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
