'use client'

import { createContext, useContext } from 'react'

import { useSearchParams } from 'next/navigation'

import { getProblemListByType } from '@/actions/problems.action'
import { QUERY_KEYS } from '@/constants/query-key'
import { ProblemType } from '@/types/problem.type'
import { useQuery } from '@tanstack/react-query'

interface ProblemContextProps {
  currentType: string | null
  useProblemListQuery: () => ReturnType<typeof useQuery>
}

const ProblemContext = createContext<ProblemContextProps | undefined>(undefined)

interface ProblemProviderProps {
  children: React.ReactNode
}

export const ProblemProvider = ({ children }: ProblemProviderProps) => {
  const searchParams = useSearchParams()
  const currentType = searchParams.get('type') as string

  const useProblemListQuery = () => {
    return useQuery({
      queryKey: [...QUERY_KEYS.PROBLEM_LIST, currentType],
      queryFn: async () =>
        await getProblemListByType(currentType as ProblemType),
      enabled: !!currentType,
    })
  }

  return (
    <ProblemContext.Provider
      value={{
        currentType,
        useProblemListQuery,
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
