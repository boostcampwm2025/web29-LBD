'use client'

import { ProblemLeftSection } from '../../components/left-section'
import { ProblemRightSection } from '../../components/right-section'
import { UnitProblemHeader } from './components/unit-header'

import { useMemo } from 'react'

import { mergeServiceDefaultValues } from '@/components/aws-services/registry/form-defaults-factory'
import type { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { ProblemFormProvider } from '@/contexts/problem-form-context'
import { GlobalSubmitConfig } from '@/types/submitConfig.types'

interface UnitProblemClientProps {
  unitId: string
  title: string
  descDetail: string
  tags: string[]
  problemData: IServiceMapper[]
  defaultConfigs: GlobalSubmitConfig
}

export default function UnitProblemClient({
  unitId,
  title,
  descDetail,
  tags,
  problemData,
  defaultConfigs,
}: UnitProblemClientProps) {
  const defaultValues = useMemo(
    () => mergeServiceDefaultValues(problemData),
    [problemData],
  )

  return (
    <ProblemFormProvider
      defaultValues={defaultValues}
      unitId={unitId}
      problemType="unit"
      defaultConfigs={defaultConfigs}
    >
      <ProblemLeftSection problemData={problemData}>
        <UnitProblemHeader title={title} descDetail={descDetail} tags={tags} />
      </ProblemLeftSection>

      <ProblemRightSection />
    </ProblemFormProvider>
  )
}
