export const S3_BUCKET_LIST_SECTIONS = [
  'header',
  'searchBar',
  'selectionInfo',
  'bucketTable',
  'footerInfo',
] as const

export type S3BucketListSectionKey = (typeof S3_BUCKET_LIST_SECTIONS)[number]

export type S3BucketListConfig = Record<S3BucketListSectionKey, boolean>
