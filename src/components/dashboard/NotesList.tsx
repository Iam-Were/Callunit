import type { TicketNote } from '../../types/index'

interface Props {
  notes: TicketNote[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NotesList({ notes }: Props) {
  if (notes.length === 0) {
    return <p className="text-xs text-gray-400 italic">No notes yet.</p>
  }
  return (
    <ul className="flex flex-col gap-3">
      {notes.map(n => (
        <li key={n.id} className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-amber-800">{n.agent_name}</span>
            <span className="text-xs text-gray-400">{formatDate(n.created_at)}</span>
          </div>
          <p className="text-sm text-gray-700">{n.content}</p>
        </li>
      ))}
    </ul>
  )
}
