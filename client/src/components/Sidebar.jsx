import { MessageCircle, BookOpen, Bookmark, X } from 'lucide-react'
import LeafLogo from './LeafLogo'

const navItems = [
  { id: 'chat', icon: MessageCircle, label: 'Chat' },
  { id: 'topics', icon: BookOpen, label: 'Health Topics' },
  { id: 'saved', icon: Bookmark, label: 'Saved Tips' },
]

export default function Sidebar({ open, onClose, view, onSelect, savedCount }) {
  const handleSelect = (id) => {
    onSelect(id)
    onClose()
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-[260px] flex-col bg-[var(--sidebar)] text-white transition-transform duration-300 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <div className="px-6 pb-6 pt-7">
          <div className="flex items-center gap-2.5">
            <LeafLogo size={32} />
            <span className="font-display text-2xl font-semibold tracking-tight">VitaAI</span>
          </div>
          <p className="mt-2 text-xs text-white/50">Your everyday health companion</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ id, icon: Icon, label }) => {
            const active = view === id
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={`group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? 'border-[var(--accent)] bg-white/[0.06] text-white'
                    : 'border-transparent text-white/60 hover:border-[var(--accent)] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon
                  size={18}
                  className={active ? 'text-[var(--accent)]' : 'text-white/60 group-hover:text-[var(--accent)]'}
                />
                <span className="flex-1">{label}</span>
                {id === 'saved' && savedCount > 0 && (
                  <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {savedCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="px-5 pb-6 pt-4">
          <p className="border-t border-white/10 pt-4 text-[11px] italic leading-relaxed text-white/40">
            Vita is not a substitute for professional medical advice.
          </p>
          <p className="mt-3 text-[11px] text-white/40">
            Built by{' '}
            <a
              href="https://div23.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Divyansh Raghuvanshi
            </a>
          </p>
        </div>
      </aside>
    </>
  )
}
