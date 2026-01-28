import { CookbookCard } from './cookbook-card'
import { CompactUnitCard, UnitCard } from './unit'

import React from 'react'

import { cn } from '@/lib/utils'
import {
  CookbookProblem,
  type TProblemType,
  UnitProblem,
  problemType,
} from '@/types/problem.type'

interface ProblemListSectionProps {
  currentType: TProblemType
  problems: UnitProblem[] | CookbookProblem[]
}

export const ProblemListSection = ({
  currentType,
  problems,
}: ProblemListSectionProps) => {
  return (
    <section
      className={cn(
        currentType === problemType.UNIT && 'grid-cols-3',
        'grid gap-4',
      )}
    >
      {currentType === problemType.UNIT ? (
        <UnitProblemList data={problems as UnitProblem[]} />
      ) : (
        <CookbookProblemList data={problems as CookbookProblem[]} />
      )}
    </section>
  )
}

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
