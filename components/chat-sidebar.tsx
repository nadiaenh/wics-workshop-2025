import { Button } from "./ui/button"
import { PlusIcon, MessageSquare, Settings, Loader2, Trash2 } from "lucide-react"
import type { Conversation } from "../lib/supabase"
import { ScrollArea } from "./ui/scroll-area"

interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversation: Conversation | null
  onNewChat: () => void
  onSelectConversation: (conversation: Conversation) => void
  onDeleteConversation: (conversation: Conversation) => void
  isLoading: boolean
}

export default function ChatSidebar({
  conversations,
  currentConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isLoading,
}: ChatSidebarProps) {
  // Group conversations by date
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
    <div className="flex flex-col h-full">
      {/* New chat button */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2" onClick={onNewChat} disabled={isLoading}>
          <PlusIcon size={16} />
          New chat
        </Button>
      </div>

      {/* Chat history */}
      <ScrollArea className="flex-1 px-3 py-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No conversations yet</div>
        ) : (
          Object.entries(groupedConversations).map(([date, convos]) => (
            <div key={date}>
              <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-2">{date}</h2>
              <div className="space-y-1">
                {convos.map((conversation) => (
                  <div key={conversation.id} className="flex items-center gap-2 px-2">
                    <Button
                      variant={currentConversation?.id === conversation.id ? "secondary" : "ghost"}
                      className="flex-1 justify-start text-left font-normal truncate h-auto py-2"
                      onClick={() => onSelectConversation(conversation)}
                    >
                      <MessageSquare size={16} className="mr-2 shrink-0" />
                      <span className="truncate">Chat {new Date(conversation.created_at).toLocaleTimeString()}</span>
                    </Button>
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

      {/* User section */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings size={16} />
          Settings
        </Button>
      </div>
    </div>
  )
}

