import React, { useState, type KeyboardEvent } from 'react'

interface ChatInputProps {
    onSend: (message: string) => void
    disabled: boolean
    loading: boolean
    activeDocument?: string | null
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    disabled,
    loading,
    activeDocument
}) => {
    const [message, setMessage] = useState('')

    const handleSend = () => {
        if (message.trim() && !disabled && !loading) {
            onSend(message.trim())
            setMessage('')
        }
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const quickActions = [
        {
            label: 'Summarize',
            prompt: activeDocument
                ? `Summarize this ${activeDocument}`
                : 'Summarize this document'
        },
        {
            label: 'Analyze',
            prompt: activeDocument
                ? `Analyze ${activeDocument} and give insights`
                : 'Analyze this document and give insights'
        },
        {
            label: 'Key points',
            prompt: activeDocument
                ? `What are the key points of ${activeDocument}`
                : 'What are the key points'
        }
    ]

    return (
        <div
            style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(255,255,255,0.6)'
            }}
        >
            {!disabled && !loading && (
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '14px',
                        overflowX: 'auto',
                        paddingBottom: '2px'
                    }}
                >
                    {quickActions.map(action => (
                        <button
                            key={action.label}
                            onClick={() => onSend(action.prompt)}
                            style={{
                                position: 'relative',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: 600,
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.6)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.7)',
                                color: '#881337',
                                cursor: 'pointer',
                                boxShadow:
                                    '0 6px 14px rgba(244,114,182,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-1px)'
                                e.currentTarget.style.background =
                                    'linear-gradient(135deg, rgba(253,232,243,0.95), rgba(251,207,232,0.95))'
                                e.currentTarget.style.boxShadow =
                                    '0 12px 26px rgba(244,114,182,0.35), inset 0 1px 0 rgba(255,255,255,0.8)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.background =
                                    'rgba(255,255,255,0.6)'
                                e.currentTarget.style.boxShadow =
                                    '0 6px 14px rgba(244,114,182,0.18), inset 0 1px 0 rgba(255,255,255,0.7)'
                            }}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                        disabled
                            ? 'Please upload a document first'
                            : 'Ask a question about your document'
                    }
                    disabled={disabled || loading}
                    rows={1}
                    style={{
                        flex: 1,
                        resize: 'none',
                        padding: '12px 14px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.6)',
                        background: 'rgba(255,255,255,0.75)',
                        color: '#4a044e',
                        outline: 'none',
                        minHeight: '44px',
                        maxHeight: '120px'
                    }}
                />

                <button
                    onClick={handleSend}
                    disabled={disabled || loading || !message.trim()}
                    style={{
                        height: '44px',
                        padding: '0 18px',
                        borderRadius: '14px',
                        fontWeight: 600,
                        cursor:
                            disabled || loading || !message.trim()
                                ? 'not-allowed'
                                : 'pointer',
                        background:
                            disabled || loading || !message.trim()
                                ? 'rgba(236,72,153,0.25)'
                                : 'linear-gradient(135deg, rgb(244,114,182), rgb(236,72,153))',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow:
                            disabled || loading || !message.trim()
                                ? 'none'
                                : '0 10px 24px rgba(236,72,153,0.45)'
                    }}
                >
                    {loading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    )
}

export default ChatInput
