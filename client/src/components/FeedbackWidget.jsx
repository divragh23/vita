import { useState } from 'react'
import { MessageSquarePlus, X, Send, CheckCircle2 } from 'lucide-react'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const close = () => {
    setOpen(false)
    setTimeout(() => {
      if (status === 'sent') {
        setMessage('')
        setName('')
        setContact('')
      }
      setStatus('idle')
      setErrorMsg('')
    }, 200)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!message.trim() || status === 'sending') return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, name, contact }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-[var(--accent-hov)] active:scale-95"
        aria-label="Send feedback"
      >
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="animate-fadeUp w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[var(--text)]">
                Share your feedback
              </h3>
              <button
                onClick={close}
                className="rounded-md p-1 text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {status === 'sent' ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 size={40} className="text-[var(--accent)]" />
                <p className="mt-3 font-medium text-[var(--text)]">Thank you!</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Your feedback has been sent. We appreciate it.
                </p>
                <button
                  onClick={close}
                  className="mt-5 rounded-full bg-[var(--accent)] px-5 py-2 text-sm text-white hover:bg-[var(--accent-hov)]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  maxLength={4000}
                  placeholder="What's working well, or what could be better?"
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    maxLength={120}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    type="email"
                    placeholder="Email (optional)"
                    maxLength={200}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-500">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={!message.trim() || status === 'sending'}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hov)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                  {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
