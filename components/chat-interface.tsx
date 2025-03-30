"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Message } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Brain, Search, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  activeMode: "normal" | "reasoning" | "search"
}

export default function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  activeMode,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchPanel, setShowSearchPanel] = useState(false)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "normal":
        return <Shield className="h-4 w-4" />
      case "reasoning":
        return <Brain className="h-4 w-4" />
      case "search":
        return <Search className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getMessageStyles = (message: Message) => {
    if (message.role === "user") {
      return "bg-primary text-primary-foreground"
    }

    // Different styles based on mode
    switch (activeMode) {
      case "normal":
        return "bg-card border border-border"
      case "reasoning":
        return "bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800"
      case "search":
        return "bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800"
      default:
        return "bg-card border border-border"
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Search Panel */}
      {activeMode === "search" && showSearchPanel && (
        <div className="border-b border-border bg-muted/50 p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for cryptography or security topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setShowSearchPanel(false)} variant="outline">
              Close
            </Button>
            <Button>Search</Button>
          </div>

          {searchQuery && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium">Search Results</h3>
              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {["AES Encryption", "Public Key Infrastructure", "SSL/TLS Protocols"].map((result, i) => (
                    <Card key={i} className="p-3 hover:bg-accent cursor-pointer">
                      <h4 className="font-medium">{result}</h4>
                      <p className="text-xs text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                      </p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="rounded-full bg-primary/10 p-3 mb-4">{getModeIcon(activeMode)}</div>
              <h3 className="text-xl font-semibold mb-2">Welcome to CryptoSec RAG Chatbot</h3>
              <p className="text-muted-foreground max-w-md">
                Ask questions about cryptography and network security. Switch modes for different types of assistance.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex w-full gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role !== "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">CS</AvatarFallback>
                  </Avatar>
                )}

                <div className={cn("max-w-[80%] md:max-w-[70%]", message.role === "user" ? "order-1" : "order-2")}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{message.role === "user" ? "You" : "CryptoSec Bot"}</span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(Date.now())}</span>
                    {message.role !== "user" && (
                      <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                        <span className="flex items-center gap-1">
                          {getModeIcon(activeMode)}
                          <span className="capitalize">{activeMode}</span>
                        </span>
                      </Badge>
                    )}
                  </div>

                  <div className={cn("rounded-lg p-3 text-sm", getMessageStyles(message))}>{message.content}</div>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 order-2">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Mode-specific action buttons */}
      <div className="border-t border-border bg-card p-2">
        <div className="flex justify-center gap-2 mb-2">
          <TooltipProvider>
            {activeMode === "search" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowSearchPanel(!showSearchPanel)}>
                    <Search className="h-4 w-4 mr-1" />
                    Search
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search online for information</TooltipContent>
              </Tooltip>
            )}

            {activeMode === "reasoning" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Brain className="h-4 w-4 mr-1" />
                    Reason
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Get detailed reasoning</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 p-2">
          <Textarea
            placeholder={`Ask about cryptography or security in ${activeMode} mode...`}
            value={input}
            onChange={handleInputChange}
            className="min-h-12 max-h-36 flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) {
                  handleSubmit(e as any)
                }
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

