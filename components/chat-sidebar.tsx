/**
 * Chat Sidebar Component
 * 
 * This component renders the sidebar containing:
 * - New chat button
 * - List of conversations grouped by date
 * - Settings button
 * - Loading and empty states
 */

import { Button } from "./ui/button"
import { PlusIcon, MessageSquare, Settings, Loader2, Trash2 } from "lucide-react"
import type { Conversation } from "../lib/supabase"
import { ScrollArea } from "./ui/scroll-area"
import { useRouter } from "next/navigation"

/**
 * Props for the ChatSidebar component
 * @property {Conversation[]} conversations - Array of all conversations
 * @property {Conversation | null} currentConversation - Currently selected conversation
 * @property {function} onNewChat - Handler for creating a new chat
 * @property {function} onSelectConversation - Handler for selecting a conversation
 * @property {function} onDeleteConversation - Handler for deleting a conversation
 * @property {boolean} isLoading - Whether conversations are being loaded
 */
interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversation: Conversation | null
  onNewChat: () => void
  onSelectConversation: (conversation: Conversation) => void
  onDeleteConversation: (conversation: Conversation) => void
  isLoading: boolean
}

/**
 * ChatSidebar component that displays conversation history
 * Groups conversations by date and provides actions for managing them
 */
export default function ChatSidebar({
  conversations,
  currentConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isLoading,
}: ChatSidebarProps) {
  const router = useRouter()

  /**
   * Groups conversations by their creation date
   * Uses locale-specific date formatting
   */
  const groupedConversations = conversations.reduce((groups: Record<string, Conversation[]>, conversation) => {
    const date = new Date(conversation.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    if (!groups[date]) {
      groups[date] = []
    }

    groups[date].push(conversation)
    return groups
  }, {})

  return (
    <div className="flex flex-col h-[100dvh] md:h-full">
      {/* New chat button at the top */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2" onClick={onNewChat} disabled={isLoading}>
          <PlusIcon size={16} />
          New chat
        </Button>
      </div>

      {/* Scrollable conversation list */}
      <ScrollArea className="flex-1 px-3 py-2">
        {isLoading ? (
          // Loading spinner
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          // Empty state
          <div className="text-center py-8 text-muted-foreground">No conversations yet</div>
        ) : (
          // Grouped conversations by date
          Object.entries(groupedConversations).map(([date, convos]) => (
            <div key={date}>
              <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-2">{date}</h2>
              <div className="space-y-1">
                {convos.map((conversation) => (
                  <div key={conversation.id} className="flex items-center gap-2 px-2">
                    {/* Conversation button */}
                    <Button
                      variant={currentConversation?.id === conversation.id ? "secondary" : "ghost"}
                      className="flex-1 justify-start text-left font-normal truncate h-auto py-2"
                      onClick={() => onSelectConversation(conversation)}
                    >
                      <MessageSquare size={16} className="mr-2 shrink-0" />
                      <span className="truncate">Chat {new Date(conversation.created_at).toLocaleTimeString()}</span>
                    </Button>
                    {/* Delete button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation);
                      }}
                      className="shrink-0 p-0 w-8 h-8"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </ScrollArea>

      {/* Settings button at the bottom */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2"
          onClick={() => router.push('/settings')}
        >
          <Settings size={16} />
          Settings
        </Button>
      </div>
    </div>
  )
}

