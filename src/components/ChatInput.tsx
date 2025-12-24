import React, { useState, type KeyboardEvent } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
    loading: boolean;
    activeDocument?: string | null;
}

/**
 * ChatInput Component
 * Handles user input and message sending
 */
const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, loading, activeDocument }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() && !disabled && !loading) {
            onSend(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickActions = [
        {
            label: 'Summarize',
            prompt: activeDocument ? `Summarize this ${activeDocument}` : 'Summarize this document',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            )
        },
        {
            label: 'Analyze',
            prompt: activeDocument ? `Analyze ${activeDocument}. Provide interpretation, reasoning, and insights.` : 'Analyze this document. Provide interpretation, reasoning, and insights.',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            )
        },
        {
            label: 'Key points',
            prompt: activeDocument ? `What are the key points of ${activeDocument}?` : 'What are the key points?',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        }
    ];

    return (
        <div className="border-t border-gray-100 bg-white p-4">
            {!disabled && !loading && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => onSend(action.prompt)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all whitespace-nowrap"
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex gap-2">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={disabled ? 'Please upload a document first...' : 'Type your question...'}
                    disabled={disabled || loading}
                    rows={2}
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                    onClick={handleSend}
                    disabled={disabled || loading || !message.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
