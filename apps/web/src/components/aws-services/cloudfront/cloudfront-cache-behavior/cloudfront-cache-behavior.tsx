'use client'

import type { CloudFrontCacheWithSetValueSectionProps } from '../../../../types/aws-services/cloudfront/cache-behavior'
import {
  CachePolicySection,
  CompressionSection,
  FunctionAssociationsSection,
  HttpMethodsSection,
  ViewerProtocolSection,
} from './sections'

import { Separator } from '@/components/ui/separator'

export default function CloudFrontCacheBehavior({
  control,
  config,
}: CloudFrontCacheWithSetValueSectionProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">캐시 및 동작 설정</h1>
        <p className="text-muted-foreground">
          CloudFront 캐시 정책과 뷰어 액세스 제어를 구성하세요
        </p>
      </div>

      {config.viewerProtocol && (
        <>
          <ViewerProtocolSection control={control} config={config} />
          <Separator />
        </>
      )}

      {config.httpMethods && (
        <>
          <HttpMethodsSection control={control} config={config} />
          <Separator />
        </>
      )}

      {config.cachePolicy && (
        <>
          <CachePolicySection control={control} config={config} />
          <Separator />
        </>
      )}

      {config.compression && (
        <CompressionSection control={control} config={config} />
      )}

      {config.functionAssociations && (
        <FunctionAssociationsSection control={control} config={config} />
      )}
    </div>
  )
}
