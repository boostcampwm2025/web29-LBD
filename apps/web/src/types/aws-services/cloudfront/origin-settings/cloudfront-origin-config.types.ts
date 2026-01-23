import type { CloudFrontOriginFormData } from './cloudfront-origin-form-data.types'
import type { CloudFrontOriginSettingsConfig } from './constants'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type CloudFrontOriginSettingsTypes = AwsServiceSectionTypes<
  CloudFrontOriginFormData,
  CloudFrontOriginSettingsConfig
>

export type CloudFrontOriginSectionProps =
  CloudFrontOriginSettingsTypes['SectionProps']
export type CloudFrontOriginWithSetValueSectionProps =
  CloudFrontOriginSettingsTypes['WithSetValueProps']
