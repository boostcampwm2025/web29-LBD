'use client'

import {
  CnameSection,
  GeneralConfigSection,
  NetworkSection,
  PriceClassSection,
  SslTlsSection,
} from './sections'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { CloudFrontSubmitConfig } from '@/types/aws-services/cloudfront/cloudfront-submit-config.types'
import type { CloudFrontDistributionSettingsFormData } from '@/types/aws-services/cloudfront/distribution-settings/cloudfront-settings-form-data.types'
import type { CloudFrontDistributionSettingsConfig } from '@/types/aws-services/cloudfront/distribution-settings/constants'

const DEFAULT_VALUES: CloudFrontDistributionSettingsFormData = {
  distributionName: '',
  description: '',
  enabled: true,
  priceClass: 'all',
  cnames: [],
  sslCertificate: 'cloudfront',
  acmCertificateArn: '',
  minTlsVersion: 'TLSv1.2_2021',
  ipv6Enabled: true,
}

interface CloudFrontDistributionSettingsProps {
  config: CloudFrontDistributionSettingsConfig
  onSubmit: (data: CloudFrontSubmitConfig) => void
  buttonText?: string
}

export default function CloudFrontDistributionSettings({
  config,
  onSubmit,
  buttonText = 'CloudFront 배포 추가',
}: CloudFrontDistributionSettingsProps) {
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<CloudFrontDistributionSettingsFormData>({
      mode: 'onChange',
      defaultValues: DEFAULT_VALUES,
    })

  const distributionName = watch('distributionName') || ''

  const handleFormSubmit = handleSubmit((data) => {
    const uniqueId = crypto.randomUUID()
    const submitData: CloudFrontSubmitConfig = {
      _type: 'cloudFront',
      id: data.distributionName || `cloudfront-${uniqueId}`,
      name: data.distributionName || `cloudfront-${uniqueId}`,
      distributionName: data.distributionName,
      description: data.description,
      enabled: data.enabled,
      priceClass: data.priceClass,
      cnames: data.cnames,
      sslCertificate: data.sslCertificate,
      acmCertificateArn: data.acmCertificateArn,
      minTlsVersion: data.minTlsVersion,
      ipv6Enabled: data.ipv6Enabled,
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
        <h2 className="text-3xl font-bold">배포 설정</h2>
        <p className="text-muted-foreground">
          CloudFront 배포의 기본 설정을 구성하세요
        </p>
      </div>

      <div className="flex justify-end px-6">
        <Button type="submit" disabled={distributionName.length === 0}>
          {buttonText}
        </Button>
      </div>

      {config.generalConfig && (
        <>
          <GeneralConfigSection control={control} config={config} />
          <Separator />
        </>
      )}

      {config.priceClass && (
        <>
          <PriceClassSection control={control} config={config} />
          <Separator />
        </>
      )}

      {config.cname && (
        <CnameSection control={control} config={config} setValue={setValue} />
      )}

      {config.sslTls && <SslTlsSection control={control} config={config} />}

      {config.network && (
        <>
          <Separator />
          <NetworkSection control={control} config={config} />
        </>
      )}
    </form>
  )
}
