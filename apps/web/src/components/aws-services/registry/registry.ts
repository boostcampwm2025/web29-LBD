import CloudFrontCacheBehavior from '../cloudfront/cloudfront-cache-behavior/cloudfront-cache-behavior'
import { CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS } from '../cloudfront/cloudfront-cache-behavior/constants'
import CloudFrontDistributionList from '../cloudfront/cloudfront-distribution-list/cloudfront-distribution-list'
import { CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS } from '../cloudfront/cloudfront-distribution-list/constants'
import CloudFrontDistributionSettings from '../cloudfront/cloudfront-distribution-settings/cloudfront-distribution-settings'
import { CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS } from '../cloudfront/cloudfront-distribution-settings/constants'
import CloudFrontOriginSettings from '../cloudfront/cloudfront-origin-settings/cloudfront-origin-settings'
import { CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS } from '../cloudfront/cloudfront-origin-settings/constants'
import CloudFrontWebsiteSettings from '../cloudfront/cloudfront-website-settings/cloudfront-website-settings'
import { CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS } from '../cloudfront/cloudfront-website-settings/constants'
import S3BucketCreate from '../s3/s3-bucket-create/s3-bucket-create'
import S3BucketDetail from '../s3/s3-bucket-detail/s3-bucket-detail'
import { S3_BUCKET_LIST_SECTIONS } from '../s3/s3-bucket-list/constants'
import S3BucketList from '../s3/s3-bucket-list/s3-bucket-list'
import { S3_FILE_UPLOAD_SECTIONS } from '../s3/s3-file-upload/constants'
import S3FileUpload from '../s3/s3-file-upload/s3-file-upload'

import { ComponentType } from 'react'

import { S3_BUCKET_CREATE_SECTIONS } from '@/types/aws-services/s3/bucket-create/'
import { S3_BUCKET_DETAIL_SECTIONS } from '@/types/aws-services/s3/bucket-detail/'

export interface ServicePage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
  sections: readonly string[]
}

const S3: Record<string, ServicePage> = {
  'bucket-create': {
    component: S3BucketCreate,
    sections: S3_BUCKET_CREATE_SECTIONS,
  },
  'bucket-list': {
    component: S3BucketList,
    sections: S3_BUCKET_LIST_SECTIONS,
  },
  'bucket-detail': {
    component: S3BucketDetail,
    sections: S3_BUCKET_DETAIL_SECTIONS,
  },
  'file-upload': {
    component: S3FileUpload,
    sections: S3_FILE_UPLOAD_SECTIONS,
  },
}

const CloudFront: Record<string, ServicePage> = {
  'distribution-list': {
    component: CloudFrontDistributionList,
    sections: CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS,
  },
  'origin-settings': {
    component: CloudFrontOriginSettings,
    sections: CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS,
  },
  'distribution-settings': {
    component: CloudFrontDistributionSettings,
    sections: CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS,
  },
  'cache-behavior': {
    component: CloudFrontCacheBehavior,
    sections: CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS,
  },
  'website-settings': {
    component: CloudFrontWebsiteSettings,
    sections: CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS,
  },
}

export const AWS_SERVICE_REGISTRY = {
  S3,
  CloudFront,
}
