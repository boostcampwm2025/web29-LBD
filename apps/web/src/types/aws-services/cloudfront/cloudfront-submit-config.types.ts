import type { ErrorResponse } from './website-settings'

export type CloudFrontSubmitConfig = {
  _type: 'cloudFront'
  id: string
  name: string

  // Origin settings
  originType?: 's3' | 'custom'
  selectedBucket?: string
  customDomain?: string
  originPath?: string
  accessControl?: 'oac' | 'oai' | 'public'
  oacName?: string
  customHeaders?: Array<{ key: string; value: string }>

  // Distribution settings
  distributionName?: string
  description?: string
  enabled?: boolean
  priceClass?: 'all' | 'performance' | 'cost-optimized'
  cnames?: string[]
  sslCertificate?: 'cloudfront' | 'acm'
  acmCertificateArn?: string
  minTlsVersion?: string
  ipv6Enabled?: boolean

  // Cache behavior
  viewerProtocolPolicy?: 'allow-all' | 'redirect-to-https' | 'https-only'
  allowedMethods?: 'GET_HEAD' | 'GET_HEAD_OPTIONS' | 'ALL'
  cachePolicy?: 'managed' | 'custom'
  managedPolicyName?: string
  customTTL?: { min: string; default: string; max: string }
  compressionEnabled?: boolean
  viewerRequestFunction?: string
  viewerResponseFunction?: string

  // Website settings
  defaultRootObject?: string
  errorResponses?: ErrorResponse[]
  loggingEnabled?: boolean
  loggingBucket?: string
  logPrefix?: string
  wafEnabled?: boolean
  webAclId?: string
}
