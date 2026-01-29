'use client'

import { ProblemLeftSection } from './components/left-section'
import { ProblemRightSection } from './components/right-section'

import { useMemo } from 'react'

import { mergeServiceDefaultValues } from '@/components/aws-services/registry/form-defaults-factory'
import type { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { ProblemFormProvider } from '@/contexts/problem-form-context'
import { FeedbackDetail } from '@/types/feedback.type'
import { GlobalSubmitConfig } from '@/types/submitConfig.types'

interface ProblemDetailClientProps {
  type: string
  unitId: string
  title: string
  description: string
  descDetail: string
  tags: string[]
  problemData: IServiceMapper[]
  initialFeedback: FeedbackDetail[]
  defaultConfigs: GlobalSubmitConfig
}

export default function ProblemDetailClient({
  type,
  unitId,
  title,
  description,
  descDetail,
  tags,
  problemData,
  initialFeedback,
  defaultConfigs,
}: ProblemDetailClientProps) {
  const defaultValues = useMemo(
    () => mergeServiceDefaultValues(problemData),
    [problemData],
  )

  return (
    <ProblemFormProvider
      defaultValues={defaultValues}
      unitId={unitId}
      problemType="unit"
      initialFeedback={initialFeedback}
      defaultConfigs={defaultConfigs}
    >
      <ProblemLeftSection
        type={type}
        title={title}
        description={description}
        descDetail={descDetail}
        tags={tags}
        problemData={problemData}
      />
      <ProblemRightSection />
    </ProblemFormProvider>
  )
}
