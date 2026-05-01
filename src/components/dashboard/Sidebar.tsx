import type { FilterOption } from '../../types/index'

interface Props {
  current: FilterOption
  onChange: (f: FilterOption) => void
}

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: 'All Tickets', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Escalated', value: 'escalated' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Erased', value: 'erased' },
]

export default function Sidebar({ current, onChange }: Props) {
  return (
    <aside className="w-52 shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-3 gap-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-2">
        Tickets
      </p>
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            current === f.value
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {f.label}
        </button>
      ))}
    </aside>
  )
}
