import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Heart, Bookmark, BookmarkCheck } from 'lucide-react'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent)]" />
    </div>
  )
}

const linkRenderer = {
  a: ({ node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
}

export default function MessageBubble({
  role,
  content,
  isStreaming = false,
  timestamp,
  saved = false,
  onToggleSave,
}) {
  const isUser = role === 'user'
  const time =
    timestamp ||
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (isUser) {
    return (
      <div className="animate-fadeUp flex flex-col items-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[var(--user-bg)] px-4 py-2.5 text-[15px] leading-relaxed text-white">
          {content}
        </div>
        <span className="mt-1 pr-1 text-[11px] text-[var(--muted)]">{time}</span>
      </div>
    )
  }

  const canSave = !isStreaming && content?.trim()

  return (
    <div className="animate-fadeUp flex flex-col items-start">
      <div className="mb-1 flex items-center gap-1.5 pl-1">
        <Heart size={13} className="text-[var(--accent)]" fill="currentColor" />
        <span className="text-xs font-medium text-[var(--accent)]">Vita</span>
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--text)]">
        {isStreaming && !content ? (
          <TypingIndicator />
        ) : (
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={linkRenderer}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {!isStreaming && (
        <div className="mt-1 flex items-center gap-3 pl-1">
          <span className="text-[11px] text-[var(--muted)]">{time}</span>
          {canSave && (
            <button
              onClick={() => onToggleSave?.(content)}
              className={`flex items-center gap-1 text-[11px] transition-colors ${
                saved
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--accent)]'
              }`}
              aria-label={saved ? 'Remove from saved tips' : 'Save as tip'}
            >
              {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
              {saved ? 'Saved' : 'Save tip'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
