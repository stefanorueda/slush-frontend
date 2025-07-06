// File: src/components/ParticipantRow.tsx

import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { X } from 'lucide-react'

interface Props {
    id: number
    name: string
    amount: number | ''
    onChange: (data: { name?: string; amount?: number | '' }) => void
    onRemove: () => void
  }
  
  export default function ParticipantRow({ id, name, amount, onChange, onRemove }: Props) {
    return (
      <div className="flex gap-2 mb-2 items-center group">
        <motion.input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => onChange({ amount: Number(e.target.value) })}
          className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }
  