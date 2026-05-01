import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  ticketId: string
  onNoteAdded: () => void
}

export default function AddNoteForm({ ticketId, onNoteAdded }: Props) {
  const [agentName, setAgentName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!agentName.trim() || !content.trim()) return
    setSubmitting(true)
    await supabase.from('ticket_notes').insert({
      ticket_id: ticketId,
      agent_name: agentName.trim(),
      content: content.trim(),
    })
    setContent('')
    setSubmitting(false)
    onNoteAdded()
  }

  return (
    <div className="flex flex-col gap-2 mt-3">
      <input
        type="text"
        value={agentName}
        onChange={e => setAgentName(e.target.value)}
        placeholder="Your name"
        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add an internal note..."
        rows={3}
        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 resize-none"
      />
      <button
        onClick={() => { void handleSubmit() }}
        disabled={submitting || !agentName.trim() || !content.trim()}
        className="self-end px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg disabled:opacity-40 hover:bg-indigo-700 transition-colors"
      >
        Add Note
      </button>
    </div>
  )
}
