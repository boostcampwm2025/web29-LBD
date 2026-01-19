export const CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS = [
  'header',
  'searchBar',
  'selectionInfo',
  'distributionTable',
  'footerInfo',
] as const

export type CloudFrontDistributionListSectionKey =
  (typeof CLOUDFRONT_DISTRIBUTION_LIST_SECTIONS)[number]

export type CloudFrontDistributionListConfig = Record<
  CloudFrontDistributionListSectionKey,
  boolean
>
