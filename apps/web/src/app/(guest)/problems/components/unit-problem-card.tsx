'use client'

import { PlayIcon, TagIcon } from 'lucide-react'

import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
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

export const UnitProblemCard = ({
  id,
  title,
  description,
  tags,
}: UnitProblem) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/problems/${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant={'secondary'} className="rounded-xl">
              <TagIcon className="h-4 w-4" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full font-semibold"
          variant={'ghost'}
          onClick={handleCardClick}
        >
          <PlayIcon className="mr-1" />
          문제 풀기
        </Button>
      </CardFooter>
    </Card>
  )
}
