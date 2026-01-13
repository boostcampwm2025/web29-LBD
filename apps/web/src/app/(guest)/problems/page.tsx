'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// 문제 타입
interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

// Cookbook 문제 샘플 데이터
const COOKBOOK_PROBLEMS: Problem[] = [
  {
    id: 'cookbook-1',
    title: '리액트 빌드 결과물 S3와 CloudFront로 안전하게 배포하기',
    difficulty: 'Easy',
  },
]

// Unit 문제 샘플 데이터
const UNIT_PROBLEMS: Problem[] = [
  {
    id: 'unit-1',
    title: 'S3 버킷 생성 및 권한 설정',
    difficulty: 'Easy',
  },
  {
    id: 'unit-2',
    title: 'EC2 보안 그룹 구성하기',
    difficulty: 'Easy',
  },
  {
    id: 'unit-3',
    title: 'IAM 역할 및 정책 생성하기',
    difficulty: 'Medium',
  },
  {
    id: 'unit-4',
    title: 'VPC 및 서브넷 설정하기',
    difficulty: 'Medium',
  },
  {
    id: 'unit-5',
    title: 'CloudWatch 알람 설정하기',
    difficulty: 'Easy',
  },
  {
    id: 'unit-6',
    title: 'Route53 DNS 레코드 관리하기',
    difficulty: 'Medium',
  },
  {
    id: 'unit-7',
    title: 'ELB 로드 밸런서 구성하기',
    difficulty: 'Hard',
  },
  {
    id: 'unit-8',
    title: 'Auto Scaling 그룹 설정하기',
    difficulty: 'Hard',
  },
  {
    id: 'unit-9',
    title: 'CloudFormation 템플릿 작성하기',
    difficulty: 'Hard',
  },
  {
    id: 'unit-10',
    title: 'ECS 클러스터 및 서비스 배포하기',
    difficulty: 'Hard',
  },
]

// Scenario 문제 샘플 데이터
const SCENARIO_PROBLEMS: Problem[] = [
  {
    id: 'scenario-1',
    title: '서버리스 이미지 처리 파이프라인 구축하기',
    difficulty: 'Hard',
  },
  {
    id: 'scenario-2',
    title: '고가용성 웹 애플리케이션 아키텍처 설계하기',
    difficulty: 'Hard',
  },
  {
    id: 'scenario-3',
    title: '마이크로서비스 기반 전자상거래 플랫폼 구축하기',
    difficulty: 'Hard',
  },
  {
    id: 'scenario-4',
    title: '실시간 로그 분석 시스템 구현하기',
    difficulty: 'Hard',
  },
  {
    id: 'scenario-5',
    title: 'CI/CD 파이프라인 자동화하기',
    difficulty: 'Medium',
  },
  {
    id: 'scenario-6',
    title: '데이터 백업 및 재해 복구 전략 수립하기',
    difficulty: 'Hard',
  },
  {
    id: 'scenario-7',
    title: '멀티 리전 글로벌 서비스 배포하기',
    difficulty: 'Hard',
  },
  {
    id: 'scenario-8',
    title: '비용 최적화 전략 수립 및 구현하기',
    difficulty: 'Medium',
  },
]

// 난이도별 색상
const getDifficultyColor = (difficulty: Problem['difficulty']) => {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-600'
    case 'Medium':
      return 'text-orange-600'
    case 'Hard':
      return 'text-red-600'
  }
}

interface ProblemListProps {
  readonly problems: Problem[]
}

function ProblemList({ problems }: ProblemListProps) {
  return (
    <div className="space-y-3">
      {problems.map((problem, index) => (
        <div
          key={problem.id}
          className="hover:bg-accent flex items-center justify-between rounded-lg border p-4 transition-colors hover:cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-mono text-sm">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-medium">{problem.title}</h3>
          </div>
          <span
            className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}
          >
            {problem.difficulty}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ProblemsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pt-12">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">문제 목록</h2>
        <p className="text-muted-foreground">
          다양한 AWS 클라우드 문제를 풀어보고 실습하세요
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="unit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="unit">
            Unit
            <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-semibold">
              {UNIT_PROBLEMS.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="cookbook">
            Cookbook
            <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-semibold">
              {COOKBOOK_PROBLEMS.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="scenario">
            Scenario
            <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-semibold">
              {SCENARIO_PROBLEMS.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Cookbook Tab */}
        <TabsContent value="cookbook" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Cookbook 문제</h2>
            <p className="text-muted-foreground text-sm">
              특정 작업을 수행하는 방법을 단계별로 학습하는 레시피 형태의
              문제입니다
            </p>
          </div>
          <ProblemList problems={COOKBOOK_PROBLEMS} />
        </TabsContent>

        {/* Unit Tab */}
        <TabsContent value="unit" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Unit 문제</h2>
            <p className="text-muted-foreground text-sm">
              개별 AWS 서비스의 핵심 기능을 익히는 단위 학습 문제입니다
            </p>
          </div>
          <ProblemList problems={UNIT_PROBLEMS} />
        </TabsContent>

        {/* Scenario Tab */}
        <TabsContent value="scenario" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Scenario 문제</h2>
            <p className="text-muted-foreground text-sm">
              실제 운영 환경에서 발생할 수 있는 복합적인 시나리오를 해결하는
              문제입니다
            </p>
          </div>
          <ProblemList problems={SCENARIO_PROBLEMS} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
