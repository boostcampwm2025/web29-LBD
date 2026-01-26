import { ComponentType } from 'react'
import type { DefaultValues, FieldValues } from 'react-hook-form'

import CloudFrontCacheBehavior from '@/components/aws-services/cloudfront/cloudfront-cache-behavior/cloudfront-cache-behavior'
import CloudFrontDistributionList from '@/components/aws-services/cloudfront/cloudfront-distribution-list/cloudfront-distribution-list'
import CloudFrontDistributionSettings from '@/components/aws-services/cloudfront/cloudfront-distribution-settings/cloudfront-distribution-settings'
import CloudFrontOriginSettings from '@/components/aws-services/cloudfront/cloudfront-origin-settings/cloudfront-origin-settings'
import CloudFrontWebsiteSettings from '@/components/aws-services/cloudfront/cloudfront-website-settings/cloudfront-website-settings'
import EC2InstanceCreate from '@/components/aws-services/ec2/ec2-instance-create/ec2-instance-create'
import S3BucketCreate from '@/components/aws-services/s3/s3-bucket-create/s3-bucket-create'
import S3BucketDetail from '@/components/aws-services/s3/s3-bucket-detail/s3-bucket-detail'
import S3BucketList from '@/components/aws-services/s3/s3-bucket-list/s3-bucket-list'
import S3FileUpload from '@/components/aws-services/s3/s3-file-upload/s3-file-upload'
import type { CloudFrontCacheFormData } from '@/types/aws-services/cloudfront/cache-behavior'
import { CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS } from '@/types/aws-services/cloudfront/cache-behavior/constants'
import type { CloudFrontListFormData } from '@/types/aws-services/cloudfront/distribution-list'
import { CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS } from '@/types/aws-services/cloudfront/distribution-list/constants'
import type { CloudFrontDistributionSettingsFormData } from '@/types/aws-services/cloudfront/distribution-settings'
import { CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/distribution-settings/constants'
import type { CloudFrontOriginFormData } from '@/types/aws-services/cloudfront/origin-settings'
import { CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/origin-settings/constants'
import type { CloudFrontWebsiteFormData } from '@/types/aws-services/cloudfront/website-settings'
import { CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS } from '@/types/aws-services/cloudfront/website-settings/constants'
import { EC2_INSTANCE_CREATE_SECTIONS } from '@/types/aws-services/ec2/instance-create'
import type { S3BucketFormData } from '@/types/aws-services/s3/bucket-create'
import { S3_BUCKET_CREATE_SECTIONS } from '@/types/aws-services/s3/bucket-create/'
import { S3_BUCKET_DETAIL_SECTIONS } from '@/types/aws-services/s3/bucket-detail/'
import type { S3DetailFormData } from '@/types/aws-services/s3/bucket-detail/s3-detail-form-data.types'
import { S3_BUCKET_LIST_SECTIONS } from '@/types/aws-services/s3/bucket-list/'
import type { S3ListFormData } from '@/types/aws-services/s3/bucket-list/s3-list-form-data.types'
import { S3_FILE_UPLOAD_SECTIONS } from '@/types/aws-services/s3/file-upload/'
import type { S3UploadFormData } from '@/types/aws-services/s3/file-upload/s3-upload-form-data.types'

export interface ServicePage<T extends FieldValues = FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
  sections: readonly string[]
  defaultValues: DefaultValues<T>
}

const S3: Record<string, ServicePage> = {
  bucketCreate: {
    component: S3BucketCreate,
    sections: S3_BUCKET_CREATE_SECTIONS,
    defaultValues: {
      general: { name: '', region: 'ap-northeast-2' },
      ownership: { aclEnabled: 'disabled' },
      blockPublicAccess: {
        blockAll: true,
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: true,
        restrictPublicBuckets: true,
      },
      versioning: { versioningEnabled: false },
      encryption: { type: 'sse-s3' },
      advancedSettings: { objectLockEnabled: false },
      tags: [],
    } satisfies S3BucketFormData,
  },
  bucketList: {
    component: S3BucketList,
    sections: S3_BUCKET_LIST_SECTIONS,
    defaultValues: {
      searchQuery: '',
      selectedBuckets: [],
      buckets: [],
    } satisfies S3ListFormData,
  },
  bucketDetail: {
    component: S3BucketDetail,
    sections: S3_BUCKET_DETAIL_SECTIONS,
    defaultValues: {
      searchQuery: '',
      selectedObjects: [],
      currentPath: '/',
      objects: [],
    } satisfies S3DetailFormData,
  },
  fileUpload: {
    component: S3FileUpload,
    sections: S3_FILE_UPLOAD_SECTIONS,
    defaultValues: {
      files: [],
      bucketName: '',
      permission: 'private',
      storageClass: 'standard',
    } satisfies S3UploadFormData,
  },
}

const CloudFront: Record<string, ServicePage> = {
  distributionList: {
    component: CloudFrontDistributionList,
    sections: CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS,
    defaultValues: {
      searchQuery: '',
      selectedDistributions: [],
    } satisfies CloudFrontListFormData,
  },
  originSettings: {
    component: CloudFrontOriginSettings,
    sections: CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS,
    defaultValues: {
      originType: 's3',
      selectedBucket: '',
      customDomain: '',
      originPath: '',
      accessControl: 'oac',
      oacName: '',
      customHeaders: [],
    } satisfies CloudFrontOriginFormData,
  },
  distributionSettings: {
    component: CloudFrontDistributionSettings,
    sections: CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS,
    defaultValues: {
      distributionName: '',
      description: '',
      enabled: true,
      priceClass: 'all',
      cnames: [],
      sslCertificate: 'cloudfront',
      acmCertificateArn: '',
      minTlsVersion: 'TLSv1.2_2021',
      ipv6Enabled: true,
    } satisfies CloudFrontDistributionSettingsFormData,
  },
  cacheBehavior: {
    component: CloudFrontCacheBehavior,
    sections: CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS,
    defaultValues: {
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: 'GET_HEAD',
      cachePolicy: 'managed',
      managedPolicyName: 'CachingOptimized',
      customTTL: { min: '0', default: '86400', max: '31536000' },
      compressionEnabled: true,
      viewerRequestFunction: '',
      viewerResponseFunction: '',
    } satisfies CloudFrontCacheFormData,
  },
  websiteSettings: {
    component: CloudFrontWebsiteSettings,
    sections: CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS,
    defaultValues: {
      defaultRootObject: 'index.html',
      errorResponses: [],
      loggingEnabled: false,
      loggingBucket: '',
      logPrefix: '',
      wafEnabled: false,
      webAclId: '',
    } satisfies CloudFrontWebsiteFormData,
  },
}

const EC2: Record<string, ServicePage> = {
  instanceCreate: {
    component: EC2InstanceCreate,
    sections: EC2_INSTANCE_CREATE_SECTIONS,
    defaultValues: {
      nameTag: { name: '' },
    },
  },
}

export const AWS_SERVICE_REGISTRY = {
  s3: S3,
  cloudFront: CloudFront,
  ec2: EC2,
}
