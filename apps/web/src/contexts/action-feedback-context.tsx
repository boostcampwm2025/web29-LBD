'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react'

export type FeedbackType = 'success' | 'info' | 'warning' | 'error'

interface ActionFeedbackOptions {
    title?: string
    message: string
    type?: FeedbackType
    duration?: number
}

interface ActionFeedbackContextType {
    showFeedback: (options: string | ActionFeedbackOptions) => void
    hideFeedback: () => void
    isVisible: boolean
    message: string
    title: string
    type: FeedbackType
}

const ActionFeedbackContext = createContext<ActionFeedbackContextType | undefined>(undefined)

export function ActionFeedbackProvider({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')
    const [type, setType] = useState<FeedbackType>('success')
    const timeoutRef = useRef<NodeJS.Timeout>(null)

    const hideFeedback = useCallback(() => {
        setIsVisible(false)
    }, [])

    const showFeedback = useCallback((options: string | ActionFeedbackOptions) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        const config = typeof options === 'string'
            ? { message: options, type: 'success' as FeedbackType, duration: 3000 }
            : { type: 'success' as FeedbackType, duration: 3000, ...options }

        setMessage(config.message)
        setTitle(config.title || '')
        setType(config.type || 'success')
        setIsVisible(true)

        timeoutRef.current = setTimeout(() => {
            setIsVisible(false)
        }, config.duration)
    }, [])

    return (
        <ActionFeedbackContext.Provider value={{ showFeedback, hideFeedback, isVisible, message, title, type }}>
            {children}
        </ActionFeedbackContext.Provider>
    )
}

export function useActionFeedback() {
    const context = useContext(ActionFeedbackContext)
    if (context === undefined) {
        throw new Error('useActionFeedback must be used within an ActionFeedbackProvider')
    }
    return context
}
