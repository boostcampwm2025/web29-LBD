'use client'

import {
  AdvancedSettings,
  BlockPublicAccess,
  BucketVersioning,
  DefaultEncryption,
  GeneralConfiguration,
  ObjectOwnership,
  Tags,
} from './sections'

import { useForm } from 'react-hook-form'

import { flattenObject } from '@/components/aws-services/utils/flattenObject'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type {
  S3BucketCreateConfig,
  S3BucketFormData,
  S3SubmitConfig,
} from '@/types/aws-services/s3/bucket-create'

const DEFAULT_VALUES: S3BucketFormData = {
  general: { name: '', region: 'ap-northeast-2' },
  ownership: { aclEnabled: 'disabled' },
  blockPublicAccess: {
    blockAll: true,
    blockPublicAcls: true,
    ignorePublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
  },
  versioning: { enabled: false },
  encryption: { type: 'sse-s3' },
  advancedSettings: { objectLockEnabled: false },
  tags: [],
}

interface S3BucketCreateProps {
  config: S3BucketCreateConfig
  onSubmit: (data: S3SubmitConfig) => void
  buttonText?: string
}

export default function S3BucketCreate({
  config,
  onSubmit,
  buttonText = 'S3 버킷 추가',
}: S3BucketCreateProps) {
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<S3BucketFormData>({
      mode: 'onChange',
      defaultValues: DEFAULT_VALUES,
    })

  const bucketName = watch('general.name') || ''

  const handleFormSubmit = handleSubmit((data) => {
    const flattenedData = flattenObject(
      data as Record<string, unknown>,
    ) as S3SubmitConfig
    onSubmit(flattenedData)
    reset(DEFAULT_VALUES)
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-4xl space-y-6 p-6"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">버킷 생성</h2>
          <p className="text-muted-foreground">S3 버킷 설정을 구성하세요</p>
        </div>
      </div>
      <div className="flex justify-end px-6">
        <Button type="submit" disabled={bucketName.length === 0}>
          {buttonText}
        </Button>
      </div>
      {/* Section 1: bucket create region */}
      {config.general && (
        <>
          <GeneralConfiguration control={control} config={config} />
          <Separator />
        </>
      )}

      {/* Section 2: Object Ownership */}
      {config.ownership && (
        <>
          <ObjectOwnership control={control} config={config} />
          <Separator />
        </>
      )}

      {/* Section 3: Block Public Access */}
      {config.blockPublicAccess && (
        <>
          <BlockPublicAccess
            control={control}
            config={config}
            setValue={setValue}
          />
          <Separator />
        </>
      )}

      {/* Section 4: Bucket Versioning */}
      {config.versioning && (
        <>
          <BucketVersioning control={control} config={config} />
          <Separator />
        </>
      )}

      {/* Section 5: Tags (Optional) */}
      {config.tags && (
        <>
          <Tags control={control} config={config} />
          <Separator />
        </>
      )}

      {/* Section 6: Default Encryption */}
      {config.encryption && (
        <>
          <DefaultEncryption control={control} config={config} />
          <Separator />
        </>
      )}

      {/* Section 7: Advanced Settings */}
      {config.advancedSettings && (
        <AdvancedSettings control={control} config={config} />
      )}
    </form>
  )
}
