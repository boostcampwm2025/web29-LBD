export interface UploadFile {
  id: string
  name: string
  size: string
}

export interface S3UploadFormData {
  files: UploadFile[]
  bucketName: string
  permission: 'private' | 'public-read'
  storageClass:
    | 'standard'
    | 'intelligent-tiering'
    | 'standard-ia'
    | 'onezone-ia'
    | 'glacier'
    | 'glacier-flexible'
    | 'deep-archive'
}

export const SAMPLE_FILES: UploadFile[] = [
  {
    id: '1',
    name: 'index.html',
    size: '16kb',
  },
]
