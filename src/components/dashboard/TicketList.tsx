import type { Ticket } from '../../types/index'
import TicketListItem from './TicketListItem'

interface Props {
  tickets: Ticket[]
  selectedId: string | null
  onSelect: (id: string) => void
  loading: boolean
}

export default function TicketList({ tickets, selectedId, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        No tickets found
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full">
      {tickets.map(t => (
        <TicketListItem
          key={t.id}
          ticket={t}
          isSelected={selectedId === t.id}
          onClick={() => onSelect(t.id)}
        />
      ))}
    </div>
  )
}
