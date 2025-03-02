"use client"

import type React from "react"

import { type FormEvent, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/text-area"
import { SendIcon, Sparkles } from "lucide-react"
import type { Message } from "ai"

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export default function ChatArea({ messages, isLoading, input, handleInputChange, handleSubmit }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
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
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    </>
                  ) : (
                    <>
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
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
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AI</AvatarFallback>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
              </Avatar>
              <div className="rounded-lg p-4 bg-muted">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
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

