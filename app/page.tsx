'use client'

/**
 * Main Chat Page Component
 * 
 * This is where users can chat with the AI assistant. The page has two main parts:
 * 1. A sidebar that shows all your past conversations
 * 2. The main chat area where you talk with the AI
 * 
 * Key Features:
 * - Chat with AI using Anthropic's Claude
 * - Save and load past conversations
 * - Works on both mobile and desktop
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
import { toast } from 'sonner'

// Common style for error toasts
const errorToastStyle = {
  backgroundColor: 'rgb(255, 235, 235)',
  border: '1px solid rgb(255, 180, 180)',
  color: 'rgb(180, 0, 0)'
}

/**
 * Shows error messages to the user as a toast notification
 * @param error - The error that occurred
 */
const handleChatError = (error: Error) => {
  if (!error?.message) return

  try {
    // Try to parse the error message as JSON
    const errorData = JSON.parse(error.message)
    
    // Show specific message for missing API key
    if (errorData.code === 'MISSING_API_KEY') {
      toast.error('API Key Missing', {
        description: 'The Anthropic API key is not configured. Please set up your API key to use the chat functionality.',
        duration: 10000,
        style: errorToastStyle
      })
      return
    }
    
    // Show generic error message for other errors
    toast.error('Error', {
      description: errorData.error || 'An error occurred while processing your request.',
      duration: 10000,
      style: errorToastStyle
    })
  } catch {
    // If we can't parse the error as JSON, just show the raw message
    toast.error('Error', {
      description: error.message,
      duration: 10000,
      style: errorToastStyle
    })
  }
}

export default function ChatPage() {
  // --- State Management ---
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false)          // Controls mobile sidebar visibility
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)  // Shows loading spinner while getting conversations
  const [error, setError] = useState<string | null>(null)        // Stores any error messages
  
  // User State
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [user, setUser] = useState<User | null>(null)            // Currently logged in user
  
  // Chat State
  const [conversations, setConversations] = useState<Conversation[]>([])        // List of all past conversations
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)  // The active chat

  // Setup chat functionality using the vercel/ai library
  const { 
    messages,            // List of messages in the current chat
    input,              // Text currently in the input box
    handleInputChange,  // Function to update input as user types
    handleSubmit: handleChatSubmit,  // Function to send message to AI
    setMessages,        // Function to update the message list
    isLoading          // True while AI is generating a response
  } = useChat({
    api: '/api/chat',
    onError: handleChatError,
    onFinish: async (message) => {
      // Save AI responses to the database
      if (currentConversation) {
        await saveMessage(currentConversation.id, message)
      }
    },
  })

  // Setup authentication listener
  // This runs once when the component loads and sets up automatic user session handling
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user)
        fetchConversations()  // Load conversations when user logs in
      } else {
        // Clear all user data when logged out
        setUser(null)
        setConversations([])
        setCurrentConversation(null)
        setError(null)
      }
    })

    // Cleanup subscription when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  // Handle the initial page load state
  // Shows loading indicator until we know if user is logged in or not
  useEffect(() => {
    if (!user) {
      setIsLoadingConversations(false)
    }
  }, [user])

  /**
   * Loads all conversations for the current user from the database
   * 
   * This function:
   * 1. Shows a loading state while fetching
   * 2. Makes an API request to get conversations
   * 3. Updates the conversations list if successful
   * 4. Shows an error message if something goes wrong
   * 5. Hides the loading state when done
   */
  const fetchConversations = async () => {
    try {
      setError(null)  // Clear any previous errors
      setIsLoadingConversations(true)  // Show loading state
      
      // Get conversations from our API
      const response = await fetch('/api/conversations')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }
      
      const data = await response.json()
      setConversations(data)  // Update conversations list with fetched data
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setError('Failed to load conversations. Please try refreshing the page.')
    } finally {
      setIsLoadingConversations(false)  // Hide loading state
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
      // Close sidebar on mobile after selecting a conversation
      setSidebarOpen(false)
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
      console.log('Deleting conversation:', conversation.id)
      
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
    <div className="flex h-[100dvh] bg-background overflow-hidden relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div 
        className={`
          fixed md:relative z-40 
          w-[280px] h-full 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          border-r border-border 
          bg-background
          overflow-y-auto
        `}
      >
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
