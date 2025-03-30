"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatInterface from "@/components/chat-interface"
import DocumentViewer from "@/components/document-viewer"
import SessionManager from "@/components/session-manager"
import { Shield, Brain, Search, FileText } from "lucide-react"

export default function Home() {
  const [activeMode, setActiveMode] = useState<"normal" | "reasoning" | "search">("normal")
  const [showDocuments, setShowDocuments] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${activeMode}`,
  })

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">CryptoSec RAG Chatbot</h1>
              <p className="text-xs text-muted-foreground">Advanced cryptography and network security assistant</p>
            </div>
          </div>

          <Tabs defaultValue="normal" className="w-auto" onValueChange={(value) => setActiveMode(value as any)}>
            <TabsList>
              <TabsTrigger value="normal" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Normal Chat</span>
              </TabsTrigger>
              <TabsTrigger value="reasoning" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Reasoning</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                onClick={() => setShowDocuments(!showDocuments)}
                className="flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto flex flex-1 overflow-hidden p-0 md:p-4">
        <div className="flex flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {/* Session Sidebar */}
          <SessionManager />

          {/* Main Chat Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {showDocuments ? (
              <DocumentViewer onClose={() => setShowDocuments(false)} />
            ) : (
              <ChatInterface
                messages={messages}
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                activeMode={activeMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

