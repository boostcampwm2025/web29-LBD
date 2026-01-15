'use client'

import {
  CustomErrorPagesSection,
  DefaultRootObjectSection,
  LoggingSection,
  ReviewSummarySection,
  WafSection,
} from './sections'
import type { CloudFrontWebsiteWithSetValueSectionProps } from './types'

import { Separator } from '@/components/ui/separator'

export default function CloudFrontWebsiteSettings({
  control,
  config,
  setValue,
}: CloudFrontWebsiteWithSetValueSectionProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">일반 설정 편집</h2>
        <p className="text-muted-foreground">
          Default Root Object 및 기타 웹사이트 설정을 구성하세요
        </p>
      </div>

      {config.defaultRootObject && (
        <>
          <DefaultRootObjectSection control={control} config={config} />
          <Separator />
        </>
      )}

      {config.customErrorPages && (
        <CustomErrorPagesSection
          control={control}
          config={config}
          setValue={setValue}
        />
      )}

      {config.logging && <LoggingSection control={control} config={config} />}

      {config.waf && <WafSection control={control} config={config} />}

      {config.reviewSummary && (
        <>
          <Separator />
          <ReviewSummarySection control={control} config={config} />
        </>
      )}
    </div>
  )
}
