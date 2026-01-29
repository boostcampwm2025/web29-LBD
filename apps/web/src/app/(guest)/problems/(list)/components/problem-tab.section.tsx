import { ProblemTypeTab } from './problem-type-tab'

export const ProblemTabSection = () => {
  return (
    <section>
      <div className="space-y-4 py-8">
        <h2 className="text-3xl font-bold">문제 목록</h2>
        <p className="text-foreground font-medium">
          기초 개념부터 응용 문제까지, 학습 단계에 맞춰 문제를 선택할 수
          있습니다.
        </p>
      </div>

      <ProblemTypeTab />
    </section>
  )
}
