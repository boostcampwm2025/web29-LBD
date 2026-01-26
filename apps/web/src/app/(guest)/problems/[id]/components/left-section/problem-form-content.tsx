'use client'

import type { FieldValues } from 'react-hook-form'

import { createServiceKey } from '@/components/aws-services/registry/form-defaults-factory'
import {
  type IServiceMapper,
  serviceMapper,
} from '@/components/aws-services/utils/serviceMapper'
import { useProblemForm } from '@/contexts/problem-form-context'

interface ProblemFormContentProps {
  problemData: IServiceMapper[]
}

export function ProblemFormContent({ problemData }: ProblemFormContentProps) {
  const { form } = useProblemForm<FieldValues>()
  const { control, setValue } = form

  return (
    <>
      {problemData.map((mapper, index) => {
        const { Component, config } = serviceMapper(mapper)
        const formKey = createServiceKey(mapper.serviceName, mapper.serviceTask)

        return (
          <Component
            key={`${formKey}-${index}`}
            control={control}
            config={config}
            setValue={setValue}
            formKey={formKey}
          />
        )
      })}
    </>
  )
}
