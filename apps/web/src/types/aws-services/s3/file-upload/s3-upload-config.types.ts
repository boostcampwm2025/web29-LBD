import type { S3FileUploadConfig } from './constants'
import { S3UploadFormData } from './s3-upload-form-data.types'

import type { AwsServiceSectionTypes } from '@/types/aws-services/aws-general-types'

type S3FileUploadTypes = AwsServiceSectionTypes<
  S3UploadFormData,
  S3FileUploadConfig
>

export type S3UploadSectionProps = S3FileUploadTypes['SectionProps']
export type S3UploadWithSetValueSectionProps =
  S3FileUploadTypes['WithSetValueProps']
