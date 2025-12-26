import React, { useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import type { ChatMessage } from '../api/webhook'

interface ChatWindowProps {
    messages: ChatMessage[]
    loading: boolean
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, loading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    return (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gradient-to-b from-slate-100 via-white to-indigo-100 relative">

            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-indigo-100/40 pointer-events-none" />

            <div className="relative z-10 min-h-full flex flex-col">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <div className="text-center p-8 rounded-3xl bg-white/70 border border-white/50 backdrop-blur-xl shadow-xl max-w-sm mx-auto">
                            <div className="bg-sky-200/60 p-4 rounded-full inline-block mb-4 shadow-md">
                                <svg
                                    className="h-8 w-8 text-sky-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                No messages yet
                            </h3>

                            <p className="text-sm text-slate-500 leading-relaxed">
                                Upload a document from the sidebar and start asking questions to get insights
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6 py-4">
                            {messages.map((message, index) => (
                                <ChatBubble key={index} message={message} />
                            ))}
                        </div>

                        {loading && (
                            <div className="flex justify-start mb-4 animate-fade-in">
                                <div className="flex items-center gap-3">

                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 flex items-center justify-center shrink-0 shadow-md">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>

                                    <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <div
                                                className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0ms' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '150ms' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '300ms' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    )
}

export default ChatWindow
