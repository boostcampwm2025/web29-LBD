import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { problems } from '../lib/problems'
import { Award, Play } from 'lucide-react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Category } from '@/types/problems/problem'

const Problems = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category>('all')

  const filteredProblems = problems.filter(
    (p) => category === 'all' || p.category === category,
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="mb-2">문제</h2>
        <p className="text-muted-foreground">
          AWS 클라우드 인프라를 직접 설정하며 학습하세요
        </p>
      </div>

      <Tabs
        value={category}
        onValueChange={(v) => setCategory(v as Category)}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="step">단계</TabsTrigger>
          <TabsTrigger value="scenario">시나리오</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <Card
            key={problem.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => navigate(`/problems/problem`)}
          >
            <CardHeader>
              <div className="mb-2 flex items-start justify-between">
                <CardTitle className="flex-1">{problem.title}</CardTitle>
                {problem.level && (
                  <div className="text-primary flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Lv.{problem.level}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs`}>
                  난이도 표시 예정
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-2">
                {problem.description}
              </CardDescription>
              <Button className="w-full" variant="outline">
                <Play className="mr-2 h-4 w-4" />
                문제 풀기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Problems
