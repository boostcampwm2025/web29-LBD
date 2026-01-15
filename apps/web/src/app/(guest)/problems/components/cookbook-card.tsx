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
import { Unit } from '@/types/problem.type'

interface CookbookCardProps extends Unit {
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-1">
          {tags?.slice(0, 5).map((tag) => (
            <Badge key={tag} variant={'secondary'} className="rounded-xl">
              <TagIcon className="h-4 w-4" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <CardDescription>{description}</CardDescription>

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
