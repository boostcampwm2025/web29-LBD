export interface Bucket {
  id: string
  name: string
  region: string
  access: 'public' | 'private'
  createdAt: string
}

export interface S3ListFormData {
  searchQuery: string
  selectedBuckets: string[]
  buckets: Bucket[]
}

export const SAMPLE_BUCKETS: Bucket[] = [
  {
    id: '1',
    name: 'my-application-assets',
    region: '아시아 태평양(서울) ap-northeast-2',
    access: 'private',
    createdAt: '2024년 1월 15일',
  },
  {
    id: '2',
    name: 'user-uploads-prod',
    region: '아시아 태평양(서울) ap-northeast-2',
    access: 'private',
    createdAt: '2024년 2월 20일',
  },
  {
    id: '3',
    name: 'static-website-bucket',
    region: '미국 동부(버지니아 북부) us-east-1',
    access: 'public',
    createdAt: '2024년 3월 5일',
  },
  {
    id: '4',
    name: 'backup-data-storage',
    region: '아시아 태평양(도쿄) ap-northeast-1',
    access: 'private',
    createdAt: '2024년 3월 12일',
  },
]
