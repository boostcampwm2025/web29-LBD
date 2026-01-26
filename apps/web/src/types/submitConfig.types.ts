import type { S3SubmitConfig } from './aws-services/s3/bucket-create'

export type ServiceType = 's3'

export type ServiceConfig = S3SubmitConfig

// 개별 서비스 데이터 (ID를 포함해 식별 가능하게 함)
export interface ServiceConfigItem<T> {
  id: string // problemData의 mapper ID 등 고유 식별자
  data: T
  isReady: boolean // 폼이 유효하게 작성되었는지 여부
}

// 구성 정보
export interface GlobalSubmitConfig {
  s3?: ServiceConfigItem<S3SubmitConfig>[]
}

// 최종 제출
export interface FinalSubmitConfig {
  submitConfig: {
    s3?: ServiceConfigItem<S3SubmitConfig>[]
  }
}
