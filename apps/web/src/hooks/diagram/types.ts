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

export interface NodeTypeConfig {
  nodeType: 'awsGroup' | 'awsService'
  width: number
  height: number
  borderColor?: string
  bgColor?: string
}

export const NODE_TYPE_CONFIG: Record<string, NodeTypeConfig> = {
  vpc: { nodeType: 'awsGroup', width: 400, height: 300 },
  subnet: { nodeType: 'awsGroup', width: 300, height: 200 },
  securityGroup: {
    nodeType: 'awsGroup',
    width: 300,
    height: 200,
    borderColor: 'red',
    bgColor: 'red',
  },
}

export const DEFAULT_NODE_CONFIG: NodeTypeConfig = {
  nodeType: 'awsService',
  width: 80,
  height: 80,
}

export function getNodeConfig(serviceType: string): NodeTypeConfig {
  return NODE_TYPE_CONFIG[serviceType] ?? DEFAULT_NODE_CONFIG
}

export function getIcons(serviceType: string): string {
  const TYPES_TO_ICON: Record<string, string> = {
    vpc: 'vpcGroup',
    subnet: 'privateSubnet',
  }
  return TYPES_TO_ICON[serviceType] || serviceType
}
