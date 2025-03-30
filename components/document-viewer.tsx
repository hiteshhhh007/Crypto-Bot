"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, FileIcon, X, ExternalLink, Download, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Mock document data
const mockDocuments = [
  {
    id: "1",
    title: "Introduction to Cryptography",
    type: "pdf",
    size: "2.4 MB",
    date: "2025-02-15",
    tags: ["cryptography", "basics"],
  },
  {
    id: "2",
    title: "Network Security Best Practices",
    type: "ppt",
    size: "4.1 MB",
    date: "2025-01-28",
    tags: ["network", "security"],
  },
  {
    id: "3",
    title: "Public Key Infrastructure Overview",
    type: "pdf",
    size: "1.8 MB",
    date: "2025-03-10",
    tags: ["PKI", "certificates"],
  },
  {
    id: "4",
    title: "SSL/TLS Protocol Analysis",
    type: "pdf",
    size: "3.2 MB",
    date: "2025-02-22",
    tags: ["SSL", "TLS", "protocols"],
  },
  {
    id: "5",
    title: "Encryption Algorithms Comparison",
    type: "ppt",
    size: "5.7 MB",
    date: "2025-03-05",
    tags: ["algorithms", "encryption"],
  },
  {
    id: "6",
    title: "Firewall Configuration Guide",
    type: "pdf",
    size: "2.9 MB",
    date: "2025-01-15",
    tags: ["firewall", "configuration"],
  },
  {
    id: "7",
    title: "Threat Intelligence Data",
    type: "json",
    size: "1.2 MB",
    date: "2025-03-20",
    tags: ["threat", "intelligence"],
  },
]

interface DocumentViewerProps {
  onClose: () => void
}

export default function DocumentViewer({ onClose }: DocumentViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<(typeof mockDocuments)[0] | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileIcon className="h-5 w-5 text-red-500" />
      case "ppt":
        return <FileIcon className="h-5 w-5 text-orange-500" />
      case "json":
        return <FileIcon className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredDocuments = mockDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold">Reference Materials</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <div className="px-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="pdf">PDFs</TabsTrigger>
            <TabsTrigger value="ppt">Presentations</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2 p-4">
              {filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No documents found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:bg-accent"
                    onClick={() => {
                      setSelectedDocument(doc)
                      setShowPreview(true)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>{formatDate(doc.date)}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="pdf" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2 p-4">
              {filteredDocuments
                .filter((doc) => doc.type === "pdf")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:bg-accent"
                    onClick={() => {
                      setSelectedDocument(doc)
                      setShowPreview(true)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>{formatDate(doc.date)}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ppt" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2 p-4">
              {filteredDocuments
                .filter((doc) => doc.type === "ppt")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:bg-accent"
                    onClick={() => {
                      setSelectedDocument(doc)
                      setShowPreview(true)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>{formatDate(doc.date)}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="other" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2 p-4">
              {filteredDocuments
                .filter((doc) => doc.type !== "pdf" && doc.type !== "ppt")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:bg-accent"
                    onClick={() => {
                      setSelectedDocument(doc)
                      setShowPreview(true)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>{formatDate(doc.date)}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Document Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex h-[60vh] flex-col items-center justify-center border border-dashed border-border rounded-lg p-8">
            <div className="mb-4">{selectedDocument && getFileIcon(selectedDocument.type)}</div>
            <p className="text-center text-muted-foreground">Document preview would be displayed here.</p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              This is a placeholder for the actual document viewer integration.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Viewer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

