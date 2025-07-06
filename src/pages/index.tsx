// File: src/pages/index.tsx

import { useReducer, useState } from 'react'
import ParticipantRow from '@/components/ParticipantRow'
import { validateSplitTotal } from '@/utils/validateSplit'
import { Button } from '@/components/ui/button'
import { Participant, State } from '@/types'

const initialState: State = {
  total: '',
  participants: [{ id: 1, name: '', amount: '' }],
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'SET_TOTAL':
      return { ...state, total: action.payload }
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, { id: Date.now(), name: '', amount: '' }],
      }
    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
      }
    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      }
    case 'EVEN_SPLIT':
      const evenAmount = state.total && state.participants.length > 0 ?
        Number((Number(state.total) / state.participants.length).toFixed(2)) : ''
      return {
        ...state,
        participants: state.participants.map((p) => ({ ...p, amount: evenAmount }))
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      const splits = Object.fromEntries(
        state.participants.map((p) => [p.name, Number(p.amount)])
      )

      const response = await fetch('https://slush-backend-production-bc16.up.railway.app/validate-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: Number(state.total), splits }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.message)
    } catch (error) {
      console.error('Error:', error)
      setResult(`Error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)
    }
  }

  const isValid = validateSplitTotal(state.total, state.participants)

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manual Bill Splitter</h1>

      <input
        type="number"
        placeholder="Enter total amount"
        value={state.total}
        onChange={(e) => dispatch({ type: 'SET_TOTAL', payload: Number(e.target.value) })}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mb-4"
      />

      {state.participants.map((p) => (
        <ParticipantRow
          key={p.id}
          id={p.id}
          name={p.name}
          amount={p.amount}
          onChange={(data) => dispatch({ type: 'UPDATE_PARTICIPANT', payload: { id: p.id, data } })}
          onRemove={() => dispatch({ type: 'REMOVE_PARTICIPANT', payload: p.id })}
        />
      ))}

      <div className="flex gap-2 my-4">
        <Button onClick={() => dispatch({ type: 'ADD_PARTICIPANT' })}>Add Participant</Button>
        <Button onClick={() => dispatch({ type: 'EVEN_SPLIT' })}>Even Split</Button>
        <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>Reset</Button>
      </div>

      <div className="my-4">
        {isValid ? <span className="text-green-600">✅ Split matches total</span> : <span className="text-red-600">❌ Total does not match</span>}
      </div>

      <Button onClick={handleSubmit} disabled={!isValid}>Submit</Button>

      {result && <p className="mt-4 font-semibold">Result: {result}</p>}
    </main>
  )
}
