import { useState } from 'react'
import {
    generateSessionCode,
    getOrCreatePlayerId,
    createSession,
    findSession,
    upsertPlayer,
} from '../utils/supabase'
import './Landing.css'

export default function Landing({ onJoin }) {
    const [mode, setMode] = useState(null) // 'create' | 'join'
    const [sessionName, setSessionName] = useState('')
    const [sessionCode, setSessionCode] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!sessionName.trim() || !playerName.trim()) {
            setError('Lütfen tüm alanları doldurun.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const code = generateSessionCode()
            const playerId = getOrCreatePlayerId()
            const session = await createSession(code, sessionName.trim(), playerId)
            await upsertPlayer(session.id, playerId, playerName.trim(), 'dm')
            onJoin({
                id: session.id,
                code,
                name: sessionName.trim(),
                playerId,
                playerName: playerName.trim(),
                role: 'dm',
            })
        } catch (err) {
            console.error('Session create error:', err)
            setError('Oturum oluşturulamadı. Tekrar dene.')
        } finally {
            setLoading(false)
        }
    }

    const handleJoin = async (e) => {
        e.preventDefault()
        if (!sessionCode.trim() || !playerName.trim()) {
            setError('Lütfen tüm alanları doldurun.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const session = await findSession(sessionCode.trim())
            if (!session) {
                setError('Oturum bulunamadı. Kodu kontrol et.')
                setLoading(false)
                return
            }
            const playerId = getOrCreatePlayerId()
            await upsertPlayer(session.id, playerId, playerName.trim(), 'player')
            onJoin({
                id: session.id,
                code: session.code,
                name: session.name,
                playerId,
                playerName: playerName.trim(),
                role: 'player',
            })
        } catch (err) {
            console.error('Session join error:', err)
            setError('Oturuma katılınamadı. Tekrar dene.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="landing">
            <div className="landing-bg">
                <div className="landing-particles" />
                <div className="landing-fog" />
            </div>

            <div className="landing-content">
                <div className="landing-header animate-fade-in">
                    <div className="landing-icon">⚡</div>
                    <h1>İda'nın Son Muhafızları</h1>
                    <p className="landing-subtitle">
                        Kaz Dağları Modern Fantastik Rol Yapma Oyunu
                    </p>
                    <div className="landing-tagline">Sanal Masa</div>
                </div>

                {!mode && (
                    <div className="landing-choices animate-fade-in">
                        <button className="choice-card" onClick={() => setMode('create')} id="btn-create-session">
                            <span className="choice-icon">🏛️</span>
                            <span className="choice-title">Oturum Oluştur</span>
                            <span className="choice-desc">Oyun Yöneticisi (DM) olarak yeni bir oturum başlat</span>
                        </button>
                        <div className="choice-divider"><span>veya</span></div>
                        <button className="choice-card" onClick={() => setMode('join')} id="btn-join-session">
                            <span className="choice-icon">⚔️</span>
                            <span className="choice-title">Oturuma Katıl</span>
                            <span className="choice-desc">Arkadaşının paylaştığı kodla oturuma katıl</span>
                        </button>
                    </div>
                )}

                {mode === 'create' && (
                    <form className="landing-form card animate-fade-in" onSubmit={handleCreate}>
                        <h3>🏛️ Yeni Oturum Oluştur</h3>
                        <div className="form-group">
                            <label htmlFor="session-name">Oturum Adı</label>
                            <input id="session-name" className="input" type="text" placeholder="Örn: Sazlı Köyü'nde Uyanış" value={sessionName} onChange={(e) => setSessionName(e.target.value)} autoFocus maxLength={50} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dm-name">Senin Adın (DM)</label>
                            <input id="dm-name" className="input" type="text" placeholder="Örn: Zeus'un Elçisi" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={30} />
                        </div>
                        {error && <p className="form-error">{error}</p>}
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => { setMode(null); setError('') }}>← Geri</button>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? '⏳ Oluşturuluyor...' : '⚡ Oturumu Başlat'}
                            </button>
                        </div>
                    </form>
                )}

                {mode === 'join' && (
                    <form className="landing-form card animate-fade-in" onSubmit={handleJoin}>
                        <h3>⚔️ Oturuma Katıl</h3>
                        <div className="form-group">
                            <label htmlFor="join-code">Oturum Kodu</label>
                            <input id="join-code" className="input input-code" type="text" placeholder="ABCD12" value={sessionCode} onChange={(e) => setSessionCode(e.target.value.toUpperCase())} autoFocus maxLength={6} style={{ textTransform: 'uppercase', letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.5rem' }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="player-name">Senin Adın</label>
                            <input id="player-name" className="input" type="text" placeholder="Örn: Artemis'in Kızı" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={30} />
                        </div>
                        {error && <p className="form-error">{error}</p>}
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={() => { setMode(null); setError('') }}>← Geri</button>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? '⏳ Katılınıyor...' : '⚔️ Katıl'}
                            </button>
                        </div>
                    </form>
                )}

                <p className="landing-footer text-muted text-xs">
                    İda'nın kadim kapıları aralanmış ve çağrı yapılmıştır.
                </p>
            </div>
        </div>
    )
}
