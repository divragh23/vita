const TOPICS = [
  'I have a headache — what could it be?',
  'How much water should I drink daily?',
  'Tips for better sleep quality',
  'What are signs of vitamin D deficiency?',
  'How to manage stress and anxiety naturally',
  'My throat has been sore for 3 days',
]

export default function QuickTopics({ onSend }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-[var(--text)]">
          Hi, I'm Vita 👋
        </h2>
        <p className="mt-2 text-base text-[var(--muted)]">What's on your mind today?</p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => onSend(topic)}
              className="rounded-full border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
