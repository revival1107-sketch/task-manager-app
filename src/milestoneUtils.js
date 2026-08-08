function parseLocalDate(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

// 'red' = D-3 이내(마감 임박/지남), 'yellow' = D-7 이내, 'green' = 그 이상 여유.
export function getUrgencyLevel(dateStr) {
  const target = parseLocalDate(dateStr)
  if (!target) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - today) / 86400000)
  if (diffDays <= 3) return 'red'
  if (diffDays <= 7) return 'yellow'
  return 'green'
}

export const URGENCY_DOT_CLASS = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
}

export const URGENCY_LABEL = {
  red: '마감 임박 (3일 이내)',
  yellow: '마감 다가옴 (7일 이내)',
  green: '여유 있음',
}

// 미완료 마일스톤 중 날짜가 가장 가까운(가장 이른) 것을 반환. 없으면 null.
export function nearestIncompleteMilestone(milestones) {
  let nearest = null
  let nearestDate = null
  for (const m of milestones) {
    if (m.completed) continue
    const d = parseLocalDate(m.date)
    if (!d) continue
    if (!nearestDate || d < nearestDate) {
      nearest = m
      nearestDate = d
    }
  }
  return nearest
}
