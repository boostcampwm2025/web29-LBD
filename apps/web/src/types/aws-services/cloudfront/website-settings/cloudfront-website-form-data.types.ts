export interface ErrorResponse {
  errorCode: string
  responsePagePath: string
  responseCode: string
  ttl: string
}

export interface CloudFrontWebsiteFormData {
  defaultRootObject: string
  errorResponses: ErrorResponse[]
  loggingEnabled: boolean
  loggingBucket: string
  logPrefix: string
  wafEnabled: boolean
  webAclId: string
}
