import * as React from 'react'

import { cn } from '@/lib/utils'

interface SectionContainerProps {
  title: React.ReactNode
  description?: string
  children: React.ReactNode
  className?: string
}

export function SectionContainer({
  title,
  description,
  children,
  className,
}: SectionContainerProps) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6',
        className,
      )}
    >
      {/* Header */}
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6">
        <div className="leading-none font-semibold">{title}</div>
        {description && (
          <div className="text-muted-foreground text-sm">{description}</div>
        )}
      </div>

      {/* Content */}
      <div className="px-6">{children}</div>
    </div>
  )
}
