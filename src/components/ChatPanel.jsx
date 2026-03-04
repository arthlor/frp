import { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'

export default function ChatPanel({ messages, onSend, isDM, playerName }) {
    const [text, setText] = useState('')
    const [isNarration, setIsNarration] = useState(false)
    const listRef = useRef(null)

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
        }
    }, [messages])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) return
        onSend({
            message: text.trim(),
            type: isDM && isNarration ? 'narration' : 'chat',
        })
        setText('')
    }

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h4>💬 Sohbet</h4>
            </div>

            <div className="chat-messages" ref={listRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`chat-msg msg-${msg.type}`}>
                        {msg.type === 'narration' ? (
                            <div className="msg-narration">
                                <span className="msg-narrator">📜 DM</span>
                                <p>{msg.message}</p>
                            </div>
                        ) : msg.type === 'system' ? (
                            <div className="msg-system">{msg.message}</div>
                        ) : (
                            <>
                                <span className="msg-sender">{msg.playerName}</span>
                                <span className="msg-text">{msg.message}</span>
                            </>
                        )}
                    </div>
                ))}
                {messages.length === 0 && (
                    <p className="chat-empty text-muted text-sm">Henüz mesaj yok</p>
                )}
            </div>

            <form className="chat-input" onSubmit={handleSubmit}>
                {isDM && (
                    <label className="narration-toggle">
                        <input type="checkbox" checked={isNarration} onChange={e => setIsNarration(e.target.checked)} />
                        <span>📜 Anlatı</span>
                    </label>
                )}
                <div className="chat-input-row">
                    <input
                        className="input"
                        type="text"
                        placeholder={isNarration ? 'Sahneyi anlat...' : 'Mesaj yaz...'}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        maxLength={500}
                    />
                    <button type="submit" className="btn btn-primary btn-sm">→</button>
                </div>
            </form>
        </div>
    )
}
