export interface S3Bucket {
  id: string
  name: string
  region: string
}

export interface CustomHeader {
  key: string
  value: string
}

export interface CloudFrontOriginFormData {
  originType: 's3' | 'custom'
  selectedBucket: string
  customDomain: string
  originPath: string
  accessControl: 'oac' | 'oai' | 'public'
  oacName: string
  customHeaders: CustomHeader[]
}
