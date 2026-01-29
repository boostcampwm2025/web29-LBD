'use client'

import {
  type IServiceMapper,
  serviceMapper,
} from '@/components/aws-services/utils/serviceMapper'
import { useProblemForm } from '@/contexts/problem-form-context'
import type { ServiceConfig, ServiceType } from '@/types/submitConfig.types'

const getServiceType = (serviceName: string): ServiceType => {
  const serviceTypeMap: Record<string, ServiceType> = {
    s3: 's3',
    cloudFront: 'cloudFront',
    ec2: 'ec2',
  }
  return serviceTypeMap[serviceName] || 's3'
}

export const ServiceForm = ({
  problemData,
  currentService,
}: {
  problemData: IServiceMapper[]
  currentService: IServiceMapper['serviceName']
}) => {
  const { handleAddItem } = useProblemForm()

  const mapper = problemData.find((m) => m.serviceName === currentService)

  if (!mapper) return null

  const { Component, config } = serviceMapper(mapper)
  const serviceType = getServiceType(mapper.serviceName)

  return (
    <div className="rounded-lg border">
      <Component
        config={config}
        onSubmit={(data: ServiceConfig) => handleAddItem(serviceType, data)}
      />
    </div>
  )
}
