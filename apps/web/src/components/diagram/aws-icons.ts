/**
 * AWS Architecture Icons 경로 매핑
 * Asset-Package에서 선별된 아이콘들의 경로 상수
 */

// 서비스 아이콘 (64px) - 고수준 아키텍처 다이어그램용
export const AWS_SERVICE_ICONS = {
  s3: '/icons/aws/services/s3.svg',
  s3Glacier: '/icons/aws/services/s3-glacier.svg',
  cloudfront: '/icons/aws/services/cloudfront.svg',
  vpc: '/icons/aws/services/vpc.svg',
  route53: '/icons/aws/services/route53.svg',
  apiGateway: '/icons/aws/services/api-gateway.svg',
  elb: '/icons/aws/services/elb.svg',
  ec2: '/icons/aws/services/ec2.svg',
  lambda: '/icons/aws/services/lambda.svg',
  rds: '/icons/aws/services/rds.svg',
  dynamodb: '/icons/aws/services/dynamodb.svg',
  iam: '/icons/aws/services/iam.svg',
  acm: '/icons/aws/services/acm.svg',
  waf: '/icons/aws/services/waf.svg',
  secretsManager: '/icons/aws/services/secrets-manager.svg',
} as const

// 리소스 아이콘 (48px) - 상세 리소스 표현용
export const AWS_RESOURCE_ICONS = {
  s3Bucket: '/icons/aws/resources/s3-bucket.svg',
  s3Object: '/icons/aws/resources/s3-object.svg',
  s3BucketWithObjects: '/icons/aws/resources/s3-bucket-with-objects.svg',
  cloudfrontEdge: '/icons/aws/resources/cloudfront-edge.svg',
  cloudfrontDistribution: '/icons/aws/resources/cloudfront-distribution.svg',
  internetGateway: '/icons/aws/resources/internet-gateway.svg',
  internet: '/icons/aws/resources/internet.svg',
  user: '/icons/aws/resources/user.svg',
  users: '/icons/aws/resources/users.svg',
  client: '/icons/aws/resources/client.svg',
} as const

// 그룹 아이콘 (32px) - 컨테이너/구조적 요소용
export const AWS_GROUP_ICONS = {
  awsCloud: '/icons/aws/groups/aws-cloud.svg',
  region: '/icons/aws/groups/region.svg',
  vpcGroup: '/icons/aws/groups/vpc-group.svg',
  privateSubnet: '/icons/aws/groups/private-subnet.svg',
  publicSubnet: '/icons/aws/groups/public-subnet.svg',
  autoScaling: '/icons/aws/groups/auto-scaling.svg',
  securityGroup: '', // Security Group은 아이콘 없이 빨간 점선 테두리로 표시
  securityGroups: '', // Security Group은 아이콘 없이 빨간 점선 테두리로 표시
} as const

// 타입 정의
export type AwsServiceIconKey = keyof typeof AWS_SERVICE_ICONS
export type AwsResourceIconKey = keyof typeof AWS_RESOURCE_ICONS
export type AwsGroupIconKey = keyof typeof AWS_GROUP_ICONS

// 통합 아이콘 타입
export type AwsIconKey =
  | AwsServiceIconKey
  | AwsResourceIconKey
  | AwsGroupIconKey

// 통합 아이콘 객체
export const AWS_ICONS = {
  ...AWS_SERVICE_ICONS,
  ...AWS_RESOURCE_ICONS,
  ...AWS_GROUP_ICONS,
} as const

// 아이콘 경로 헬퍼 함수
export function getAwsIconPath(key: AwsIconKey): string {
  return AWS_ICONS[key]
}
