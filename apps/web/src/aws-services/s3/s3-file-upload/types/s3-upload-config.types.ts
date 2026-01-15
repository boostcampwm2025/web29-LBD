import type { S3FileUploadConfig, S3FileUploadSectionKey } from '../constants'
import { S3UploadFormData } from './s3-upload-form-data.types'

import type { AwsServiceSectionTypes } from '@/aws-services/types/aws-general-types'

/** @deprecated Use S3FileUploadSectionKey instead */
export type S3UploadConfigKeys = S3FileUploadSectionKey

type S3FileUploadTypes = AwsServiceSectionTypes<
  S3UploadFormData,
  S3FileUploadConfig
>

export type S3UploadSectionProps = S3FileUploadTypes['SectionProps']
export type S3UploadWithSetValueSectionProps =
  S3FileUploadTypes['WithSetValueProps']
