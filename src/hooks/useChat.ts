import { useState, useCallback, useRef } from 'react'
import { streamChat, type ChatApiMessage, type StreamEvent, type VisualizationData } from '../lib/agent-api'

export interface ToolActivity {
  tool: string
  status: 'running' | 'done' | 'error'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming: boolean
  toolActivity: ToolActivity[]
  visualizations: VisualizationData[]
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    setError(null)

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      isStreaming: false,
      toolActivity: [],
      visualizations: [],
    }

    const assistantId = `assistant-${Date.now()}`
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      toolActivity: [],
      visualizations: [],
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsLoading(true)

    // Build API messages (only role + content)
    const apiMessages: ChatApiMessage[] = [
      ...messages.filter(m => m.content.length > 0).map(m => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user' as const, content: content.trim() },
    ]

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const handleEvent = (event: StreamEvent) => {
      switch (event.type) {
        case 'text_delta':
          if (event.data.text) {
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + event.data.text }
                  : m
              )
            )
          }
          break

        case 'tool_start':
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    toolActivity: [
                      ...m.toolActivity,
                      { tool: event.data.tool!, status: 'running' as const },
                    ],
                  }
                : m
            )
          )
          break

        case 'tool_end':
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    toolActivity: m.toolActivity.map(t =>
                      t.tool === event.data.tool && t.status === 'running'
                        ? { ...t, status: event.data.success ? 'done' as const : 'error' as const }
                        : t
                    ),
                  }
                : m
            )
          )
          break

        case 'visualization':
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? {
                    ...m,
                    visualizations: [
                      ...m.visualizations,
                      {
                        chart_type: event.data.chart_type,
                        title: event.data.title,
                        data: event.data.data,
                        x_key: event.data.x_key,
                        y_key: event.data.y_key,
                        x_label: event.data.x_label,
                        y_label: event.data.y_label,
                        insight: event.data.insight,
                      } as VisualizationData,
                    ],
                  }
                : m
            )
          )
          break

        case 'done':
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          )
          setIsLoading(false)
          break

        case 'error':
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          )
          setError(event.data.message || 'Something went wrong')
          setIsLoading(false)
          break
      }
    }

    try {
      await streamChat(apiMessages, handleEvent, abortController.signal)
    } catch {
      // Abort errors are expected when user stops streaming
    } finally {
      // Ensure streaming state is cleaned up
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId && m.isStreaming ? { ...m, isStreaming: false } : m
        )
      )
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [messages, isLoading])

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsLoading(false)
  }, [])

  const clearMessages = useCallback(() => {
    stopStreaming()
    setMessages([])
    setError(null)
  }, [stopStreaming])

  return { messages, isLoading, error, sendMessage, stopStreaming, clearMessages }
}
