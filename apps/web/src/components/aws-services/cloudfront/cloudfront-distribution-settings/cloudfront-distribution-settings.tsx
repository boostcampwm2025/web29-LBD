'use client'

import {
  CnameSection,
  GeneralConfigSection,
  NetworkSection,
  PriceClassSection,
  SslTlsSection,
} from './sections'

import { Separator } from '@/components/ui/separator'
import type { CloudFrontSettingsWithSetValueSectionProps } from '@/types/aws-services/cloudfront/distribution-settings'

export default function CloudFrontDistributionSettings({
  control,
  config,
  setValue,
}: CloudFrontSettingsWithSetValueSectionProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">배포 설정</h2>
        <p className="text-muted-foreground">
          CloudFront 배포의 기본 설정을 구성하세요
        </p>
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
    </div>
  )
}
