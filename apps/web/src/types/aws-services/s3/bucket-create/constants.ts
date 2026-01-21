export const S3_BUCKET_CREATE_SECTIONS = [
  'general',
  'ownership',
  'blockPublicAccess',
  'versioning',
  'encryption',
  'advancedSettings',
  'tags',
] as const

export type S3BucketCreateSectionKey =
  (typeof S3_BUCKET_CREATE_SECTIONS)[number]

export type S3BucketCreateConfig = Record<S3BucketCreateSectionKey, boolean>
