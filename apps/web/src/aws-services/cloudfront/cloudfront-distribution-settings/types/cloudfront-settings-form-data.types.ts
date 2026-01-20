export interface CloudFrontDistributionSettingsFormData {
  distributionName: string
  description: string
  enabled: boolean
  priceClass: 'all' | 'performance' | 'cost-optimized'
  cnames: string[]
  sslCertificate: 'cloudfront' | 'acm'
  acmCertificateArn: string
  minTlsVersion: string
  ipv6Enabled: boolean
}
