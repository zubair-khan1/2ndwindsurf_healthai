"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, X } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ReportChatbotProps {
  analysis: string
  isOpen: boolean
  onClose: () => void
  position?: "side" | "bottom"
}

export function ReportChatbot({ analysis, isOpen, onClose, position = "bottom" }: ReportChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    "Plan me a diet based on my results",
    "What should I do to improve?",
    "Explain my test results in simple terms",
    "Are there any concerning values?",
    "What foods should I avoid?",
    "Suggest lifestyle changes",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat-with-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          analysis: analysis,
          conversationHistory: messages,
        }),
      })

      const data = await response.json()
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that request.",
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  if (!isOpen) return null

  const containerClass = position === "side"
    ? "fixed right-0 top-0 h-full w-full md:w-[500px] z-50 shadow-2xl"
    : "fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"

  return (
    <div className={containerClass}>
      <div className="bg-white rounded-lg border border-[rgba(55,50,47,0.08)] overflow-hidden shadow-2xl h-full flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-[rgba(55,50,47,0.08)] px-6 py-4 bg-white flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-[#37322F] flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Ask About Your Report
            </h3>
            <p className="text-sm text-[#605A57] mt-1">
              Get personalized insights and recommendations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F7F5F3] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Buttons */}
        {messages.length === 0 && (
          <div className="px-6 py-4 border-b border-[rgba(55,50,47,0.08)] bg-white flex-shrink-0">
            <p className="text-sm text-[#605A57] mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-2 text-sm bg-[#F7F5F3] hover:bg-[#EDE9E6] text-[#37322F] rounded-lg transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Sparkles className="w-12 h-12 text-[#605A57] mx-auto mb-3 opacity-50" />
                <p className="text-[#605A57]">Start a conversation about your report</p>
                <p className="text-sm text-[#605A57] mt-1">Ask questions or use quick actions above</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#37322F] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[#37322F] text-white"
                        : "bg-[#F7F5F3] text-[#37322F]"
                    }`}
                  >
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#605A57] flex items-center justify-center text-white text-sm font-medium">
                      You
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#37322F] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#F7F5F3] rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#605A57] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-[#605A57] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-[#605A57] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[rgba(55,50,47,0.08)] px-6 py-4 bg-white flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputMessage)
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your report..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-[rgba(55,50,47,0.08)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-3 bg-[#37322F] text-white rounded-lg hover:bg-[#37322F]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
