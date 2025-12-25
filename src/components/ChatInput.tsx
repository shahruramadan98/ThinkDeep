import React, { useState, type KeyboardEvent } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
    loading: boolean;
    activeDocument?: string | null;
}

/**
 * ChatInput Component
 * THEME MATCHED: Dark Glass styling with Indigo accents
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
        <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-md p-4 pb-6">

            {/* Quick Actions Bar */}
            {!disabled && !loading && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => onSend(action.prompt)}
                            className="
                flex items-center gap-2 px-3 py-1.5 text-xs font-medium 
                text-slate-400 bg-white/5 border border-white/10 rounded-full 
                shadow-sm transition-all duration-200 whitespace-nowrap
                hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-indigo-200 hover:shadow-indigo-500/10
              "
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="flex gap-3 items-end relative">
                <div className="relative flex-1">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress} // React uses onKeyDown for modern event handling
                        placeholder={disabled ? 'Please upload a document first...' : 'Ask a question about your document...'}
                        disabled={disabled || loading}
                        rows={1}
                        style={{ minHeight: '44px', maxHeight: '120px' }} // Auto-growing feel constraints
                        className="
                w-full resize-none rounded-2xl border border-white/10 px-4 py-3 
                bg-slate-950 text-white placeholder-slate-500 shadow-inner
                focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none 
                disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed
                transition-all duration-200
            "
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={disabled || loading || !message.trim()}
                    className={`
            h-11 px-5 rounded-xl font-medium flex items-center justify-center transition-all duration-200
            ${disabled || loading || !message.trim()
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-105 active:scale-95'
                        }
          `}
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatInput;