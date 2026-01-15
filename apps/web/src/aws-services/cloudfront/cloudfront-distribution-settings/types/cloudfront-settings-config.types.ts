import type {
  CloudFrontDistributionSettingsConfig,
  CloudFrontDistributionSettingsSectionKey,
} from '../constants'
import type { CloudFrontDistributionSettingsFormData } from './cloudfront-settings-form-data.types'

import type { AwsServiceSectionTypes } from '@/aws-services/types/aws-general-types'

/** @deprecated Use CloudFrontDistributionSettingsSectionKey instead */
export type CloudFrontSettingsConfigKeys =
  CloudFrontDistributionSettingsSectionKey

type CloudFrontDistributionSettingsTypes = AwsServiceSectionTypes<
  CloudFrontDistributionSettingsFormData,
  CloudFrontDistributionSettingsConfig
>

export type CloudFrontSettingsSectionProps =
  CloudFrontDistributionSettingsTypes['SectionProps']
export type CloudFrontSettingsWithSetValueSectionProps =
  CloudFrontDistributionSettingsTypes['WithSetValueProps']
