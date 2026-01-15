import { CookbookCard } from './cookbook-card'
import { CompactUnitCard } from './unit'

const fakeUnitProblem = {
  id: 1,
  title: 'VPC 서브넷 구성',
  description: 'Public 서브넷에 EC2 인스턴스를 배치하세요',
  tags: ['VPC', 'EC2', 'Subnet', 'Networking'],
}

const fakeCookbookProblem = {
  id: 2,
  title: 'VPC 서브넷 구성',
  description: 'Public 서브넷에 EC2 인스턴스를 배치하세요',
  tags: ['VPC', 'EC2', 'Subnet', 'Networking'],
  problems: [
    {
      id: 1,
      title: 'VPC 서브넷 구성',
      description: 'Public 서브넷에 EC2 인스턴스를 배치하세요',
    },
    {
      id: 3,
      title: '보안 그룹 설정',
      description: 'EC2 인스턴스에 대한 보안 그룹을 설정하세요',
    },
  ],
}

export const ProblemListSection = () => {
  return (
    <section className="pt-6">
      <CookbookCard {...fakeCookbookProblem}>
        {fakeCookbookProblem.problems.map((problem, index) => (
          <CompactUnitCard key={problem.id} step={index + 1} {...problem} />
        ))}
      </CookbookCard>
    </section>
  )
}
