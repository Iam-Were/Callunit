import { useState } from 'react'
import type { FilterOption } from '../types/index'
import { useTickets } from '../hooks/useTickets'
import { useAgents } from '../hooks/useAgents'
import Sidebar from '../components/dashboard/Sidebar'
import TicketList from '../components/dashboard/TicketList'
import TicketDetail from '../components/dashboard/TicketDetail'

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterOption>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { tickets, loading } = useTickets(filter)
  const { agents } = useAgents()

  const selectedTicket = tickets.find(t => t.id === selectedId) ?? null

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        current={filter}
        onChange={f => {
          setFilter(f)
          setSelectedId(null)
        }}
      />

      <div className="w-96 shrink-0 border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-100 shrink-0">
          <h1 className="text-base font-semibold text-gray-900">Support Tickets</h1>
        </div>
        <TicketList
          tickets={tickets}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedTicket ? (
          <TicketDetail
            ticket={selectedTicket}
            agents={agents}
            onTicketUpdated={() => {}}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  )
}
