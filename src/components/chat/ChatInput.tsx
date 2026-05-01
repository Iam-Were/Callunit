import { useState } from 'react'

interface Props {
  onSend: (value: string) => void
  disabled: boolean
  placeholder: string
}

export default function ChatInput({ onSend, disabled, placeholder }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div className="flex gap-2 p-4 border-t border-gray-100">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm outline-none focus:border-indigo-400 disabled:bg-gray-50 disabled:text-gray-400"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-full disabled:opacity-40 hover:bg-indigo-700 transition-colors"
      >
        Send
      </button>
    </div>
  )
}
