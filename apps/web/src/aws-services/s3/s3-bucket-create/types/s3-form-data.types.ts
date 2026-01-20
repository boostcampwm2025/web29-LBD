export interface S3BucketFormData {
  general: {
    bucketName: string
    region: string
  }
  ownership: {
    aclEnabled: 'disabled' | 'enabled'
    ownershipModel?: 'bucket-owner-preferred' | 'object-writer'
  }
  blockPublicAccess: {
    blockAll: boolean
    blockPublicAcls: boolean
    ignorePublicAcls: boolean
    blockPublicPolicy: boolean
    restrictPublicBuckets: boolean
  }
  versioning: {
    enabled: boolean
  }
  encryption: {
    type: 'sse-s3' | 'sse-kms'
  }
  advancedSettings: {
    objectLockEnabled: boolean
  }
  tags: Array<{
    key: string
    value: string
  }>
}
