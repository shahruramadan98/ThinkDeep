import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { ChatMessage } from '../api/webhook'

interface ChatBubbleProps {
    message: ChatMessage
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user'
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
            <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>

                <div
                    className={`
            relative rounded-2xl px-5 py-3.5 text-sm leading-relaxed overflow-hidden
            backdrop-blur-xl shadow-lg
            ${isUser
                            ? 'bg-gradient-to-br from-sky-400/90 via-indigo-400/90 to-purple-400/90 text-white rounded-tr-none shadow-sky-300/30'
                            : 'bg-white/60 text-slate-800 rounded-tl-none shadow-slate-400/20'
                        }
          `}
                >
                    <div
                        className={`
              pointer-events-none absolute inset-0
              ${isUser
                                ? 'bg-gradient-to-br from-white/25 via-transparent to-black/10'
                                : 'bg-gradient-to-br from-white/40 via-white/10 to-transparent'
                            }
            `}
                    />

                    <div className="relative z-10">
                        {isUser ? (
                            <p className="whitespace-pre-wrap font-medium">
                                {message.content}
                            </p>
                        ) : (
                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-white/70 prose-pre:border prose-pre:border-slate-200/60 prose-pre:backdrop-blur">
                                <ReactMarkdown>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>

                {!isUser && (
                    <div className="mt-2 pl-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={handleCopy}
                            className={`
                flex items-center gap-1.5 text-xs font-medium rounded-md px-2 py-1 transition-all
                backdrop-blur-md
                ${copied
                                    ? 'text-emerald-700 bg-emerald-200/70'
                                    : 'text-slate-400 bg-white/40 hover:bg-white/70 hover:text-slate-600'
                                }
              `}
                        >
                            {copied ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatBubble
