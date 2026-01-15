export const enum ProblemType {
  UNIT = 'unit',
  COOKBOOK = 'cookbook',
  SCENARIO = 'scenario',
}

type BaseProblem = {
  id: number
  title: string
  description: string
  tags?: string[]
}

export type UnitProblem = BaseProblem

export type CookbookProblem = BaseProblem & {
  problems: UnitProblem[]
}
