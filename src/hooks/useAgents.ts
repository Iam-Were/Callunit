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
      .then(({ data }) => {
        if (data) setAgents(data as Agent[])
        setLoading(false)
      })
  }, [])

  return { agents, loading }
}
