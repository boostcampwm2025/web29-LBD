import type { S3SubmitConfig } from '@/types/aws-services/s3/bucket-create'

export const LAYOUT_CONFIG = {
  PADDING: 40,
  GAP: 20,
  ROOT_ID: 'aws-cloud',
  GLOBAL_ID: 'aws-global-network',
}

// 유니온 타입으로 내보내기
export type ConfigType =
  | (S3SubmitConfig & { type: string })
  | { type: string; region: string; vpcId: string; name: string }

export const GLOBAL_SERVICE_TYPES = ['iam', 'route53', 'cloudfront']
export const REGIONAL_SERVICE_TYPES = ['vpc', 'ec2', 's3', 'rds']

// 리전의 바로 아래 생성될 수 있는 서비스 타입들
export const REGION_CHILDS_TYPES = ['vpc', 's3', 'az', 'rds']
