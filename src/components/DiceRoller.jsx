import { useState } from 'react'
import {
    rollD20,
    rollAdvantage,
    rollDisadvantage,
    getCritical,
    describeRollOutcome,
} from '../utils/dice'
import './DiceRoller.css'

export default function DiceRoller({ onRoll, history, isDM }) {
    const [modifier, setModifier] = useState(0)
    const [isPrivate, setIsPrivate] = useState(false)
    const [lastRoll, setLastRoll] = useState(null)
    const [isRolling, setIsRolling] = useState(false)

    const doRoll = (result) => {
        setIsRolling(true)
        setLastRoll(result)
        setTimeout(() => setIsRolling(false), 600)
        const critical = getCritical(result.natural)
        const outcome = describeRollOutcome(result.total, result.natural)
        onRoll({ ...result, isPrivate, critical, outcome })
    }

    const critClass = lastRoll ? getCritical(lastRoll.natural) : null
    const lastOutcome = lastRoll ? describeRollOutcome(lastRoll.total, lastRoll.natural) : null

    return (
        <div className="dice-roller">
            {/* Last Roll Display */}
            {lastRoll && (
                <div className={`dice-result ${isRolling ? 'rolling' : ''} ${critClass || ''}`}>
                    <div className="result-total">{lastRoll.total}</div>
                    <div className="result-detail">
                        {lastRoll.formula} → [{lastRoll.rolls.join(', ')}]
                        {lastRoll.modifier ? ` ${lastRoll.modifier >= 0 ? '+' : ''}${lastRoll.modifier}` : ''}
                    </div>
                    {lastOutcome && (
                        <div className="result-outcome">
                            {lastOutcome.short}: {lastOutcome.meaning}
                        </div>
                    )}
                    {critClass === 'critical-hit' && <div className="crit-text crit-success">🎯 KRİTİK VURUŞ!</div>}
                    {critClass === 'critical-fail' && <div className="crit-text crit-fail">💀 KRİTİK BAŞARISIZLIK!</div>}
                </div>
            )}

            {/* Main d20 Button */}
            <button className="d20-btn" onClick={() => doRoll(rollD20(modifier))}>
                <span className="d20-icon">🎲</span>
                <span className="d20-label">d20</span>
            </button>

            {/* Advantage / Disadvantage */}
            <div className="dice-row">
                <button className="btn btn-sm" onClick={() => doRoll(rollAdvantage(modifier))}>
                    ▲ Avantaj
                </button>
                <button className="btn btn-sm" onClick={() => doRoll(rollDisadvantage(modifier))}>
                    ▼ Dezavantaj
                </button>
            </div>

            {/* Modifier */}
            <div className="dice-modifier">
                <span className="mod-label">Bonus:</span>
                <button className="btn btn-sm btn-ghost" onClick={() => setModifier(m => m - 1)}>−</button>
                <span className="mod-value">{modifier >= 0 ? `+${modifier}` : modifier}</span>
                <button className="btn btn-sm btn-ghost" onClick={() => setModifier(m => m + 1)}>+</button>
                {modifier !== 0 && <button className="btn btn-sm btn-ghost" onClick={() => setModifier(0)}>⟲</button>}
            </div>

            {/* DM private toggle */}
            {isDM && (
                <label className="private-toggle">
                    <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
                    <span>🔒 Gizli Zar</span>
                </label>
            )}

            {/* Roll History */}
            {history.length > 0 && (
                <div className="dice-history">
                    {history.slice(0, 8).map(entry => (
                        <div key={entry.id} className={`history-entry ${entry.critical || ''} ${entry.isPrivate ? 'private' : ''}`}>
                            <span className="hist-name">{entry.playerName}</span>
                            <span className="hist-formula">{entry.formula}</span>
                            <span className="hist-nat">({entry.natural})</span>
                            <span className="hist-result">{entry.total}</span>
                            {entry.isPrivate && <span className="hist-private">🔒</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
