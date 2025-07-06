// File: src/pages/index.tsx

import { useReducer, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import ParticipantRow from '@/components/ParticipantRow'
import { validateSplitTotal } from '@/utils/validateSplit'
import { Button } from '@/components/ui/button'
import { Participant, State } from '@/types'
import { Loader2 } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!isValid) return
    
    setIsLoading(true)
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
      if (data.valid) {
        toast.success('Split validated successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = validateSplitTotal(state.total, state.participants) && 
                 state.participants.every(p => p.name.trim() !== '')

  const isSubmitDisabled = !isValid || isLoading

  return (
    <main className="max-w-xl mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Manual Bill Splitter</h1>

      <input
        type="number"
        placeholder="Enter total amount"
        value={state.total}
        onChange={(e) => dispatch({ type: 'SET_TOTAL', payload: Number(e.target.value) })}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mb-4"
      />

      <AnimatePresence mode="popLayout">
        {state.participants.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ParticipantRow
              id={p.id}
              name={p.name}
              amount={p.amount}
              onChange={(data) => dispatch({ type: 'UPDATE_PARTICIPANT', payload: { id: p.id, data } })}
              onRemove={() => dispatch({ type: 'REMOVE_PARTICIPANT', payload: p.id })}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex gap-2 my-4">
        <Button onClick={() => dispatch({ type: 'ADD_PARTICIPANT' })}>Add Participant</Button>
        <Button onClick={() => dispatch({ type: 'EVEN_SPLIT' })}>Even Split</Button>
        <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>Reset</Button>
      </div>

      <div className="my-4">
        {isValid ? 
          <span className="text-green-600">✅ Split matches total</span> : 
          <span className="text-red-600">❌ {state.total ? 'Total does not match' : 'Please enter a total amount'}</span>
        }
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitDisabled}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </main>
  )
}
