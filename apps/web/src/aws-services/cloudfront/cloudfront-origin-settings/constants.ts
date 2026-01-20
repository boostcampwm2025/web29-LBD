export const CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS = [
  'originDomain',
  'originPath',
  'originAccessControl',
  'customHeaders',
] as const

export type CloudFrontOriginSettingsSectionKey =
  (typeof CLOUDFRONT_ORIGIN_SETTINGS_SECTIONS)[number]

export type CloudFrontOriginSettingsConfig = Record<
  CloudFrontOriginSettingsSectionKey,
  boolean
>
