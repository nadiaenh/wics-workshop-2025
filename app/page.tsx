'use client'

/**
 * Main Chat Page Component
 * 
 * This is the primary page component that handles the chat interface and conversation management.
 * It integrates with the AI chat functionality and manages conversation state and persistence.
 * 
 * Features:
 * - Real-time chat with AI using Anthropic's Claude
 * - Conversation management (create, load, delete)
 * - Message persistence in Supabase
 * - Responsive sidebar for conversation history
 */

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import ChatSidebar from '../components/chat-sidebar'
import ChatArea from '../components/chat-area'
import { Button } from '../components/ui/button'
import { Menu } from 'lucide-react'
import { type Message } from 'ai'
import { type Conversation } from '../lib/supabase'
import { createBrowserClient } from '@supabase/ssr'
import { type AuthError, type User, type AuthChangeEvent, type Session } from '@supabase/supabase-js'

export default function ChatPage() {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth State
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [user, setUser] = useState<User | null>(null)

  // Data State
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)

  // AI Chat Hook
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit: handleChatSubmit, 
    setMessages, 
    isLoading 
  } = useChat({
    onFinish: async (message) => {
      if (currentConversation) {
        await saveMessage(currentConversation.id, message)
      }
    },
  })

  // Load user data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      setUser(currentUser)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Load conversations when component mounts or auth state changes
  useEffect(() => {
    if (user) {
      fetchConversations()
    } else {
      // Clear conversations when logged out
      setConversations([])
      setCurrentConversation(null)
      setError(null)
      setIsLoadingConversations(false)
    }
  }, [user])

  /**
   * Fetches all conversations from the database
   * Updates the conversations state and loading state
   */
  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations for user:', user?.email)
      setError(null)
      setIsLoadingConversations(true)
      const response = await fetch('/api/conversations')
      console.log('Response:', response)
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }
      
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setError('Failed to load conversations. Please try refreshing the page.')
    } finally {
      setIsLoadingConversations(false)
    }
  }

  /**
   * Creates a new conversation in the database
   * Sets it as the current conversation and clears the message history
   */
  const createNewConversation = async () => {
    try {
      console.log('Creating new conversation for user:', user?.email)
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

  /**
   * Loads a specific conversation and its messages
   * @param conversation - The conversation to load
   */
  const loadConversation = async (conversation: Conversation) => {
    try {
      setCurrentConversation(conversation)
      const response = await fetch(`/api/conversations/${conversation.id}/messages`)
      const messages = await response.json()
      setMessages(messages)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  /**
   * Saves a message to the database for a specific conversation
   * @param conversationId - ID of the conversation
   * @param message - The message to save
   */
  const saveMessage = async (conversationId: string, message: Message) => {
    try {
      console.log('Saving message for user:', user?.email)
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

  /**
   * Deletes a conversation and its messages from the database
   * Updates the UI state accordingly
   * @param conversation - The conversation to delete
   */
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

  /**
   * Handles form submission for new messages
   * Creates a new conversation if none exists
   * Saves the message and triggers the AI response
   */
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
