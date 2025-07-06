export interface Participant {
  id: number
  name: string
  amount: number | ''
}

export interface State {
  total: number | ''
  participants: Participant[]
} 