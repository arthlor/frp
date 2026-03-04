/**
 * Dice rolling — d20 only system
 * İda'nın Son Muhafızları
 */

export function rollD20(modifier = 0) {
  const roll = Math.floor(Math.random() * 20) + 1
  return {
    formula: modifier !== 0 ? `d20${modifier >= 0 ? '+' : ''}${modifier}` : 'd20',
    rolls: [roll],
    modifier,
    total: roll + modifier,
    natural: roll,
  }
}

export function rollAdvantage(modifier = 0) {
  const r1 = Math.floor(Math.random() * 20) + 1
  const r2 = Math.floor(Math.random() * 20) + 1
  const kept = Math.max(r1, r2)
  return {
    formula: 'd20 (Avantaj)',
    rolls: [r1, r2],
    kept,
    modifier,
    total: kept + modifier,
    natural: kept,
  }
}

export function rollDisadvantage(modifier = 0) {
  const r1 = Math.floor(Math.random() * 20) + 1
  const r2 = Math.floor(Math.random() * 20) + 1
  const kept = Math.min(r1, r2)
  return {
    formula: 'd20 (Dezavantaj)',
    rolls: [r1, r2],
    kept,
    modifier,
    total: kept + modifier,
    natural: kept,
  }
}

export function getCritical(natural) {
  if (natural === 20) return 'critical-hit'
  if (natural === 1) return 'critical-fail'
  return null
}
