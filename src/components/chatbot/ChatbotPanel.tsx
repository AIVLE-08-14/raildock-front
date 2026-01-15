import { Button } from "@/components/ui/button"

interface ChatbotPanelProps {
  open: boolean
  onClose: () => void
}

export default function ChatbotPanel({ open, onClose }: ChatbotPanelProps) {
  return (
    <aside
      className={`
        fixed top-0 right-0 z-50 h-full w-96 bg-white border-l shadow-lg
        transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
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

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto text-sm text-gray-600">
          <p>여기에 챗봇 UI 들어간다.</p>
          <p className="mt-2">- 결함 설명</p>
          <p>- 리포트 요약</p>
          <p>- 조치 가이드</p>
        </div>

        {/* Input (placeholder) */}
        <div className="p-3 border-t">
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="질문을 입력하세요..."
          />
        </div>
      </div>
    </aside>
  )
}
