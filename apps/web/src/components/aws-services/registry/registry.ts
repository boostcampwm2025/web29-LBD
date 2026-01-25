import { ComponentType } from 'react'

import CloudFrontCacheBehavior from '@/components/aws-services/cloudfront/cloudfront-cache-behavior/cloudfront-cache-behavior'
import CloudFrontDistributionList from '@/components/aws-services/cloudfront/cloudfront-distribution-list/cloudfront-distribution-list'
import CloudFrontDistributionSettings from '@/components/aws-services/cloudfront/cloudfront-distribution-settings/cloudfront-distribution-settings'
import CloudFrontOriginSettings from '@/components/aws-services/cloudfront/cloudfront-origin-settings/cloudfront-origin-settings'
import CloudFrontWebsiteSettings from '@/components/aws-services/cloudfront/cloudfront-website-settings/cloudfront-website-settings'
import S3BucketCreate from '@/components/aws-services/s3/s3-bucket-create/s3-bucket-create'
import S3BucketDetail from '@/components/aws-services/s3/s3-bucket-detail/s3-bucket-detail'
import S3BucketList from '@/components/aws-services/s3/s3-bucket-list/s3-bucket-list'
import S3FileUpload from '@/components/aws-services/s3/s3-file-upload/s3-file-upload'
import { CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS } from '@/types/aws-services/cloudfront/cache-behavior/constants'
import { CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS } from '@/types/aws-services/cloudfront/distribution-list/constants'
import { CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/distribution-settings/constants'
import { CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/origin-settings/constants'
import { CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/website-settings/constants'
import { S3_BUCKET_CREATE_SECTIONS } from '@/types/aws-services/s3/bucket-create/'
import { S3_BUCKET_DETAIL_SECTIONS } from '@/types/aws-services/s3/bucket-detail/'
import { S3_BUCKET_LIST_SECTIONS } from '@/types/aws-services/s3/bucket-list/'
import { S3_FILE_UPLOAD_SECTIONS } from '@/types/aws-services/s3/file-upload/'

export interface ServicePage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
  sections: readonly string[]
}

const S3: Record<string, ServicePage> = {
  bucketCreate: {
    component: S3BucketCreate,
    sections: S3_BUCKET_CREATE_SECTIONS,
  },
  bucketList: {
    component: S3BucketList,
    sections: S3_BUCKET_LIST_SECTIONS,
  },
  bucketDetail: {
    component: S3BucketDetail,
    sections: S3_BUCKET_DETAIL_SECTIONS,
  },
  fileUpload: {
    component: S3FileUpload,
    sections: S3_FILE_UPLOAD_SECTIONS,
  },
}

const CloudFront: Record<string, ServicePage> = {
  distributionList: {
    component: CloudFrontDistributionList,
    sections: CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS,
  },
  originSettings: {
    component: CloudFrontOriginSettings,
    sections: CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS,
  },
  distributionSettings: {
    component: CloudFrontDistributionSettings,
    sections: CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS,
  },
  cacheBehavior: {
    component: CloudFrontCacheBehavior,
    sections: CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS,
  },
  websiteSettings: {
    component: CloudFrontWebsiteSettings,
    sections: CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS,
  },
}

export const AWS_SERVICE_REGISTRY = {
  s3: S3,
  cloudFront: CloudFront,
}
