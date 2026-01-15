'use client'

import { useProblem } from '../provider'
import { CookbookCard } from './cookbook-card'
import { CompactUnitCard, UnitCard } from './unit'

import React from 'react'

import { cn } from '@/lib/utils'
import { CookbookProblem, ProblemType, UnitProblem } from '@/types/problem.type'

export const ProblemListSection = () => {
  const { currentType, useProblemListQuery } = useProblem()

  const { data: problems, isSuccess } = useProblemListQuery()

  const UnitProblemList = ({ data }: { data: UnitProblem[] }) => {
    return (
      <React.Fragment>
        {data.map((problem) => (
          <UnitCard key={problem.id} {...problem} />
        ))}
      </React.Fragment>
    )
  }

  const CookbookProblemList = ({ data }: { data: CookbookProblem[] }) => {
    return (
      <React.Fragment>
        {data.map((cookbook) => (
          <CookbookCard key={cookbook.id} {...cookbook}>
            {cookbook.problems.map((problem, index) => (
              <CompactUnitCard key={problem.id} step={index + 1} {...problem} />
            ))}
          </CookbookCard>
        ))}
      </React.Fragment>
    )
  }

  if (isSuccess)
    return (
      <section
        className={cn(
          currentType === ProblemType.UNIT && 'grid-cols-3',
          'grid gap-4',
        )}
      >
        {currentType === ProblemType.UNIT ? (
          <UnitProblemList data={problems as UnitProblem[]} />
        ) : (
          <CookbookProblemList data={problems as CookbookProblem[]} />
        )}
      </section>
    )
}
