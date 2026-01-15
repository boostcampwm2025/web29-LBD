'use client'

import { createContext, useContext } from 'react'

import { useSearchParams } from 'next/navigation'

interface ProblemContextProps {
  currentTab: string | null
}

const ProblemContext = createContext<ProblemContextProps | undefined>(undefined)

interface ProblemProviderProps {
  children: React.ReactNode
}

export const ProblemProvider = ({ children }: ProblemProviderProps) => {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('type') as string

  return (
    <ProblemContext.Provider
      value={{
        currentTab,
      }}
    >
      {children}
    </ProblemContext.Provider>
  )
}

export const useProblem = () => {
  const context = useContext(ProblemContext)

  if (!context)
    throw new Error('useProblem must be used within a ProblemProvider')

  return context
}
