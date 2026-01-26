'use client'

import S3BucketCreate from '../s3/s3-bucket-create/s3-bucket-create'
import { flattenObject } from '../utils/flattenObject'

import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'
import type {
  S3BucketCreateConfig,
  S3BucketFormData,
} from '@/types/aws-services/s3/bucket-create'
import type { S3SubmitConfig } from '@/types/aws-services/s3/bucket-create'

interface S3BucketCreateAdapterProps {
  config: S3BucketCreateConfig
}

// S3 버킷 생성 폼 기본값
const DEFAULT_VALUES: S3BucketFormData = {
  general: {
    name: '',
    region: 'us-east-1',
  },
  ownership: {
    aclEnabled: 'disabled',
  },
  blockPublicAccess: {
    blockAll: true,
    blockPublicAcls: true,
    ignorePublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
  },
  versioning: {
    versioningEnabled: false,
  },
  encryption: {
    type: 'sse-s3',
  },
  advancedSettings: {
    objectLockEnabled: false,
  },
  tags: [],
}

export function S3BucketCreateAdapter({ config }: S3BucketCreateAdapterProps) {
  const { handleAddItem, submitConfig, handleRemoveItem } = useProblemForm()

  // 로컬 폼 (리소스 생성용) - 리셋 가능
  const localForm = useForm<S3BucketFormData>({
    defaultValues: DEFAULT_VALUES,
  })

  // useWatch를 사용하여 버킷 이름 감시
  const bucketName = useWatch({
    control: localForm.control,
    name: 'general.name',
  })

  const onSubmit = (data: S3BucketFormData) => {
    // 폼 데이터를 플랫하게 변환
    const flattenedData = flattenObject(
      data as unknown as Record<string, unknown>,
    ) as S3SubmitConfig

    // name 필드 추가
    flattenedData.name = data.general?.name || ''
    flattenedData.region = data.general?.region || ''

    handleAddItem('s3', flattenedData)
    localForm.reset() // 다음 리소스 생성 준비
  }

  const createdItems = submitConfig.s3 || []

  return (
    <div className="space-y-6">
      <S3BucketCreate
        control={localForm.control}
        config={config}
        setValue={localForm.setValue}
      />

      {/* 추가 버튼 */}
      <div className="flex justify-end px-6">
        <Button
          type="button"
          onClick={localForm.handleSubmit(onSubmit)}
          disabled={!bucketName}
        >
          S3 버킷 추가
        </Button>
      </div>

      {/* 생성된 리소스 목록 */}
      {createdItems.length > 0 && (
        <div className="mx-auto max-w-4xl space-y-4 px-6">
          <h3 className="text-lg font-semibold">
            생성된 S3 버킷 ({createdItems.length}개)
          </h3>
          <div className="space-y-2">
            {createdItems.map((item) => (
              <div
                key={item.id}
                className="bg-muted/50 flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{item.data.name}</p>
                  <p className="text-muted-foreground text-sm">
                    리전: {item.data.region}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem('s3', item.id)}
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
