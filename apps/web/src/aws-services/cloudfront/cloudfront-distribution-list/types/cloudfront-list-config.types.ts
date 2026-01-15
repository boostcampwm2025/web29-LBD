import type {
  CloudFrontDistributionListConfig,
  CloudFrontDistributionListSectionKey,
} from '../constants'
import type { CloudFrontListFormData } from './cloudfront-list-form-data.types'

import type { AwsServiceSectionTypes } from '@/aws-services/types/aws-general-types'

/** @deprecated Use CloudFrontDistributionListSectionKey instead */
export type CloudFrontListConfigKeys = CloudFrontDistributionListSectionKey

type CloudFrontDistributionListTypes = AwsServiceSectionTypes<
  CloudFrontListFormData,
  CloudFrontDistributionListConfig
>

export type CloudFrontListSectionProps =
  CloudFrontDistributionListTypes['SectionProps']
export type CloudFrontListWithSetValueSectionProps =
  CloudFrontDistributionListTypes['WithSetValueProps']
