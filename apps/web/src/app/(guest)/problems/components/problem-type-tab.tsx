import { BookOpenIcon, FileTextIcon, LayersIcon } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ProblemTypeTab = () => {
  const problemTabList = [
    {
      type: 'unit',
      label: '유닛',
      description: '하나의 클라우드 개념을 집중적으로 학습합니다',
      icon: LayersIcon,
    },
    {
      type: 'cookbook',
      label: '쿡북',
      description:
        '여러 개의 유닛 문제를 순서대로 수행하며 하나의 목표를 달성합니다',
      icon: BookOpenIcon,
    },
    {
      type: 'scenario',
      label: '시나리오',
      description: '하나의 서비스 시나리오를 기준으로 E2E 문제를 해결합니다',
      icon: FileTextIcon,
    },
  ]

  return (
    <Tabs defaultValue="unit" className="w-full">
      <TabsList className="w-full gap-4 bg-transparent p-0">
        {problemTabList.map((tab) => (
          <TabsTrigger
            key={tab.type}
            value={tab.type}
            className="h-8 text-base"
          >
            <tab.icon className="mr-2 inline-block h-4 w-4" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {problemTabList.map((tab) => (
        <TabsContent key={tab.type} value={tab.type} className="pt-2 text-base">
          {tab.description}
        </TabsContent>
      ))}
    </Tabs>
  )
}
