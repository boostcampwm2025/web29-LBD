import type {
  S3BucketCreateConfig,
  S3BucketCreateSectionKey,
} from '../constants'
import { S3BucketFormData } from './s3-form-data.types'

import type { AwsServiceSectionTypes } from '@/aws-services/types/aws-general-types'

/** @deprecated Use S3BucketCreateSectionKey instead */
export type S3ConfigKeys = S3BucketCreateSectionKey

type S3BucketCreateTypes = AwsServiceSectionTypes<
  S3BucketFormData,
  S3BucketCreateConfig
>

export type S3SectionProps = S3BucketCreateTypes['SectionProps']
export type S3WithSetValuesSectionProps =
  S3BucketCreateTypes['WithSetValueProps']
