import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../api/webhook';

interface ChatBubbleProps {
    message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
            <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>

                {/* Bubble Container */}
                <div
                    className={`
                        rounded-2xl px-5 py-3.5 shadow-sm relative overflow-hidden text-sm leading-relaxed
                        ${isUser
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-indigo-500/20' // User: Gradient
                            : 'bg-slate-800/80 backdrop-blur-sm border border-white/10 text-slate-100 rounded-tl-none' // AI: Dark Glass
                        }
                    `}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap font-medium">
                            {message.content}
                        </p>
                    ) : (
                        /* 'prose-invert' is CRITICAL here. 
                           It tells TailwindTypography to style text for Dark Mode (white text). 
                        */
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-white/10">
                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Tools Row (Copy, etc.) - Only shows on hover to keep UI clean */}
                {!isUser && (
                    <div className="mt-2 pl-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={handleCopy}
                            className={`
                                flex items-center gap-1.5 text-xs font-medium transition-all rounded-md px-2 py-1 border border-transparent
                                ${copied
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                    : 'text-slate-500 hover:text-indigo-300 hover:bg-white/5 hover:border-white/5'
                                }
                            `}
                            title={copied ? 'Copied!' : 'Copy to clipboard'}
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
    );
};

export default ChatBubble;