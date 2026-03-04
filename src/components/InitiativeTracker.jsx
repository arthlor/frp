import { rollD20 } from '../utils/dice'
import './InitiativeTracker.css'

export default function InitiativeTracker({
    combatState,
    onUpdate,
    isDM,
    players,
    onTurnAdvance,
    onPracticeTurnEnd,
}) {
    if (!combatState?.isActive) return null

    const { round, turnIndex, initiative } = combatState
    const currentTurn = initiative[turnIndex]

    const handleRollInitiative = (idx) => {
        if (!isDM) return
        const result = rollD20()
        const updated = [...initiative]
        updated[idx] = { ...updated[idx], roll: result.total }
        updated.sort((a, b) => b.roll - a.roll)
        onUpdate({ ...combatState, initiative: updated, turnIndex: 0 })
    }

    const handleNextTurn = () => {
        let next = turnIndex + 1
        let newRound = round
        if (next >= initiative.length) {
            next = 0
            newRound += 1
        }
        onUpdate({ ...combatState, turnIndex: next, round: newRound })
        onTurnAdvance?.()
    }

    const handlePrevTurn = () => {
        let prev = turnIndex - 1
        let newRound = round
        if (prev < 0) {
            prev = initiative.length - 1
            newRound = Math.max(1, newRound - 1)
        }
        onUpdate({ ...combatState, turnIndex: prev, round: newRound })
    }

    return (
        <div className="initiative-tracker card">
            <div className="init-header">
                <h4>⚔️ Sıra (İnisiyatif) — Tur {round}</h4>
                {isDM && (
                    <div className="init-controls">
                        <button className="btn btn-sm btn-ghost" onClick={handlePrevTurn}>◀</button>
                        <button className="btn btn-sm btn-primary" onClick={handleNextTurn}>Sonraki ▶</button>
                    </div>
                )}
            </div>

            <div className="turn-helper">
                <p><strong>Şimdi:</strong> {currentTurn?.name || 'Bilinmiyor'}</p>
                <p><strong>Öneri:</strong> Saldır veya Yardım seç.</p>
                {isDM ? (
                    <p><strong>Sonra:</strong> Tur bitince <em>Sonraki</em> düğmesine bas.</p>
                ) : (
                    <div className="turn-helper-player">
                        <p><strong>Sonra:</strong> Hamleni bitirdiğinde “Sıram Bitti” de.</p>
                        <button className="btn btn-sm btn-ghost" onClick={() => onPracticeTurnEnd?.()}>✅ Sıram Bitti</button>
                    </div>
                )}
            </div>

            <div className="init-list">
                {initiative.map((entry, idx) => (
                    <div
                        key={entry.id}
                        className={`init-entry ${idx === turnIndex ? 'active-turn' : ''} ${entry.isNPC ? 'npc' : ''}`}
                    >
                        <span className="init-order">{idx + 1}</span>
                        <span className="init-name">{entry.name}</span>
                        {entry.isNPC && <span className="badge badge-crimson" style={{ fontSize: '9px' }}>NPC</span>}
                        <span className="init-roll">
                            {entry.roll > 0 ? entry.roll : '—'}
                        </span>
                        {isDM && (
                            <button className="btn btn-sm btn-ghost" onClick={() => handleRollInitiative(idx)} title="İnisiyatif at">
                                🎲
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
