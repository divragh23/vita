import { AlertTriangle, X } from 'lucide-react'

export default function DisclaimerBanner({ onDismiss }) {
  return (
    <div
      className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border px-4 py-3"
      style={{ background: '#FEF3C7', borderColor: '#F59E0B' }}
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#B45309]" />
      <p className="flex-1 text-xs leading-relaxed text-[#92400E]">
        Vita provides general health information only. Always consult a licensed healthcare
        professional for medical decisions. In an emergency, call 911 immediately.
      </p>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 text-[#B45309] transition-colors hover:bg-[#F59E0B]/20"
        aria-label="Dismiss disclaimer"
      >
        <X size={16} />
      </button>
    </div>
  )
}
