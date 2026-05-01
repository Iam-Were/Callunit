import type { ChatMessage } from '../../types/index'

interface Props {
  message: ChatMessage
}

export default function ChatBubble({ message }: Props) {
  const isBot = message.from === 'bot'
  return (
    <div className={`flex mb-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
            : 'bg-indigo-600 text-white rounded-br-sm'
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}
