"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import ChatSidebar from "@/components/chat-sidebar"
import ChatArea from "@/components/chat-area"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </Button>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                      md:translate-x-0 transition-transform duration-300 ease-in-out
                      fixed md:relative z-40 w-64 h-full border-r border-border bg-background`}
      >
        <ChatSidebar />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

