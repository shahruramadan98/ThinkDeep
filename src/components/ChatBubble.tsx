import React from 'react';
import type { ChatMessage } from '../api/webhook';

interface ChatBubbleProps {
    message: ChatMessage;
}

/**
 * ChatBubble Component
 * Displays a single chat message with different styling for user/assistant
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
            >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            </div>
        </div>
    );
};

export default ChatBubble;
