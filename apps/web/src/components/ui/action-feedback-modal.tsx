'use client'

import { useActionFeedback, type FeedbackType } from '@/contexts/action-feedback-context'
import { cn } from '@/lib/utils'
import {
    CheckCircle2,
    AlertCircle,
    Info,
    AlertTriangle,
    XCircle
} from 'lucide-react'

const FEEDBACK_CONFIG: Record<FeedbackType, { icon: any, color: string, bgColor: string, borderColor: string }> = {
    success: {
        icon: CheckCircle2,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
    },
    info: {
        icon: Info,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20'
    },
    error: {
        icon: XCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20'
    }
}

export function ActionFeedbackModal() {
    const { isVisible, message, title, type } = useActionFeedback()

    if (!isVisible) return null

    const config = FEEDBACK_CONFIG[type]
    const Icon = config.icon

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pb-20 pointer-events-none md:items-center md:pb-0">
            <div
                className={cn(
                    "bg-background/40 backdrop-blur-xl border shadow-2xl rounded-2xl px-5 py-4 flex items-start gap-4 max-w-[90vw] md:max-w-md",
                    "animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out",
                    config.borderColor
                )}
            >
                <div className={cn("p-2.5 rounded-xl mt-0.5 shadow-inner", config.bgColor)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex flex-col gap-0.5 pr-2">
                    {title && (
                        <h5 className="font-bold text-sm text-foreground/90 tracking-tight leading-none mb-1">
                            {title}
                        </h5>
                    )}
                    <p className="text-[13px] font-medium text-foreground/75 leading-snug">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    )
}
