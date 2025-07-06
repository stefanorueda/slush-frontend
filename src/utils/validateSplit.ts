// File: src/utils/validateSplit.ts

import { Participant } from '@/types'

export function validateSplitTotal(total: number | '', participants: Participant[]): boolean {
  if (total === '' || participants.length === 0) return false
  
  const sum = participants.reduce((acc, p) => acc + (typeof p.amount === 'number' ? p.amount : 0), 0)
  return Math.abs(Number(total) - sum) < 0.01
}
