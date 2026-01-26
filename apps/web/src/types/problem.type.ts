interface BaseProblem {
  id: number
  title: string
  description: string
  tags?: string[]
}

export const problemType = {
  UNIT: 'unit',
  COOKBOOK: 'cookbook',
  SCENARIO: 'scenario',
} as const

export type TProblemType =
  | (typeof problemType)['UNIT']
  | (typeof problemType)['COOKBOOK']
  | (typeof problemType)['SCENARIO']

export type UnitProblem = BaseProblem

export type CookbookProblem = BaseProblem & {
  problems: UnitProblem[]
}
