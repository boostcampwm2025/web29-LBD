'use client'

import { ProblemLeftSection } from './components/left-section'
import { ProblemRightSection } from './components/right-section'

import { useMemo } from 'react'

import { mergeServiceDefaultValues } from '@/components/aws-services/registry/form-defaults-factory'
import type { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { ProblemFormProvider } from '@/contexts/problem-form-context'
import { FeedbackDetail } from '@/types/feedback.type'

interface ProblemDetailClientProps {
  type: string
  problemId: string
  title: string
  description: string
  tags: string[]
  problemData: IServiceMapper[]
  initialFeedback: FeedbackDetail[]
}

export default function ProblemDetailClient({
  type,
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
      <ProblemLeftSection
        type={type}
        title={title}
        description={description}
        tags={tags}
        problemData={problemData}
      />
      <ProblemRightSection />
    </ProblemFormProvider>
  )
}
