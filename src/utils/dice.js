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

/**
 * Plain-language roll interpretation for beginner guidance.
 */
export function describeRollOutcome(total, natural) {
  if (natural === 20) {
    return {
      level: 'critical-success',
      short: 'Kritik başarı',
      meaning: 'Mükemmel bir sonuç. Çok güçlü etki.',
    }
  }

  if (natural === 1) {
    return {
      level: 'critical-failure',
      short: 'Kritik başarısızlık',
      meaning: 'Ters gitti. Planını değiştirmen gerekebilir.',
    }
  }

  if (total >= 15) {
    return {
      level: 'success',
      short: 'Başarı',
      meaning: 'Hedefini büyük ölçüde başardın.',
    }
  }

  if (total >= 10) {
    return {
      level: 'partial',
      short: 'Kısmi başarı',
      meaning: 'Bir kısmı oldu ama risk devam ediyor.',
    }
  }

  return {
    level: 'failure',
    short: 'Başarısız',
    meaning: 'Bu deneme olmadı. Farklı bir yaklaşım dene.',
  }
}
