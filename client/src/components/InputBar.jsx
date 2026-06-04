import { useRef, useState, useEffect } from 'react'
import { Send } from 'lucide-react'

const MAX_CHARS = 1000

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [value])

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="flex flex-1 flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 focus-within:border-[var(--accent)]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            maxLength={MAX_CHARS}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Vita about a health concern…"
            className="max-h-[140px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none disabled:opacity-60"
          />
          {value.length >= 800 && (
            <span className="self-end pt-1 text-[11px] text-[var(--muted)]">
              {value.length}/{MAX_CHARS}
            </span>
          )}
        </div>

        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition-all hover:bg-[var(--accent-hov)] active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
