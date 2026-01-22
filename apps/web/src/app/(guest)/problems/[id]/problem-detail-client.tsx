'use client'

import { useForm } from 'react-hook-form'

import {
  IServiceMapper,
  serviceMapper,
} from '@/components/aws-services/utils/serviceMapper'

interface ProblemDetailClientProps {
  problemData: IServiceMapper[]
}

export default function ProblemDetailClient({
  problemData,
}: ProblemDetailClientProps) {
  const { control, setValue } = useForm()

  return (
    <>
      {problemData.map((mapper, index) => {
        const { Component, config } = serviceMapper(mapper)
        return (
          <Component
            key={index}
            control={control}
            config={config}
            setValue={setValue}
          />
        )
      })}
    </>
  )
}
