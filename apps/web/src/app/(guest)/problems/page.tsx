import { ProblemTypeTab } from './components/problem-type-tab'

export default function ProblemsPage() {
  return (
    <div className="mx-auto max-w-5xl py-2">
      <div className="flex flex-col gap-4 py-8">
        <h2 className="text-3xl font-bold">문제 목록</h2>
        <p className="text-foreground font-medium">
          기초 개념부터 실전 시나리오까지, 학습 단계에 맞춰 문제를 선택할 수
          있습니다.
        </p>
      </div>

      <ProblemTypeTab />
    </div>
  )
}
