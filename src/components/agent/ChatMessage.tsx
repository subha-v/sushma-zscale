import type { ChatMessage as ChatMessageType } from '../../hooks/useChat'
import { ToolActivityIndicator } from './ToolActivityIndicator'

function renderMarkdown(text: string) {
  if (!text) return null

  // Split into lines and process
  const lines = text.split('\n')
  const elements: JSX.Element[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Table detection: line with | characters
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      if (tableLines.length >= 2) {
        const table = renderTable(tableLines, key++)
        if (table) elements.push(table)
        continue
      }
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-3" />)
      i++
      continue
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-base font-semibold text-white mt-3 mb-1">{formatInline(line.slice(4))}</h3>)
      i++
      continue
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-lg font-semibold text-white mt-3 mb-1">{formatInline(line.slice(3))}</h2>)
      i++
      continue
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-xl font-bold text-white mt-3 mb-1">{formatInline(line.slice(2))}</h1>)
      i++
      continue
    }

    // Bullet list
    if (line.match(/^\s*[-*]\s/)) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        listItems.push(lines[i].replace(/^\s*[-*]\s/, ''))
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1 text-neutral-300 ml-1">
          {listItems.map((item, j) => (
            <li key={j} className="leading-relaxed">{formatInline(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (line.match(/^\s*\d+\.\s/)) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s/)) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-1 text-neutral-300 ml-1">
          {listItems.map((item, j) => (
            <li key={j} className="leading-relaxed">{formatInline(item)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Normal paragraph
    elements.push(<p key={key++} className="text-neutral-300 leading-relaxed">{formatInline(line)}</p>)
    i++
  }

  return <>{elements}</>
}

function formatInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = []
  // Match bold, inline code, or plain text
  const regex = /(\*\*(.+?)\*\*)|(`([^`]+?)`)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[2]) {
      // Bold
      parts.push(<strong key={match.index} className="text-white font-semibold">{match[2]}</strong>)
    } else if (match[4]) {
      // Inline code
      parts.push(<code key={match.index} className="px-1.5 py-0.5 bg-ink-medium rounded text-accent text-sm font-mono">{match[4]}</code>)
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

function renderTable(lines: string[], key: number) {
  const rows = lines
    .filter(line => !line.match(/^\s*\|[\s-:|]+\|\s*$/)) // skip separator row
    .map(line =>
      line
        .split('|')
        .slice(1, -1) // remove empty first/last from leading/trailing |
        .map(cell => cell.trim())
    )

  if (rows.length === 0) return null

  const header = rows[0]
  const body = rows.slice(1)

  return (
    <div key={key} className="overflow-x-auto my-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {header.map((cell, j) => (
              <th key={j} className="text-left px-3 py-2 text-accent font-semibold border-b border-ink-border bg-ink-medium/50">
                {formatInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, j) => (
            <tr key={j} className="border-b border-ink-border/50 hover:bg-ink-light/50">
              {row.map((cell, k) => (
                <td key={k} className="px-3 py-2 text-neutral-300">
                  {formatInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-accent/10 border border-accent/20 text-white'
            : 'bg-ink-light border border-ink-border text-neutral-300'
        }`}
      >
        {/* Tool activity indicators */}
        {!isUser && message.toolActivity.length > 0 && (
          <ToolActivityIndicator activities={message.toolActivity} />
        )}

        {/* Message content */}
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm space-y-1">
            {renderMarkdown(message.content)}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-accent animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
