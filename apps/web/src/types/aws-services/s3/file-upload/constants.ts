export const S3_FILE_UPLOAD_SECTIONS = [
  'breadcrumb',
  'header',
  'fileUpload',
  'permissions',
  'properties',
  'actionButtons',
] as const

export type S3FileUploadSectionKey = (typeof S3_FILE_UPLOAD_SECTIONS)[number]

export type S3FileUploadConfig = Record<S3FileUploadSectionKey, boolean>
