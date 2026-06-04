import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bookmark, Trash2, MessageCircle } from 'lucide-react'

const linkRenderer = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
}

export default function SavedTips({ tips, onRemove, onGoToChat }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-center gap-2">
          <Bookmark size={20} className="text-[var(--accent)]" />
          <h2 className="font-display text-2xl font-semibold text-[var(--text)]">Saved Tips</h2>
        </div>

        {tips.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <Bookmark size={26} className="text-[var(--accent)]" />
            </div>
            <p className="mt-4 text-base font-medium text-[var(--text)]">No saved tips yet</p>
            <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">
              When Vita shares advice you want to keep, tap <strong>Save tip</strong> under the
              message and it will appear here.
            </p>
            <button
              onClick={onGoToChat}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--accent-hov)]"
            >
              <MessageCircle size={16} />
              Start chatting
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="markdown-body text-[15px] text-[var(--text)]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={linkRenderer}>
                    {tip.content}
                  </ReactMarkdown>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2.5">
                  <span className="text-[11px] text-[var(--muted)]">Saved {tip.savedAt}</span>
                  <button
                    onClick={() => onRemove(tip.id)}
                    className="flex items-center gap-1 text-[11px] text-[var(--muted)] transition-colors hover:text-red-500"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
