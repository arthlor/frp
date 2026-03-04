import { useState, useCallback } from 'react'
import Landing from './components/Landing'
import GameTable from './components/GameTable'
import './App.css'

export default function App() {
    const [session, setSession] = useState(null)

    const handleJoinSession = useCallback((sessionData) => {
        setSession(sessionData)
    }, [])

    const handleLeaveSession = useCallback(() => {
        setSession(null)
        sessionStorage.removeItem('ida_session')
    }, [])

    if (!session) {
        return <Landing onJoin={handleJoinSession} />
    }

    return (
        <GameTable
            session={session}
            onLeave={handleLeaveSession}
        />
    )
}
