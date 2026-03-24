export type StreamEventType = 'text_delta' | 'tool_start' | 'tool_end' | 'visualization' | 'done' | 'error'

export interface VisualizationData {
  chart_type: 'bar' | 'horizontal_bar' | 'pie' | 'donut' | 'line'
  title: string
  data: Record<string, unknown>[]
  x_key: string
  y_key: string
  x_label?: string
  y_label?: string
  insight?: string
}

export interface StreamEvent {
  type: StreamEventType
  data: {
    text?: string
    tool?: string
    args?: Record<string, unknown>
    success?: boolean
    error?: string
    message?: string
    // Visualization fields
    chart_type?: string
    title?: string
    // deno-lint-ignore no-explicit-any
    [key: string]: any
  }
}

export interface ChatApiMessage {
  role: 'user' | 'assistant'
  content: string
}

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-agent`

export async function streamChat(
  messages: ChatApiMessage[],
  onEvent: (event: StreamEvent) => void,
  abortSignal?: AbortSignal,
  role?: string,
): Promise<void> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ messages, role }),
    signal: abortSignal,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    let errorMessage = `Request failed (${response.status})`
    try {
      const parsed = JSON.parse(errorBody)
      if (parsed.error) errorMessage = parsed.error
    } catch {
      // use default message
    }
    onEvent({ type: 'error', data: { message: errorMessage } })
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    onEvent({ type: 'error', data: { message: 'No response stream' } })
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Parse SSE events from buffer
      const lines = buffer.split('\n')
      buffer = ''

      let currentEventType = ''

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.startsWith('event: ')) {
          currentEventType = line.slice(7).trim()
        } else if (line.startsWith('data: ')) {
          const dataStr = line.slice(6)
          try {
            const data = JSON.parse(dataStr)
            onEvent({ type: currentEventType as StreamEventType, data })
          } catch {
            // incomplete JSON, push back to buffer
            buffer = lines.slice(i).join('\n')
            break
          }
          currentEventType = ''
        } else if (line === '') {
          // empty line = end of event, continue
        } else {
          // incomplete line, push back to buffer
          buffer = lines.slice(i).join('\n')
          break
        }
      }
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      onEvent({ type: 'error', data: { message: (err as Error).message || 'Stream error' } })
    }
  }
}
