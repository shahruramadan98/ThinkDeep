import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../api/webhook';

interface ChatBubbleProps {
    message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isUser
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                    }`}
            >
                {isUser ? (
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
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
        </div>
    );
};

export default ChatBubble;
