'use client'

import {
  CustomHeadersSection,
  OriginAccessControlSection,
  OriginDomainSection,
  OriginPathSection,
} from './sections'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { CloudFrontSubmitConfig } from '@/types/aws-services/cloudfront/cloudfront-submit-config.types'
import type { CloudFrontOriginFormData } from '@/types/aws-services/cloudfront/origin-settings/cloudfront-origin-form-data.types'
import type { CloudFrontOriginSettingsConfig } from '@/types/aws-services/cloudfront/origin-settings/constants'

const DEFAULT_VALUES: CloudFrontOriginFormData = {
  originType: 's3',
  selectedBucket: '',
  customDomain: '',
  originPath: '',
  accessControl: 'oac',
  oacName: '',
  customHeaders: [],
}

interface CloudFrontOriginSettingsProps {
  config: CloudFrontOriginSettingsConfig
  onSubmit: (data: CloudFrontSubmitConfig) => void
  buttonText?: string
}

export default function CloudFrontOriginSettings({
  config,
  onSubmit,
  buttonText = 'Origin 추가',
}: CloudFrontOriginSettingsProps) {
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<CloudFrontOriginFormData>({
      mode: 'onChange',
      defaultValues: DEFAULT_VALUES,
    })

  const selectedBucket = watch('selectedBucket') || ''
  const customDomain = watch('customDomain') || ''
  const originType = watch('originType')

  const isDisabled =
    originType === 's3'
      ? selectedBucket.length === 0
      : customDomain.length === 0

  const handleFormSubmit = handleSubmit((data) => {
    const uniqueId = crypto.randomUUID()
    const originName =
      data.originType === 's3' ? data.selectedBucket : data.customDomain
    const submitData: CloudFrontSubmitConfig = {
      _type: 'cloudFront',
      id: originName || `origin-${uniqueId}`,
      name: originName || `origin-${uniqueId}`,
      originType: data.originType,
      selectedBucket: data.selectedBucket,
      customDomain: data.customDomain,
      originPath: data.originPath,
      accessControl: data.accessControl,
      oacName: data.oacName,
      customHeaders: data.customHeaders,
    }
    onSubmit(submitData)
    reset(DEFAULT_VALUES)
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-4xl space-y-6 p-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Origin 설정</h2>
        <p className="text-muted-foreground">
          CloudFront 배포의 콘텐츠 Origin을 구성하세요
        </p>
      </div>

      <div className="flex justify-end px-6">
        <Button type="submit" disabled={isDisabled}>
          {buttonText}
        </Button>
      </div>

      {config.originDomain && (
        <>
          <OriginDomainSection
            control={control}
            config={config}
            setValue={setValue}
          />
          <Separator />
        </>
      )}

      {config.originPath && (
        <>
          <OriginPathSection control={control} config={config} />
          <Separator />
        </>
      )}

      {config.originAccessControl && (
        <OriginAccessControlSection control={control} config={config} />
      )}

      {config.customHeaders && (
        <CustomHeadersSection
          control={control}
          config={config}
          setValue={setValue}
        />
      )}
    </form>
  )
}
