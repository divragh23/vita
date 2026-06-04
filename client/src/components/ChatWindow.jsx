import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import QuickTopics from './QuickTopics'
import DisclaimerBanner from './DisclaimerBanner'

export default function ChatWindow({
  messages,
  isStreaming,
  showDisclaimer,
  onDismissDisclaimer,
  onSend,
  isTipSaved,
  onToggleSave,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isEmpty = messages.length === 0

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 py-5">
        {showDisclaimer && (
          <div className="mb-5">
            <DisclaimerBanner onDismiss={onDismissDisclaimer} />
          </div>
        )}

        {isEmpty ? (
          <QuickTopics onSend={onSend} />
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1
              return (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  isStreaming={isStreaming && isLast && msg.role === 'assistant'}
                  saved={msg.role === 'assistant' && isTipSaved?.(msg.content)}
                  onToggleSave={onToggleSave}
                />
              )
            })}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
