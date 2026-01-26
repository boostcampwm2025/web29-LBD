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

import type { Control, UseFormSetValue } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type {
  S3BucketCreateConfig,
  S3BucketFormData,
} from '@/types/aws-services/s3/bucket-create'

interface S3BucketCreateProps {
  config: S3BucketCreateConfig
  control: Control<S3BucketFormData>
  setValue: UseFormSetValue<S3BucketFormData>
}

export default function S3BucketCreate({
  config,
  control,
  setValue,
}: S3BucketCreateProps) {
  return (
    <form className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">버킷 생성</h2>
          <p className="text-muted-foreground">S3 버킷 설정을 구성하세요</p>
        </div>

        <Button type="submit" size="lg">
          변경사항 적용
        </Button>
      </div>
      {/* Section 1: General Configuration */}
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
