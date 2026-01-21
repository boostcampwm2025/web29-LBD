import type { CloudFrontWebsiteFormData } from './cloudfront-website-form-data.types'
import type { CloudFrontWebsiteSettingsConfig } from './constants'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type CloudFrontWebsiteSettingsTypes = AwsServiceSectionTypes<
  CloudFrontWebsiteFormData,
  CloudFrontWebsiteSettingsConfig
>

export type CloudFrontWebsiteSectionProps =
  CloudFrontWebsiteSettingsTypes['SectionProps']
export type CloudFrontWebsiteWithSetValueSectionProps =
  CloudFrontWebsiteSettingsTypes['WithSetValueProps']
