import LeafLogo from './LeafLogo'

export default function Splash({ hiding }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] transition-opacity duration-500 ease-out ${
        hiding ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="splash-logo">
          <LeafLogo size={60} />
        </div>
        <span className="splash-name mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--text)]">
          VitaAI
        </span>
        <span className="splash-tag mt-1 text-sm text-[var(--muted)]">
          Your everyday health companion
        </span>
      </div>
    </div>
  )
}
