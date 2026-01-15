export interface CustomTTL {
  min: string
  default: string
  max: string
}

export interface CloudFrontCacheFormData {
  viewerProtocolPolicy: 'allow-all' | 'redirect-to-https' | 'https-only'
  allowedMethods: 'GET_HEAD' | 'GET_HEAD_OPTIONS' | 'ALL'
  cachePolicy: 'managed' | 'custom'
  managedPolicyName: string
  customTTL: CustomTTL
  compressionEnabled: boolean
  viewerRequestFunction: string
  viewerResponseFunction: string
}
