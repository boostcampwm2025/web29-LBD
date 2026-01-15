export const CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS = [
  'defaultRootObject',
  'customErrorPages',
  'logging',
  'waf',
  'reviewSummary',
] as const

export type CloudFrontWebsiteSettingsSectionKey =
  (typeof CLOUDFRONT_WEBSITE_SETTINGS_SECTIONS)[number]

export type CloudFrontWebsiteSettingsConfig = Record<
  CloudFrontWebsiteSettingsSectionKey,
  boolean
>
