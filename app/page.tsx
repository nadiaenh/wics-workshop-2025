'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import ChatSidebar from '../components/chat-sidebar'
import ChatArea from '../components/chat-area'
import { Button } from '../components/ui/button'
import { Menu } from 'lucide-react'
import { type Message } from 'ai'
import { type Conversation } from '../lib/supabase'

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)

  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, setMessages, isLoading } = useChat({
    onFinish: async (message) => {
      if (currentConversation) {
        // Save the assistant's message to the database
        await saveMessage(currentConversation.id, message)
      }
    },
  })

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data)
      setIsLoadingConversations(false)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setIsLoadingConversations(false)
    }
  }

  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const newConversation = await response.json()
      setConversations([newConversation, ...conversations])
      setCurrentConversation(newConversation)
      setMessages([]) // Clear messages when creating new chat
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const loadConversation = async (conversation: Conversation) => {
    try {
      setCurrentConversation(conversation) // Set current conversation first
      const response = await fetch(`/api/conversations/${conversation.id}/messages`)
      const messages = await response.json()
      setMessages(messages)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const saveMessage = async (conversationId: string, message: Message) => {
    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          role: message.role,
          content: message.content,
        }),
      })
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const deleteConversation = async (conversation: Conversation) => {
    try {
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete conversation')
      
      // Remove conversation from state
      setConversations(conversations.filter(c => c.id !== conversation.id))
      
      // If the deleted conversation was the current one, clear messages and current conversation
      if (currentConversation?.id === conversation.id) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) return

    // If no conversation exists, create one
    if (!currentConversation) {
      await createNewConversation()
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
    }

    // Save the user's message to the database first
    if (currentConversation) {
      await saveMessage(currentConversation.id, userMessage)
    }

    // Use the chat's built-in submission
    handleChatSubmit(e)
  }

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
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      md:translate-x-0 transition-transform duration-300 ease-in-out
                      fixed md:relative z-40 w-64 h-full border-r border-border bg-background`}>
        <ChatSidebar 
          conversations={conversations}
          currentConversation={currentConversation}
          onNewChat={createNewConversation}
          onSelectConversation={loadConversation}
          onDeleteConversation={deleteConversation}
          isLoading={isLoadingConversations}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatArea 
          messages={messages} 
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
