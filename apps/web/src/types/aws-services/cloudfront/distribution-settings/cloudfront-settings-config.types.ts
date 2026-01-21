import type { CloudFrontDistributionSettingsFormData } from './cloudfront-settings-form-data.types'
import type { CloudFrontDistributionSettingsConfig } from './constants'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type CloudFrontDistributionSettingsTypes = AwsServiceSectionTypes<
  CloudFrontDistributionSettingsFormData,
  CloudFrontDistributionSettingsConfig
>

export type CloudFrontSettingsSectionProps =
  CloudFrontDistributionSettingsTypes['SectionProps']
export type CloudFrontSettingsWithSetValueSectionProps =
  CloudFrontDistributionSettingsTypes['WithSetValueProps']
