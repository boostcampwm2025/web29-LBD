import type { S3BucketListConfig, S3BucketListSectionKey } from '../constants'
import { S3ListFormData } from './s3-list-form-data.types'

import type { AwsServiceSectionTypes } from '@/aws-services/types/aws-general-types'

/** @deprecated Use S3BucketListSectionKey instead */
export type S3ListConfigKeys = S3BucketListSectionKey

type S3BucketListTypes = AwsServiceSectionTypes<
  S3ListFormData,
  S3BucketListConfig
>

export type S3ListSectionProps = S3BucketListTypes['SectionProps']
export type S3ListWithSetValueSectionProps =
  S3BucketListTypes['WithSetValueProps']
