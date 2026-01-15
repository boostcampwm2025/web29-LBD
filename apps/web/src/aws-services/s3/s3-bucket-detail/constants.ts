export const S3_BUCKET_DETAIL_SECTIONS = [
  'breadcrumb',
  'header',
  'searchBar',
  'selectionInfo',
  'objectListTable',
  'footerInfo',
] as const

export type S3BucketDetailSectionKey =
  (typeof S3_BUCKET_DETAIL_SECTIONS)[number]

export type S3BucketDetailConfig = Record<S3BucketDetailSectionKey, boolean>
