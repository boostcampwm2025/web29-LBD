'use client'

import { ProblemFormContent, ProblemHeader } from './components/left-section'
import {
  DiagramPanel,
  FeedbackPanel,
  SubmitButton,
} from './components/right-section'

import { useMemo } from 'react'

import { mergeServiceDefaultValues } from '@/components/aws-services/registry/form-defaults-factory'
import type { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { ProblemFormProvider } from '@/contexts/problem-form-context'
import { FeedbackDetail } from '@/types/feedback.type'

interface ProblemDetailClientProps {
  problemId: string
  title: string
  description: string
  tags: string[]
  problemData: IServiceMapper[]
  initialFeedback: FeedbackDetail[]
}

export default function ProblemDetailClient({
  problemId,
  title,
  description,
  tags,
  problemData,
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
        <section className="space-y-6 overflow-y-auto">
          <ProblemHeader title={title} description={description} tags={tags} />
          <ProblemFormContent problemData={problemData} />
        </section>

        <section className="relative h-full">
          <div className="w-full overflow-y-auto">
            <SubmitButton />
            <DiagramPanel />
            <FeedbackPanel />
          </div>
        </section>
      </div>
    </ProblemFormProvider>
  )
}
