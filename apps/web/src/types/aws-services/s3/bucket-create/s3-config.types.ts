import type { S3BucketCreateConfig } from './constants'
import { S3BucketFormData } from './s3-form-data.types'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type S3BucketCreateTypes = AwsServiceSectionTypes<
  S3BucketFormData,
  S3BucketCreateConfig
>

export type S3SectionProps = S3BucketCreateTypes['SectionProps']
export type S3WithSetValuesSectionProps =
  S3BucketCreateTypes['WithSetValueProps']
