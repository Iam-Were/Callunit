import ChatWindow from '../components/chat/ChatWindow'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
        <div className="px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-900">Support</h1>
          <p className="text-xs text-gray-400">We're here to help</p>
        </div>
        <ChatWindow />
      </div>
    </div>
  )
}
