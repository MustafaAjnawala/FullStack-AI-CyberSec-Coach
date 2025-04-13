"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, X } from "lucide-react"

export function AIChatbot() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, message])
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0">
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 shadow-lg">
      <CardHeader className="p-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 h-64 overflow-y-auto border-t">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">Ask me anything about cybersecurity!</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-2 p-2 bg-muted rounded-md text-sm">
              {msg}
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="p-3 border-t flex items-center gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm"
        />
        <Button size="icon" onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

