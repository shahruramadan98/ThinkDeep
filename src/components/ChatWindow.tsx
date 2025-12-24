import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import type { ChatMessage } from '../api/webhook';

interface ChatWindowProps {
    messages: ChatMessage[];
    loading: boolean;
}

/**
 * ChatWindow Component
 * Displays the scrollable chat history
 */
const ChatWindow: React.FC<ChatWindowProps> = ({ messages, loading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-purple-50/30">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="text-sm mt-2">Upload a document and start asking questions</p>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((message, index) => (
                        <ChatBubble key={index} message={message} />
                    ))}
                    {loading && (
                        <div className="flex justify-start mb-4">
                            <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-100 border border-gray-200">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
};

export default ChatWindow;
