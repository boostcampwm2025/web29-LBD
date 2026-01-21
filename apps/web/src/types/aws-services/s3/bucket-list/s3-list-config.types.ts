import type { S3BucketListConfig } from './constants'
import { S3ListFormData } from './s3-list-form-data.types'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type S3BucketListTypes = AwsServiceSectionTypes<
  S3ListFormData,
  S3BucketListConfig
>

export type S3ListSectionProps = S3BucketListTypes['SectionProps']
export type S3ListWithSetValueSectionProps =
  S3BucketListTypes['WithSetValueProps']
