export type S3SubmitConfig = {
  _type: 's3'
  id: string
  name: string
  region: string
  aclEnabled?: 'disabled' | 'enabled'
  ownershipModel?: 'bucket-owner-preferred' | 'object-writer'
  blockAll?: boolean
  blockPublicAcls?: boolean
  ignorePublicAcls?: boolean
  blockPublicPolicy?: boolean
  restrictPublicBuckets?: boolean
  encryptionType?: 'sse-s3' | 'sse-kms'
  versioningEnabled?: boolean
  tags?: Array<{
    key: string
    value: string
  }>
}
