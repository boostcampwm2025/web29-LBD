export const CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS = [
  'generalConfig',
  'priceClass',
  'cname',
  'sslTls',
  'network',
] as const

export type CloudFrontDistributionSettingsSectionKey =
  (typeof CLOUDFRONT_DISTRIBUTION_SETTINGS_SECTIONS)[number]

export type CloudFrontDistributionSettingsConfig = Record<
  CloudFrontDistributionSettingsSectionKey,
  boolean
>
