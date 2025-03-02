import { Button } from "@/components/ui/button"
import { PlusIcon, MessageSquare, Settings } from "lucide-react"

export default function ChatSidebar() {
  return (
    <div className="flex flex-col h-full">
      {/* New chat button */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2" variant="outline">
          <PlusIcon size={16} />
          New chat
        </Button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-auto px-3 py-2">
        <h2 className="text-xs font-semibold text-muted-foreground mb-2 px-2">Today</h2>
        <div className="space-y-1">
          {["How to learn React", "Explain quantum computing", "Write a poem about coding"].map((title, i) => (
            <Button key={i} variant="ghost" className="w-full justify-start text-left font-normal truncate h-auto py-2">
              <MessageSquare size={16} className="mr-2 shrink-0" />
              <span className="truncate">{title}</span>
            </Button>
          ))}
        </div>

        <h2 className="text-xs font-semibold text-muted-foreground mt-4 mb-2 px-2">Yesterday</h2>
        <div className="space-y-1">
          {["JavaScript best practices", "CSS Grid tutorial", "How to deploy on Vercel"].map((title, i) => (
            <Button key={i} variant="ghost" className="w-full justify-start text-left font-normal truncate h-auto py-2">
              <MessageSquare size={16} className="mr-2 shrink-0" />
              <span className="truncate">{title}</span>
            </Button>
          ))}
        </div>
      </div>

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

