"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Save, Trash2, MoreVertical, Download, Calendar, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Mock session data
const mockSessions = [
  {
    id: "1",
    title: "AES Encryption Discussion",
    date: "2025-03-30T14:30:00",
    messageCount: 12,
  },
  {
    id: "2",
    title: "SSL Certificate Issues",
    date: "2025-03-29T10:15:00",
    messageCount: 8,
  },
  {
    id: "3",
    title: "Public Key Infrastructure",
    date: "2025-03-28T16:45:00",
    messageCount: 15,
  },
  {
    id: "4",
    title: "Network Firewall Configuration",
    date: "2025-03-27T09:20:00",
    messageCount: 6,
  },
]

export default function SessionManager() {
  const [sessions, setSessions] = useState(mockSessions)
  const [activeSessionId, setActiveSessionId] = useState("1")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [newSessionName, setNewSessionName] = useState("")
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  }

  const createNewSession = () => {
    if (!newSessionName.trim()) return

    const newSession = {
      id: Date.now().toString(),
      title: newSessionName,
      date: new Date().toISOString(),
      messageCount: 0,
    }

    setSessions([newSession, ...sessions])
    setActiveSessionId(newSession.id)
    setNewSessionName("")
    setShowNewSessionDialog(false)
  }

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessions(sessions.filter((session) => session.id !== id))
    if (activeSessionId === id) {
      setActiveSessionId(sessions[0]?.id || "")
    }
  }

  return (
    <div
      className={cn(
        "border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-0 overflow-hidden" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-sm font-semibold">Chat Sessions</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-6 w-6">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <div className="p-2">
          <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
                <DialogDescription>Give your new chat session a name to help you find it later.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="session-name">Session Name</Label>
                <Input
                  id="session-name"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g., RSA Encryption Discussion"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewSessionDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewSession}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm",
                  activeSessionId === session.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                )}
                onClick={() => setActiveSessionId(session.id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{session.title}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(session.date)}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      {session.messageCount}
                    </span>
                  </div>
                </div>

                <div className="flex opacity-0 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Save</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => deleteSession(session.id, e)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4">
          <Button variant="outline" size="sm" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Current Session
          </Button>
        </div>
      </div>
    </div>
  )
}

