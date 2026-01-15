import { useState } from "react"
import Header from "./Header"
import ChatbotPanel from "@/components/chatbot/ChatbotPanel"
import ChatbotToggle from "@/components/chatbot/ChatbotToggle"
import { Outlet } from 'react-router-dom'

export default function Layout() {
  const [chatbotOpen, setChatbotOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full px-4">
         <Outlet />
      </main>

      {/* <Footer /> */}

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
