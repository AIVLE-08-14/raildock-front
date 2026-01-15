import { useState } from "react"
import type { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"
import ChatbotPanel from "@/components/chatbot/ChatbotPanel"
import ChatbotToggle from "@/components/chatbot/ChatbotToggle"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [chatbotOpen, setChatbotOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4 py-6">
        {children}
      </main>

      <Footer />

      {/* 챗봇 */}
      <ChatbotPanel
        open={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
      />

      <ChatbotToggle
        onClick={() => setChatbotOpen(true)}
      />
    </div>
  )
}
