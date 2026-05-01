import type { TicketStatus } from '../../types/index'

interface Props {
  status: TicketStatus
}

const BADGE_CLASSES: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  escalated: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  erased: 'bg-gray-100 text-gray-500',
}

const BADGE_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  escalated: 'Escalated',
  resolved: 'Resolved',
  erased: 'Erased',
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_CLASSES[status]}`}>
      {BADGE_LABELS[status]}
    </span>
  )
}
