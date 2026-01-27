'use client'

import {
  CachePolicySection,
  CompressionSection,
  FunctionAssociationsSection,
  HttpMethodsSection,
  ViewerProtocolSection,
} from './sections'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { CloudFrontCacheFormData } from '@/types/aws-services/cloudfront/cache-behavior/cloudfront-cache-form-data.types'
import type { CloudFrontCacheBehaviorConfig } from '@/types/aws-services/cloudfront/cache-behavior/constants'
import type { CloudFrontSubmitConfig } from '@/types/aws-services/cloudfront/cloudfront-submit-config.types'

const DEFAULT_VALUES: CloudFrontCacheFormData = {
  viewerProtocolPolicy: 'redirect-to-https',
  allowedMethods: 'GET_HEAD',
  cachePolicy: 'managed',
  managedPolicyName: 'CachingOptimized',
  customTTL: { min: '0', default: '86400', max: '31536000' },
  compressionEnabled: true,
  viewerRequestFunction: '',
  viewerResponseFunction: '',
}

interface CloudFrontCacheBehaviorProps {
  config: CloudFrontCacheBehaviorConfig
  onSubmit: (data: CloudFrontSubmitConfig) => void
  buttonText?: string
}

export default function CloudFrontCacheBehavior({
  config,
  onSubmit,
  buttonText = '캐시 동작 추가',
}: CloudFrontCacheBehaviorProps) {
  const { control, handleSubmit, reset } = useForm<CloudFrontCacheFormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const handleFormSubmit = handleSubmit((data) => {
    const uniqueId = crypto.randomUUID()
    const submitData: CloudFrontSubmitConfig = {
      _type: 'cloudFront',
      id: `cache-behavior-${uniqueId}`,
      name: `cache-behavior-${uniqueId}`,
      viewerProtocolPolicy: data.viewerProtocolPolicy,
      allowedMethods: data.allowedMethods,
      cachePolicy: data.cachePolicy,
      managedPolicyName: data.managedPolicyName,
      customTTL: data.customTTL,
      compressionEnabled: data.compressionEnabled,
      viewerRequestFunction: data.viewerRequestFunction,
      viewerResponseFunction: data.viewerResponseFunction,
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
        <h1 className="text-3xl font-bold">캐시 및 동작 설정</h1>
        <p className="text-muted-foreground">
          CloudFront 캐시 정책과 뷰어 액세스 제어를 구성하세요
        </p>
      </div>

      <div className="flex justify-end px-6">
        <Button type="submit">{buttonText}</Button>
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
    </form>
  )
}
