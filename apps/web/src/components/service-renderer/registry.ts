import {
  CloudFrontCacheBehaviorRenderer,
  CloudFrontDistributionListRenderer,
  CloudFrontDistributionSettingsRenderer,
  CloudFrontOriginSettingsRenderer,
  CloudFrontWebsiteSettingsRenderer,
} from './cloudfront'
import {
  S3BucketCreateRenderer,
  S3BucketDetailRenderer,
  S3BucketListRenderer,
  S3FileUploadRenderer,
} from './s3'

import type { ComponentType } from 'react'

import { CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS } from '@/types/aws-services/cloudfront/cache-behavior'
import { CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS } from '@/types/aws-services/cloudfront/distribution-list'
import { CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/distribution-settings'
import { CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/origin-settings'
import { CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/website-settings'
import { S3_BUCKET_CREATE_SECTIONS } from '@/types/aws-services/s3/bucket-create'
import { S3_BUCKET_DETAIL_SECTIONS } from '@/types/aws-services/s3/bucket-detail'
import { S3_BUCKET_LIST_SECTIONS } from '@/types/aws-services/s3/bucket-list'
import { S3_FILE_UPLOAD_SECTIONS } from '@/types/aws-services/s3/file-upload'

export interface RendererPage {
  renderer: ComponentType<{ config: Record<string, boolean> }>
  sections: readonly string[]
}

const S3: Record<string, RendererPage> = {
  'bucket-create': {
    renderer: S3BucketCreateRenderer,
    sections: S3_BUCKET_CREATE_SECTIONS,
  },
  'bucket-list': {
    renderer: S3BucketListRenderer,
    sections: S3_BUCKET_LIST_SECTIONS,
  },
  'bucket-detail': {
    renderer: S3BucketDetailRenderer,
    sections: S3_BUCKET_DETAIL_SECTIONS,
  },
  'file-upload': {
    renderer: S3FileUploadRenderer,
    sections: S3_FILE_UPLOAD_SECTIONS,
  },
}

const CloudFront: Record<string, RendererPage> = {
  'distribution-list': {
    renderer: CloudFrontDistributionListRenderer,
    sections: CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS,
  },
  'origin-settings': {
    renderer: CloudFrontOriginSettingsRenderer,
    sections: CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS,
  },
  'distribution-settings': {
    renderer: CloudFrontDistributionSettingsRenderer,
    sections: CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS,
  },
  'cache-behavior': {
    renderer: CloudFrontCacheBehaviorRenderer,
    sections: CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS,
  },
  'website-settings': {
    renderer: CloudFrontWebsiteSettingsRenderer,
    sections: CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS,
  },
}

export const RENDERER_REGISTRY = {
  S3,
  CloudFront,
}
