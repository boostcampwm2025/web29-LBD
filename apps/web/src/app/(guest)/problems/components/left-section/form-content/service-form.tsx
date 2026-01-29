'use client'

import { CreatedResourceList } from './resource-list'

import {
  type IServiceMapper,
  serviceMapper,
} from '@/components/aws-services/utils/serviceMapper'
import { useProblemForm } from '@/contexts/problem-form-context'
import { cn } from '@/lib/utils'
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
  const { handleAddItem, handleRemoveItem, submitConfig } = useProblemForm()

  const mapper = problemData.find((m) => m.serviceName === currentService)

  if (!mapper) return null

  const { Component, config } = serviceMapper(mapper)
  const serviceType = getServiceType(mapper.serviceName)
  const createdItems = submitConfig[serviceType] || []

  return (
    <div
      className={cn(
        'border',
        problemData.length > 1 ? 'rounded-b-lg border-t-0' : 'rounded-lg',
      )}
    >
      <Component
        config={config}
        onSubmit={(data: ServiceConfig) => handleAddItem(serviceType, data)}
      />

      <CreatedResourceList
        items={createdItems}
        onRollback={(id) => handleRemoveItem(serviceType, id)}
      />
    </div>
  )
}
