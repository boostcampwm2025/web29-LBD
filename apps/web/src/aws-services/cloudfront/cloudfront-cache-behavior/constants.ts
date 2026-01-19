export const CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS = [
  'viewerProtocol',
  'httpMethods',
  'cachePolicy',
  'compression',
  'functionAssociations',
] as const

export type CloudFrontCacheBehaviorSectionKey =
  (typeof CLOUDFRONT_CACHE_BEHAVIOR_SECTIONS)[number]

export type CloudFrontCacheBehaviorConfig = Record<
  CloudFrontCacheBehaviorSectionKey,
  boolean
>
