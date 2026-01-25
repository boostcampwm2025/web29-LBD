'use client'

import type { FeedbackDetail } from '../components/feedback-detail-card'
import { DiagramPanel, ProblemFormContent, ProblemHeader } from './components'
import { FeedbackPanel, SubmitButton } from './components/sticky'

import { useMemo } from 'react'

import { mergeServiceDefaultValues } from '@/components/aws-services/registry/form-defaults-factory'
import type { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { ProblemFormProvider } from '@/contexts/problem-form-context'
import type { DiagramData } from '@/types/diagram'

interface ProblemDetailClientProps {
  problemId: string
  title: string
  description: string
  tags: string[]
  problemData: IServiceMapper[]
  diagramData: DiagramData
  initialFeedback: FeedbackDetail[]
}

export default function ProblemDetailClient({
  problemId,
  title,
  description,
  tags,
  problemData,
  diagramData,
  initialFeedback,
}: ProblemDetailClientProps) {
  const defaultValues = useMemo(
    () => mergeServiceDefaultValues(problemData),
    [problemData],
  )

  return (
    <ProblemFormProvider
      defaultValues={defaultValues}
      problemId={problemId}
      initialFeedback={initialFeedback}
    >
      <div className="grid grid-cols-[1fr,400px] gap-6">
        {/* 왼쪽: 스크롤 영역 */}
        <div className="space-y-6 overflow-y-auto">
          <ProblemHeader title={title} description={description} tags={tags} />
          <ProblemFormContent problemData={problemData} />
        </div>

        {/* 오른쪽: 스티키 영역 */}
        <div className="relative h-full">
          <div className="sticky top-24 space-y-4">
            <SubmitButton />
            <DiagramPanel diagramData={diagramData} />
            <FeedbackPanel />
          </div>
        </div>
      </div>
    </ProblemFormProvider>
  )
}
