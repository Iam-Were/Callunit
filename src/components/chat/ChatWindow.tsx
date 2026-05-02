import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { ChatStep, ChatMessage } from '../../types/index'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'

interface Collected {
  name: string
  phone: string
  email: string
  concern: string
}

const PLACEHOLDERS: Partial<Record<ChatStep, string>> = {
  name: 'Your full name',
  phone: 'Your phone number',
  email: 'Your email address',
  concern: 'Describe your concern',
}

export default function ChatWindow() {
  const [step, setStep] = useState<ChatStep>('name')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: crypto.randomUUID(), from: 'bot', text: "Hi there! What's your name?" },
  ])
  const [collected, setCollected] = useState<Collected>({ name: '', phone: '', email: '', concern: '' })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (from: 'bot' | 'user', text: string) => {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), from, text }])
  }

  const submitTicket = async (data: Collected) => {
    console.error('[DEBUG] submitTicket called with:', JSON.stringify(data))

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({ name: data.name, phone: data.phone, email: data.email }, { onConflict: 'email' })
      .select('id')
      .single()

    if (customerError || !customer) {
      const msg = customerError ? `Error: ${customerError.message} (${customerError.code})` : 'No customer data returned'
      addMessage('bot', `[DEBUG] ${msg}`)
      setStep('concern')
      return
    }

    const customerId = (customer as { id: string }).id

    const { error: ticketError } = await supabase
      .from('tickets')
      .insert({ customer_id: customerId, concern: data.concern, status: 'open' })

    if (ticketError) {
      addMessage('bot', 'Something went wrong. Please describe your concern again.')
      setStep('concern')
      return
    }

    addMessage('bot', 'Your ticket has been submitted. A support agent will reach out to you shortly.')
    setStep('done')
  }

  const handleSend = (value: string) => {
    addMessage('user', value)

    if (step === 'name') {
      const next = { ...collected, name: value }
      setCollected(next)
      setStep('phone')
      setTimeout(() => addMessage('bot', "Thanks! What's your phone number?"), 400)
    } else if (step === 'phone') {
      const next = { ...collected, phone: value }
      setCollected(next)
      setStep('email')
      setTimeout(() => addMessage('bot', "Got it. What's your email address?"), 400)
    } else if (step === 'email') {
      const next = { ...collected, email: value }
      setCollected(next)
      setStep('concern')
      setTimeout(() => addMessage('bot', 'What is your ticket concern?'), 400)
    } else if (step === 'concern') {
      const data: Collected = { ...collected, concern: value }
      setCollected(data)
      setStep('submitting')
      addMessage('bot', 'Submitting your request...')
      void submitTicket(data)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {messages.map(m => (
          <ChatBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput
        onSend={handleSend}
        disabled={step === 'submitting' || step === 'done'}
        placeholder={PLACEHOLDERS[step] ?? ''}
      />
    </div>
  )
}
