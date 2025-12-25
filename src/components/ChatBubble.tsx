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
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>
            <div className="max-w-[70%]">
                {/* Bubble */}
                <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${isUser
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                >
                    {isUser ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </p>
                    ) : (
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Tools outside bubble */}
                {!isUser && (
                    <div className="mt-2 pl-1 flex items-center">
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors rounded-md ${copied ? 'text-green-500 hover:text-green-600' : ''
                                }`}
                            title={copied ? 'Copied!' : 'Copy to clipboard'}
                        >
                            {copied ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
