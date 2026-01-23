import type { CloudFrontCacheFormData } from './cloudfront-cache-form-data.types'
import type { CloudFrontCacheBehaviorConfig } from './constants'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type CloudFrontCacheBehaviorTypes = AwsServiceSectionTypes<
  CloudFrontCacheFormData,
  CloudFrontCacheBehaviorConfig
>

export type CloudFrontCacheSectionProps =
  CloudFrontCacheBehaviorTypes['SectionProps']
export type CloudFrontCacheWithSetValueSectionProps =
  CloudFrontCacheBehaviorTypes['WithSetValueProps']
