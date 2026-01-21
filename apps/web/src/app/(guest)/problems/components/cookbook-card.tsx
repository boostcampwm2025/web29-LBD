'use client'

import { ProblemTagBadge } from './problem-tag-badge'
import { PlayIcon } from 'lucide-react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UnitProblem } from '@/types/problem.type'

interface CookbookCardProps extends UnitProblem {
  children: React.ReactNode
}

export const CookbookCard = ({
  id,
  title,
  description,
  tags,
  children,
}: CookbookCardProps) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/problems/${id}`)
  }

  return (
    <Card className="duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-1">
          {tags?.slice(0, 5).map((tag) => (
            <ProblemTagBadge key={tag} tag={tag} />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <CardDescription className="text-base">{description}</CardDescription>

        <div className="grid grid-cols-3 gap-4">{children}</div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full font-semibold"
          variant={'outline'}
          onClick={handleCardClick}
        >
          <PlayIcon className="mr-1" />
          문제 풀기
        </Button>
      </CardFooter>
    </Card>
  )
}
