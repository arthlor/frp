import { useState, useCallback } from 'react'
import Landing from './components/Landing'
import GameTable from './components/GameTable'
import LorePage from './components/LorePage'
import './App.css'

export default function App() {
    const [session, setSession] = useState(null)
    const [view, setView] = useState('landing') // 'landing' | 'lore' | 'game'

    const handleJoinSession = useCallback((sessionData) => {
        setSession(sessionData)
        setView('game')
    }, [])

    const handleLeaveSession = useCallback(() => {
        setSession(null)
        setView('landing')
        sessionStorage.removeItem('ida_session')
    }, [])

    const handleOpenLore = useCallback(() => {
        setView('lore')
    }, [])

    const handleCloseLore = useCallback(() => {
        setView('landing')
    }, [])

    if (view === 'lore') {
        return <LorePage onBack={handleCloseLore} />
    }

    if (view === 'game' && session) {
        return (
            <GameTable
                session={session}
                onLeave={handleLeaveSession}
            />
        )
    }

    return <Landing onJoin={handleJoinSession} onOpenLore={handleOpenLore} />
}
