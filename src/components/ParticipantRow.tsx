// File: src/components/ParticipantRow.tsx

interface Props {
    id: number
    name: string
    amount: number | ''
    onChange: (data: { name?: string; amount?: number | '' }) => void
    onRemove: () => void
  }
  
  export default function ParticipantRow({ id, name, amount, onChange, onRemove }: Props) {
    return (
      <div className="flex gap-2 mb-2 items-center">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => onChange({ amount: Number(e.target.value) })}
          className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button 
          onClick={onRemove} 
          className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
        >
          Remove
        </button>
      </div>
    )
  }
  