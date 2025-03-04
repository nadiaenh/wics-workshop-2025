import type React from "react"
import type { FormEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Textarea } from "./ui/text-area"
import { SendIcon, Sparkles } from "lucide-react"
import type { Message } from "ai"
import { ScrollArea } from "./ui/scroll-area"

interface ChatAreaProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function ChatArea({ messages, input, handleInputChange, handleSubmit, isLoading }: ChatAreaProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-border p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <span className="font-medium">AI Assistant</span>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex h-[60vh] items-center justify-center text-center">
              <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-bold">How can I help you today?</h2>
                <p className="text-muted-foreground">
                  Ask me anything! I can help with coding, explanations, creative writing, and more.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    {message.role === "user" ? (
                      <>
                        <AvatarFallback>U</AvatarFallback>
                        <AvatarImage src="/placeholder.jpeg?height=32&width=32" />
                      </>
                    ) : (
                      <>
                        <AvatarFallback>AI</AvatarFallback>
                        <AvatarImage src="/placeholder.jpeg?height=32&width=32" />
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Loading indicator - only show if the last message was from the user */}
          {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage src="/placeholder.jpeg?height=32&width=32" />
                </Avatar>
                <div className="rounded-lg p-4 bg-muted flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            name="prompt"
            value={input}
            onChange={handleInputChange}
            placeholder="Message AI Assistant..."
            className="min-h-[60px] w-full resize-none pr-12 py-3 rounded-lg"
            rows={1}
          />
          <Button type="submit" size="icon" className="absolute right-2 bottom-2" disabled={isLoading || !input.trim()}>
            <SendIcon size={18} />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2">
          AI Assistant may produce inaccurate information. Verify important information.
        </p>
      </div>
    </div>
  )
}

