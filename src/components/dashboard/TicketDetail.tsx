import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Ticket, Agent, TicketNote, TicketStatus } from '../../types/index'
import StatusBadge from './StatusBadge'
import NotesList from './NotesList'
import AddNoteForm from './AddNoteForm'

interface Props {
  ticket: Ticket
  agents: Agent[]
  onTicketUpdated: () => void
}

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'erased', label: 'Erased' },
]

export default function TicketDetail({ ticket, agents, onTicketUpdated }: Props) {
  const [notes, setNotes] = useState<TicketNote[]>([])
  const [notesLoading, setNotesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('ticket_notes')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at')
      .then(({ data }) => {
        if (cancelled) return
        if (data) setNotes(data as TicketNote[])
        setNotesLoading(false)
      })
    return () => { cancelled = true }
  }, [ticket.id])

  const refetchNotes = () => {
    supabase
      .from('ticket_notes')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at')
      .then(({ data }) => {
        if (data) setNotes(data as TicketNote[])
      })
  }

  const updateTicket = async (updates: Partial<{ status: TicketStatus; assigned_to: string | null }>) => {
    await supabase.from('tickets').update(updates).eq('id', ticket.id)
    onTicketUpdated()
  }

  const adminAgents = agents.filter(a => a.role === 'admin')

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-5 gap-6">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Customer
        </h2>
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-1">
          <p className="text-sm font-semibold text-gray-900">{ticket.customers.name}</p>
          <p className="text-sm text-gray-500">{ticket.customers.phone}</p>
          <p className="text-sm text-gray-500">{ticket.customers.email}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Concern
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">{ticket.concern}</p>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Status
        </h2>
        <div className="flex items-center gap-3">
          <StatusBadge status={ticket.status} />
          <select
            value={ticket.status}
            onChange={e => { void updateTicket({ status: e.target.value as TicketStatus }) }}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-400"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Assigned To
        </h2>
        <select
          value={ticket.assigned_to ?? ''}
          onChange={e => { void updateTicket({ assigned_to: e.target.value || null }) }}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1 w-full outline-none focus:border-indigo-400"
        >
          <option value="">Unassigned</option>
          {agents.map(a => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.role})
            </option>
          ))}
        </select>
      </section>

      {adminAgents.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Escalate to Admin
          </h2>
          <select
            defaultValue=""
            onChange={e => {
              if (!e.target.value) return
              const adminId = e.target.value
              e.target.value = ''
              void updateTicket({ assigned_to: adminId, status: 'escalated' })
            }}
            className="text-sm border border-orange-200 rounded-lg px-2 py-1 w-full outline-none focus:border-orange-400"
          >
            <option value="">Select an admin...</option>
            {adminAgents.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </section>
      )}

      {ticket.status !== 'erased' && (
        <section>
          <button
            onClick={() => { void updateTicket({ status: 'erased' }) }}
            className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Move to Erased
          </button>
        </section>
      )}

      <section className="flex-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Internal Notes
        </h2>
        {notesLoading ? (
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <NotesList notes={notes} />
        )}
        <AddNoteForm ticketId={ticket.id} onNoteAdded={refetchNotes} />
      </section>
    </div>
  )
}
