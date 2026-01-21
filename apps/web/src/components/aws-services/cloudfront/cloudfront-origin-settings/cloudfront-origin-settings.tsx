'use client'

import {
  CustomHeadersSection,
  OriginAccessControlSection,
  OriginDomainSection,
  OriginPathSection,
} from './sections'

import { Separator } from '@/components/ui/separator'
import type { CloudFrontOriginWithSetValueSectionProps } from '@/types/aws-services/cloudfront/origin-settings'

export default function CloudFrontOriginSettings({
  control,
  config,
  setValue,
}: CloudFrontOriginWithSetValueSectionProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Origin 설정</h2>
        <p className="text-muted-foreground">
          CloudFront 배포의 콘텐츠 Origin을 구성하세요
        </p>
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
    </div>
  )
}
