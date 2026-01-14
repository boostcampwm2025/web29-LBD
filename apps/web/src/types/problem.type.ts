export const enum ProblemType {
  UNIT = 'UNIT',
  COOKBOOK = 'COOKBOOK',
  SCENARIO = 'SCENARIO',
}

export type UnitProblem = {
  id: number
  title: string
  description: string
  tags: string[]
}
