'use client'

import { ProblemLeftSection } from '../../components/left-section'
import { ProblemRightSection } from '../../components/right-section'
import { CookbookProblemHeader } from './components/cookbook-header'

import { useEffect, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { mergeServiceDefaultValues } from '@/components/aws-services/registry/form-defaults-factory'
import type { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { ProblemFormProvider } from '@/contexts/problem-form-context'
import { FeedbackDetail } from '@/types/feedback.type'
import { GlobalSubmitConfig } from '@/types/submitConfig.types'

interface CookbookProblemClientProps {
  unitId: string
  cookbookId: string
  title: string
  description: string
  tags: string[]
  problemData: IServiceMapper[]
  initialFeedback: FeedbackDetail[]
  defaultConfigs: GlobalSubmitConfig
  units: { id: string; title: string }[]
  nextUnitId?: string
}

export default function CookbookProblemClient({
  unitId,
  cookbookId,
  title,
  description,
  tags,
  problemData,
  initialFeedback,
  defaultConfigs,
  units,
  nextUnitId,
}: CookbookProblemClientProps) {
  const defaultValues = useMemo(
    () => mergeServiceDefaultValues(problemData),
    [problemData],
  )

  const router = useRouter()
  useEffect(() => {
    router.push(`/problems/cookbook/${cookbookId}?unitId=${unitId}`)
  }, [])

  return (
    <ProblemFormProvider
      defaultValues={defaultValues}
      unitId={unitId}
      cookbookId={cookbookId}
      problemType="cookbook"
      nextUnitId={nextUnitId}
      initialFeedback={initialFeedback}
      defaultConfigs={defaultConfigs}
    >
      <ProblemLeftSection problemData={problemData}>
        <CookbookProblemHeader
          title={title}
          description={description}
          tags={tags}
          units={units}
          currUnitId={unitId}
        />
      </ProblemLeftSection>

      <ProblemRightSection />
    </ProblemFormProvider>
  )
}
