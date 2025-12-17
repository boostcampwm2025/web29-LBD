import type { Problem } from '@/types/problems/problem';

export const problems: Problem[] = [
  {
    id: '1',
    title: '기본 EC2 인스턴스 생성',
    category: 'step',
    level: 1,
    description: '정상 동작하는 EC2 인스턴스를 생성하세요.',
    prerequisites: ['IAM Role (EC2용) 제공됨', '기본 VPC 사용 가능'],
    initialNodes: [
      {
        id: 'vpc-1',
        type: 'aws',
        position: { x: 100, y: 200 },
        data: { label: 'VPC', type: 'VPC', status: 'active' },
      },
    ],
    initialEdges: [],
    solution: {
      instanceType: 't2.micro',
      amiId: 'ami-amazon-linux-2',
      vpcId: 'vpc-default',
      subnetId: 'subnet-public-1',
      securityGroupId: 'sg-default',
      iamRole: 'EC2-Basic-Role',
    },
  },
  {
    id: '2',
    title: '보안 그룹 설정하기',
    category: 'step',
    level: 2,
    description:
      '웹 서버를 위한 EC2 인스턴스를 생성하고 적절한 보안 그룹을 설정하세요. HTTP(80), HTTPS(443) 포트를 열어야 합니다.',
    prerequisites: ['VPC와 서브넷 제공됨', '기본 IAM Role 제공됨'],
    initialNodes: [
      {
        id: 'vpc-1',
        type: 'aws',
        position: { x: 100, y: 150 },
        data: { label: 'VPC', type: 'VPC', status: 'active' },
      },
      {
        id: 'subnet-1',
        type: 'aws',
        position: { x: 100, y: 300 },
        data: { label: 'Public Subnet', type: 'Subnet', status: 'active' },
      },
    ],
    initialEdges: [
      { id: 'e1', source: 'vpc-1', target: 'subnet-1', animated: true },
    ],
    solution: {
      instanceType: 't2.micro',
      amiId: 'ami-amazon-linux-2',
      vpcId: 'vpc-default',
      subnetId: 'subnet-public-1',
      securityGroupId: 'sg-web-server',
      iamRole: 'EC2-Basic-Role',
    },
  },
  {
    id: '3',
    title: '다중 AZ 아키텍처 구성',
    category: 'scenario',
    description:
      '고가용성을 위해 두 개의 가용 영역(AZ)에 걸쳐 EC2 인스턴스를 배포하세요. 로드 밸런서를 통해 트래픽을 분산해야 합니다.',
    prerequisites: [
      'VPC 및 다중 서브넷 제공됨',
      'Application Load Balancer 사용',
    ],
    initialNodes: [
      {
        id: 'vpc-1',
        type: 'aws',
        position: { x: 250, y: 100 },
        data: { label: 'VPC', type: 'VPC', status: 'active' },
      },
      {
        id: 'subnet-1',
        type: 'aws',
        position: { x: 100, y: 250 },
        data: { label: 'Subnet AZ-1', type: 'Subnet', status: 'active' },
      },
      {
        id: 'subnet-2',
        type: 'aws',
        position: { x: 400, y: 250 },
        data: { label: 'Subnet AZ-2', type: 'Subnet', status: 'active' },
      },
    ],
    initialEdges: [
      { id: 'e1', source: 'vpc-1', target: 'subnet-1', animated: true },
      { id: 'e2', source: 'vpc-1', target: 'subnet-2', animated: true },
    ],
    solution: {
      instanceType: 't2.micro',
      amiId: 'ami-amazon-linux-2',
      vpcId: 'vpc-default',
      subnetId: 'subnet-public-1',
      securityGroupId: 'sg-web-server',
      iamRole: 'EC2-HA-Role',
    },
  },
];
