import type {
  S3BucketDetailConfig,
  S3BucketDetailSectionKey,
} from '../constants'
import { S3DetailFormData } from './s3-detail-form-data.types'

import type { AwsServiceSectionTypes } from '@/aws-services/types/aws-general-types'

/** @deprecated Use S3BucketDetailSectionKey instead */
export type S3DetailConfigKeys = S3BucketDetailSectionKey

type S3BucketDetailTypes = AwsServiceSectionTypes<
  S3DetailFormData,
  S3BucketDetailConfig
>

export type S3DetailSectionProps = S3BucketDetailTypes['SectionProps']
export type S3DetailWithSetValueSectionProps =
  S3BucketDetailTypes['WithSetValueProps']
