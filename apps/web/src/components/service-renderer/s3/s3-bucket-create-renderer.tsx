'use client'

import { FormData } from '../types'
import { CheckCircle2, RotateCcw, X } from 'lucide-react'

import { SubmitHandler, useForm } from 'react-hook-form'

import S3BucketCreate from '@/components/aws-services/s3/s3-bucket-create/s3-bucket-create'
import { flattenObject } from '@/components/aws-services/utils/flattenObject'
import { Button } from '@/components/ui/button'
import type { S3BucketFormData } from '@/types/aws-services/s3/bucket-create'
import {
  ServiceConfig,
  ServiceConfigItem,
  ServiceType,
} from '@/types/submitConfig.types'

interface RendererProps {
  config: Record<string, boolean>
  onAdd: (type: ServiceType, data: ServiceConfig) => void
  createdItems: ServiceConfigItem<ServiceConfig>[]
  onRemove: (id: string) => void
}

const defaultValues: S3BucketFormData = {
  general: { name: '', region: 'ap-northeast-2' },
  ownership: { aclEnabled: 'disabled' },
  blockPublicAccess: {
    blockAll: true,
    blockPublicAcls: true,
    ignorePublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
  },
  // versioning: { versioningEnabled: false },
  // encryption: { type: 'sse-s3' },
  // advancedSettings: { objectLockEnabled: false },
  // tags: [],
}

export function S3BucketCreateRenderer({
  config,
  onAdd,
  createdItems,
  onRemove,
}: RendererProps) {
  const { control, handleSubmit, setValue, reset } = useForm<S3BucketFormData>({
    mode: 'onChange',
    defaultValues: defaultValues,
  })

  const onSubmit: SubmitHandler<S3BucketFormData> = (data) => {
    const flattendData = flattenObject(data as Record<string, unknown>)
    onAdd('s3', flattendData)
    reset(defaultValues)
  }

  return (
    <div className="space-y-6">
      {/* 1. 입력 폼 영역 */}
      <div>
        <S3BucketCreate
          control={control}
          config={config}
          setValue={setValue}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>

      {/* 2. 생성된 리소스 목록 */}
      {/* 생성된 리소스를 다시 되돌리고 싶을 때...! */}
      {createdItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 border-t pt-4 duration-300">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              생성 완료된 버킷 ({createdItems.length})
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
                  onClick={() => onRemove(item.id)}
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
}
