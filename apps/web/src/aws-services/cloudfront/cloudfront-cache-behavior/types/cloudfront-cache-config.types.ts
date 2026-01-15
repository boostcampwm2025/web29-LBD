import type {
  CloudFrontCacheBehaviorConfig,
  CloudFrontCacheBehaviorSectionKey,
} from '../constants'
import type { CloudFrontCacheFormData } from './cloudfront-cache-form-data.types'

import type { AwsServiceSectionTypes } from '@/aws-services/types/aws-general-types'

/** @deprecated Use CloudFrontCacheBehaviorSectionKey instead */
export type CloudFrontCacheConfigKeys = CloudFrontCacheBehaviorSectionKey

type CloudFrontCacheBehaviorTypes = AwsServiceSectionTypes<
  CloudFrontCacheFormData,
  CloudFrontCacheBehaviorConfig
>

export type CloudFrontCacheSectionProps =
  CloudFrontCacheBehaviorTypes['SectionProps']
export type CloudFrontCacheWithSetValueSectionProps =
  CloudFrontCacheBehaviorTypes['WithSetValueProps']
