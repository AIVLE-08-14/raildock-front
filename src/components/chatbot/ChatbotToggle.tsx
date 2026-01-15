import { Button } from "@/components/ui/button"
import { BotMessageSquare } from "lucide-react"

interface ChatbotToggleProps {
  onClick: () => void
}

export default function ChatbotToggle({ onClick }: ChatbotToggleProps) {
  return (
    <div className="fixed right-4 bottom-6 z-40">
      <Button
        size="icon"
        onClick={onClick}
        className="relative w-16 h-16 rounded-full shadow-lg"
      >
          <BotMessageSquare className="w-full h-full" />
       </Button>
    </div>
  )
}
