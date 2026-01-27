'use client'

import { CheckCircle2, RotateCcw } from 'lucide-react'

import { createServiceKey } from '@/components/aws-services/registry/form-defaults-factory'
import {
  type IServiceMapper,
  serviceMapper,
} from '@/components/aws-services/utils/serviceMapper'
import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'
import type { ServiceConfig, ServiceType } from '@/types/submitConfig.types'

interface ProblemFormContentProps {
  problemData: IServiceMapper[]
}

function getServiceType(serviceName: string): ServiceType {
  const serviceTypeMap: Record<string, ServiceType> = {
    s3: 's3',
    cloudFront: 'cloudFront',
    ec2: 'ec2',
  }
  return serviceTypeMap[serviceName] || 's3'
}

export function ProblemFormContent({ problemData }: ProblemFormContentProps) {
  const { handleAddItem, submitConfig, handleRemoveItem } = useProblemForm()

  return (
    <>
      {problemData.map((mapper, index) => {
        const { Component, config } = serviceMapper(mapper)
        const formKey = createServiceKey(mapper.serviceName, mapper.serviceTask)
        const serviceType = getServiceType(mapper.serviceName)
        const createdItems = submitConfig[serviceType] || []

        return (
          <div key={`${formKey}-${index}`} className="space-y-6 border">
            <Component
              config={config}
              onSubmit={(data: ServiceConfig) =>
                handleAddItem(serviceType, data)
              }
            />

            {/* 생성된 리소스 목록 */}
            {createdItems.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 mx-auto max-w-4xl border-t p-6 pt-4 duration-300">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    생성 완료된 리소스 ({createdItems.length})
                  </h4>
                </div>

                <div className="grid gap-3">
                  {createdItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {item.data.name || '이름 없음'}
                        </span>
                        <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                          ID: {item.id.slice(0, 8)}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-8"
                        onClick={() => handleRemoveItem(serviceType, item.id)}
                      >
                        <RotateCcw className="mr-1.5 h-3 w-3" />
                        롤백
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
