import {
  BookOpen, Brain, Bed, Thermometer, Wind, Heart, Droplet, Activity,
  Pizza, Smile, Sun, Eye, Zap, Stethoscope, Bone, ShieldCheck,
} from 'lucide-react'

const CATEGORIES = [
  {
    title: 'Everyday Symptoms',
    items: [
      { icon: Brain, title: 'Headaches & migraines', q: 'I keep getting headaches — what are the common causes and how can I relieve them?' },
      { icon: Thermometer, title: 'Cold & flu', q: 'What helps me recover faster from a common cold or the flu?' },
      { icon: Stethoscope, title: 'Sore throat', q: 'My throat is sore — what can I do to soothe it and when should I worry?' },
      { icon: Wind, title: 'Cough & congestion', q: 'I have a persistent cough and nasal congestion — how can I ease it?' },
      { icon: Pizza, title: 'Heartburn & indigestion', q: 'What causes heartburn and indigestion, and how can I prevent it?' },
      { icon: Activity, title: 'Stomach upset', q: 'I have an upset stomach and nausea — what could be causing it?' },
    ],
  },
  {
    title: 'Lifestyle & Wellness',
    items: [
      { icon: Bed, title: 'Better sleep', q: 'How can I improve my sleep quality and fall asleep more easily?' },
      { icon: Smile, title: 'Stress & anxiety', q: 'How can I manage daily stress and anxiety naturally?' },
      { icon: Droplet, title: 'Hydration', q: 'How much water should I drink daily and what are signs of dehydration?' },
      { icon: Pizza, title: 'Healthy eating', q: 'What does a simple, balanced daily diet look like?' },
      { icon: Zap, title: 'Low energy & fatigue', q: 'I feel tired all the time — what lifestyle changes could boost my energy?' },
      { icon: Activity, title: 'Staying active', q: 'How much exercise do I need each week and how do I start a routine?' },
    ],
  },
  {
    title: 'Common Concerns',
    items: [
      { icon: Sun, title: 'Vitamin D deficiency', q: 'What are the signs of vitamin D deficiency and how do I get enough?' },
      { icon: Eye, title: 'Eye strain', q: 'My eyes feel strained from screens — how can I reduce digital eye strain?' },
      { icon: Bone, title: 'Back & neck pain', q: 'I have back and neck pain from sitting all day — what can help?' },
      { icon: Heart, title: 'Blood pressure basics', q: 'What lifestyle habits help keep blood pressure healthy?' },
      { icon: Activity, title: 'Seasonal allergies', q: 'How can I manage seasonal allergy symptoms like sneezing and itchy eyes?' },
      { icon: ShieldCheck, title: 'Preventive care', q: 'What everyday habits help prevent common illnesses?' },
    ],
  },
]

export default function HealthTopics({ onSelectTopic }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={20} className="text-[var(--accent)]" />
          <h2 className="font-display text-2xl font-semibold text-[var(--text)]">Health Topics</h2>
        </div>
        <p className="mb-6 text-sm text-[var(--muted)]">
          Common daily and recurring health concerns. Tap any topic to ask Vita about it.
        </p>

        <div className="flex flex-col gap-7">
          {CATEGORIES.map((cat) => (
            <section key={cat.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {cat.title}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {cat.items.map(({ icon: Icon, title, q }) => (
                  <button
                    key={title}
                    onClick={() => onSelectTopic(q)}
                    className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 text-left transition-all hover:border-[var(--accent)] hover:shadow-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--accent)]">
                      {title}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
