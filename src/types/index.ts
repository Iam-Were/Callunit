export type TicketStatus = 'open' | 'in_progress' | 'escalated' | 'resolved' | 'erased'
export type AgentRole = 'user' | 'admin'
export type FilterOption = TicketStatus | 'all'
export type ChatStep = 'name' | 'phone' | 'email' | 'concern' | 'submitting' | 'done'

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  created_at: string
}

export interface Agent {
  id: string
  name: string
  email: string
  role: AgentRole
  created_at: string
}

export interface Ticket {
  id: string
  customer_id: string
  concern: string
  status: TicketStatus
  assigned_to: string | null
  created_at: string
  updated_at: string
  customers: Customer
  agents: Agent | null
}

export interface TicketNote {
  id: string
  ticket_id: string
  agent_name: string
  content: string
  created_at: string
}

export interface ChatMessage {
  id: string
  from: 'bot' | 'user'
  text: string
}
