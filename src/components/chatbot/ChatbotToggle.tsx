import { Button } from "@/components/ui/button"

interface ChatbotToggleProps {
  onClick: () => void
}

export default function ChatbotToggle({ onClick }: ChatbotToggleProps) {
  return (
    <div className="fixed right-4 bottom-6 z-40">
      <Button
        size="lg"
        className="rounded-full shadow-lg"
        onClick={onClick}
      >
        @@test@@
      </Button>
    </div>
  )
}
