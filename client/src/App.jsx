import { useState, useEffect } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import HealthTopics from './components/HealthTopics'
import SavedTips from './components/SavedTips'
import FeedbackWidget from './components/FeedbackWidget'
import LeafLogo from './components/LeafLogo'
import Splash from './components/Splash'

const TIPS_KEY = 'vita_saved_tips'
const THEME_KEY = 'vita_theme'

function App() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState('chat')

  const [booting, setBooting] = useState(true)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const fade = setTimeout(() => setHiding(true), 1300)
    const done = setTimeout(() => setBooting(false), 1850)
    return () => {
      clearTimeout(fade)
      clearTimeout(done)
    }
  }, [])

  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) ||
      (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  const [savedTips, setSavedTips] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TIPS_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(TIPS_KEY, JSON.stringify(savedTips))
  }, [savedTips])

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const isTipSaved = (content) => savedTips.some((t) => t.content === content)

  const toggleSaveTip = (content) => {
    setSavedTips((prev) => {
      if (prev.some((t) => t.content === content)) {
        return prev.filter((t) => t.content !== content)
      }
      return [
        { id: Date.now(), content, savedAt: new Date().toLocaleDateString() },
        ...prev,
      ]
    })
  }

  const removeTip = (id) => setSavedTips((prev) => prev.filter((t) => t.id !== id))

  const sendMessage = async (text) => {
    if (isStreaming) return
    setView('chat')

    const userMsg = { role: 'user', content: text, timestamp: now() }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setIsStreaming(true)
    setMessages((prev) => [...prev, { role: 'assistant', content: '', timestamp: now() }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      })

      if (!response.ok || !response.body) throw new Error('Request failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let streaming = true

      while (streaming) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') {
            streaming = false
            break
          }
          try {
            const { token, error } = JSON.parse(data)
            if (error) {
              appendToLast(`\n\n⚠️ ${error}`)
              streaming = false
              break
            }
            if (token) appendToLast(token)
          } catch {
            continue
          }
        }
      }
    } catch {
      appendToLast('⚠️ Sorry, I could not reach the server. Please try again.')
    } finally {
      setIsStreaming(false)
    }
  }

  const appendToLast = (token) => {
    setMessages((prev) => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      updated[updated.length - 1] = { ...last, content: last.content + token }
      return updated
    })
  }

  const titles = { chat: 'Chat', topics: 'Health Topics', saved: 'Saved Tips' }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {booting && <Splash hiding={hiding} />}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        onSelect={setView}
        savedCount={savedTips.length}
      />

      <div className="app-fade-in flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-[var(--text)] hover:bg-[var(--bg)] md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-1.5 md:hidden">
            <LeafLogo size={20} />
            <span className="font-display text-lg font-semibold text-[var(--text)]">VitaAI</span>
          </div>

          <span className="hidden font-display text-lg font-semibold text-[var(--text)] md:block">
            {titles[view]}
          </span>

          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="ml-auto rounded-lg border border-[var(--border)] p-2 text-[var(--text)] transition-colors hover:bg-[var(--bg)]"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {view === 'chat' && (
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            showDisclaimer={showDisclaimer}
            onDismissDisclaimer={() => setShowDisclaimer(false)}
            onSend={sendMessage}
            isTipSaved={isTipSaved}
            onToggleSave={toggleSaveTip}
          />
        )}

        {view === 'topics' && <HealthTopics onSelectTopic={sendMessage} />}

        {view === 'saved' && (
          <SavedTips
            tips={savedTips}
            onRemove={removeTip}
            onGoToChat={() => setView('chat')}
          />
        )}

        {view === 'chat' && <InputBar onSend={sendMessage} disabled={isStreaming} />}
      </div>

      <FeedbackWidget inChat={view === 'chat'} />
    </div>
  )
}

export default App
