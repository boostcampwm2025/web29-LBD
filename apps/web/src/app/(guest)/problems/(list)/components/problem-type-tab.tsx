'use client'

import { BadgeInfoIcon, BookOpenIcon, LayersIcon } from 'lucide-react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { problemType } from '@/types/problem.type'

export const ProblemTypeTab = () => {
  const problemTabList = [
    {
      type: problemType.UNIT,
      label: '유닛',
      description: '하나의 클라우드 개념을 집중적으로 학습합니다',
      icon: LayersIcon,
    },
    {
      type: problemType.COOKBOOK,
      label: '쿡북',
      description:
        '여러 개의 유닛 문제를 순서대로 수행하며 하나의 목표를 달성합니다',
      icon: BookOpenIcon,
    },
  ]

  const router = useRouter()

  const handleTabChange = (value: string) => {
    router.push(`/problems?type=${value}`)
  }

  const searchParams = useSearchParams()
  const type = searchParams.get('type') ?? problemType.UNIT

  return (
    <Tabs defaultValue={type} className="w-full">
      <TabsList className="w-full rounded-none bg-transparent p-0">
        {problemTabList.map((tab) => (
          <TabsTrigger
            key={tab.type}
            value={tab.type}
            className={cn(
              'h-10 rounded-none bg-transparent',
              'data-[state=active]:text-primary text-foreground/60 text-base data-[state=active]:bg-transparent',
              'data-[state=active]:border-primary border-b',
            )}
            onClick={() => handleTabChange(tab.type)}
          >
            <tab.icon className="mr-2 inline-block h-5 w-5" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {problemTabList.map((tab) => (
        <TabsContent
          key={tab.type}
          value={tab.type}
          className={cn(
            'mt-4 mb-10 flex items-center gap-2 p-4',
            'bg-primary-foreground text-primary border-primary rounded-xl text-base font-medium',
          )}
        >
          <BadgeInfoIcon />
          {tab.description}
        </TabsContent>
      ))}
    </Tabs>
  )
}
