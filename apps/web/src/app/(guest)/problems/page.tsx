import { ProblemTypeTab } from './components/problem-type-tab'
import { UnitProblemCard } from './components/unit-problem-card'

const fakeUnitProblem = {
  id: 1,
  title: 'VPC 서브넷 구성',
  description: 'Public 서브넷에 EC2 인스턴스를 배치하세요',
  tags: ['VPC', 'EC2', 'Subnet', 'Networking'],
}

export default function ProblemsPage() {
  return (
    <div className="w-full py-2">
      <div className="flex flex-col gap-4 py-8">
        <h2 className="text-3xl font-bold">문제 목록</h2>
        <p className="text-foreground font-medium">
          기초 개념부터 실전 시나리오까지, 학습 단계에 맞춰 문제를 선택할 수
          있습니다.
        </p>
      </div>

      <ProblemTypeTab />

      <section className="grid grid-cols-3 gap-4 pt-4">
        <UnitProblemCard {...fakeUnitProblem} />
      </section>
    </div>
  )
}
