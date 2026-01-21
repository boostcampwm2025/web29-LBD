'use client'

import { useEffect } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('./browser').then(({ worker }) => {
        worker.start()
      })
    }
  }, [])

  return <>{children}</>
}
