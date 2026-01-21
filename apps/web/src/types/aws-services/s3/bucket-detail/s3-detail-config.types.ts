import type { S3BucketDetailConfig } from './constants'
import { S3DetailFormData } from './s3-detail-form-data.types'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type S3BucketDetailTypes = AwsServiceSectionTypes<
  S3DetailFormData,
  S3BucketDetailConfig
>

export type S3DetailSectionProps = S3BucketDetailTypes['SectionProps']
export type S3DetailWithSetValueSectionProps =
  S3BucketDetailTypes['WithSetValueProps']
