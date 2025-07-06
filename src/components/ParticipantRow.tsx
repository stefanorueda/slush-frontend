
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
          className="flex-1 border p-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => onChange({ amount: Number(e.target.value) })}
          className="w-32 border p-2"
        />
        <button onClick={onRemove} className="text-red-500 hover:underline text-sm">
          Remove
        </button>
      </div>
    )
  }
  