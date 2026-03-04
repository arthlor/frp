import { useState, useCallback, useEffect } from 'react'
import Landing from './components/Landing'
import GameTable from './components/GameTable'
import LorePage from './components/LorePage'
import './App.css'

const SESSION_STORAGE_KEY = 'ida_session'
const ONBOARDING_KEY_PREFIX = 'ida_onboarding_v1_'

function isValidSessionShape(value) {
    return Boolean(
        value
        && typeof value.id === 'string'
        && typeof value.code === 'string'
        && typeof value.name === 'string'
        && typeof value.playerId === 'string'
        && typeof value.playerName === 'string'
    )
}

export default function App() {
    const [session, setSession] = useState(null)
    const [view, setView] = useState('landing') // 'landing' | 'lore' | 'game'
    const [showOnboarding, setShowOnboarding] = useState(false)

    useEffect(() => {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
        if (!raw) return

        try {
            const parsed = JSON.parse(raw)
            if (isValidSessionShape(parsed)) {
                setSession(parsed)
                setView('game')
            } else {
                sessionStorage.removeItem(SESSION_STORAGE_KEY)
            }
        } catch {
            sessionStorage.removeItem(SESSION_STORAGE_KEY)
        }
    }, [])

    const handleJoinSession = useCallback((sessionData) => {
        setSession(sessionData)
        setView('game')
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
    }, [])

    const handleLeaveSession = useCallback(() => {
        setSession(null)
        setView('landing')
        setShowOnboarding(false)
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }, [])

    useEffect(() => {
        if (!session?.playerId) {
            setShowOnboarding(false)
            return
        }

        const onboardingKey = `${ONBOARDING_KEY_PREFIX}${session.playerId}`
        setShowOnboarding(sessionStorage.getItem(onboardingKey) !== '1')
    }, [session])

    const handleCompleteOnboarding = useCallback(() => {
        if (!session?.playerId) return
        const onboardingKey = `${ONBOARDING_KEY_PREFIX}${session.playerId}`
        sessionStorage.setItem(onboardingKey, '1')
        setShowOnboarding(false)
    }, [session])

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
                showOnboarding={showOnboarding}
                onCompleteOnboarding={handleCompleteOnboarding}
            />
        )
    }

    return <Landing onJoin={handleJoinSession} onOpenLore={handleOpenLore} />
}
