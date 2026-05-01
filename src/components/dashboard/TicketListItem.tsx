import type { Ticket } from '../../types/index'
import StatusBadge from './StatusBadge'

interface Props {
  ticket: Ticket
  isSelected: boolean
  onClick: () => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function TicketListItem({ ticket, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
        isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-gray-900 truncate">
          {ticket.customers.name}
        </span>
        <span className="text-xs text-gray-400 shrink-0">{timeAgo(ticket.updated_at)}</span>
      </div>
      <p className="text-xs text-gray-500 truncate mb-2">{ticket.concern}</p>
      <StatusBadge status={ticket.status} />
    </button>
  )
}
