export const LAYOUT_CONFIG = {
  PADDING: 40,
  GAP: 20,
  ROOT_ID: 'aws-cloud',
  GLOBAL_ID: 'aws-global-network',
}

export const GLOBAL_SERVICE_TYPES = ['iam', 'route53', 'cloudFront']
export const REGIONAL_SERVICE_TYPES = ['vpc', 'ec2', 's3', 'rds']

// 리전의 바로 아래 생성될 수 있는 서비스 타입들
export const REGION_CHILDS_TYPES = ['vpc', 's3', 'az', 'rds']

export const VPC_CHILDS_TYPES = ['subnet', 'igw', 'routeTable']
// 서브넷 아래에 생성될 수 있는 서비스 타입들
export const SUBNET_CHILDS_TYPES = [
  'ec2',
  'rds',
  'elb',
  'lambda',
  'efs',
  'natGateway',
]

export const TYPE_ICONS_MAP = {
  vpc: 'vpcGroup',
  subnet: 'privateSubnet',
}
