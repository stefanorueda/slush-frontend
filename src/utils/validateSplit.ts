// File: src/utils/validateSplit.ts

import type { Participant } from '@/pages/index'

export function validateSplitTotal(total: number | '', participants: Participant[]): boolean {
  if (total === '' || participants.length === 0) return false

  const totalSplit = participants.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  return Number(total.toFixed(2)) === Number(totalSplit.toFixed(2))
}
