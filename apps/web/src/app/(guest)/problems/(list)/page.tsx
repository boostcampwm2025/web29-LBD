import { ProblemListSection } from './components/problem-list.section'
import { ProblemTabSection } from './components/problem-tab.section'

import { getProblemListByType } from '@/lib/problem'
import { TProblemType } from '@/types/problem.type'

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: { type?: TProblemType }
}) {
  const resolvedSearchParams = await searchParams
  const currentType = resolvedSearchParams.type

  if (!currentType) throw new Error('문제 유형 정보가 없습니다.')

  const problems = await getProblemListByType(currentType)

  return (
    <div className="w-full py-2">
      <ProblemTabSection />
      <ProblemListSection currentType={currentType} problems={problems} />
    </div>
  )
}
