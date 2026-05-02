import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Agent } from '../types/index'

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('agents')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error) console.error('Failed to fetch agents:', error)
        if (data) setAgents(data as Agent[])
        setLoading(false)
      })
  }, [])

  return { agents, loading }
}
