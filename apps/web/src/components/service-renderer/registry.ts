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
import { FormData } from './types'

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
import { ServiceConfigItem, ServiceType } from '@/types/submitConfig.types'
import { ServiceConfig } from '@/types/submitConfig.types'

export interface CommonRendererProps {
  config: Record<string, boolean> // 필수
  onAdd: (type: ServiceType, data: ServiceConfig) => void
  createdItems: ServiceConfigItem<ServiceConfig>[]
  onRemove: (id: string) => void
}

export interface RendererPage {
  // 제네릭을 사용하지 않고 공통 Props 타입 사용
  renderer: ComponentType<CommonRendererProps>
  sections: readonly string[]
}

const s3: Record<string, RendererPage> = {
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

const cloudfront: Record<string, RendererPage> = {
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
  s3,
  cloudfront,
}
