// src/components/chatbot/ChatbotPanel.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAskChatbot } from '@/api/queries/chatbotQueries'

interface ChatMessage {
  role: 'user' | 'bot'
  content: string
}

interface ChatbotPanelProps {
  open: boolean
  onClose: () => void
}

export default function ChatbotPanel({ open, onClose }: ChatbotPanelProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const { mutateAsync, isPending } = useAskChatbot()

  const handleSend = async () => {
    if (!input.trim()) return

    const question = input
    setInput('')

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: question }])

    try {
      const res = await mutateAsync({
        question,
        folderFilter: '',
      })

      setMessages(prev => [
        ...prev,
        { role: 'bot', content: res.data.answer },
      ])
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          content: '⚠️ 답변을 가져오는 중 오류가 발생했습니다.',
        },
      ])
    }
  }

  return (
    <aside
      className={`
        fixed top-0 right-0 z-50 h-full w-96 bg-white border-l shadow-lg
        transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Raildock AI 챗봇</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
          {messages.length === 0 && (
            <p className="text-gray-400">
              철도 시설물 점검 관련 질문을 입력하세요.
            </p>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded px-3 py-2 whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isPending && (
            <p className="text-xs text-gray-400">RAILDOCK 응답 중...</p>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="질문을 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button className="h-full" size="sm" onClick={handleSend} disabled={isPending}>
            전송
          </Button>
        </div>
      </div>
    </aside>
  )
}
