import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Ticket, FilterOption } from '../types/index'

export function useTickets(filter: FilterOption) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const query = filter === 'all'
      ? supabase.from('tickets').select('*, customers(*), agents(*)')
      : supabase.from('tickets').select('*, customers(*), agents(*)').eq('status', filter)

    query.order('updated_at', { ascending: false }).then(({ data }) => {
      if (cancelled) return
      if (data) setTickets(data as Ticket[])
      setLoading(false)
    })

    const channel = supabase
      .channel(`tickets-${filter}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        async (payload) => {
          if (cancelled) return

          if (payload.eventType === 'DELETE') {
            const id = payload.old['id'] as string
            setTickets(prev => prev.filter(t => t.id !== id))
            return
          }

          const id = payload.new['id'] as string
          const { data } = await supabase
            .from('tickets')
            .select('*, customers(*), agents(*)')
            .eq('id', id)
            .single()

          if (cancelled || !data) return

          const ticket = data as Ticket

          if (filter !== 'all' && ticket.status !== filter) {
            setTickets(prev => prev.filter(t => t.id !== ticket.id))
            return
          }

          setTickets(prev => {
            const exists = prev.some(t => t.id === ticket.id)
            if (exists) return prev.map(t => t.id === ticket.id ? ticket : t)
            return [ticket, ...prev]
          })
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [filter])

  return { tickets, loading }
}
