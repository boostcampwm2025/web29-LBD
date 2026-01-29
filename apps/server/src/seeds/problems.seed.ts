import { DataSource } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ProblemType } from '../problems/types/problem-type.enum';
import { Tag } from '../entities/tag.entity';

export async function seedProblems(dataSource: DataSource): Promise<void> {
  const problemRepository = dataSource.getRepository(Problem);
  const tagRepository = dataSource.getRepository(Tag);

  // 태그 데이터 먼저 생성
  const tagNames = [
    'Storage',
    'S3',
    'CDN',
    'CloudFront',
    'Web Hosting',
    'Security',
    'Compute', // 추가
    'EC2', // 추가
    'Server', // 추가
  ];

  const tags: Tag[] = [];
  for (const name of tagNames) {
    let tag = await tagRepository.findOne({ where: { name } });
    if (!tag) {
      tag = await tagRepository.save({ name });
    }
    tags.push(tag);
  }

  // 태그 이름으로 찾기 편하게 Map 생성
  const tagMap = new Map(tags.map((tag) => [tag.name, tag]));

  const problems = [
    {
      problemType: ProblemType.UNIT,
      title: '로그 저장용 S3 버킷 생성',
      description: '애플리케이션 로그를 저장하기 위한 S3 버킷을 생성하세요.',
      descDetail:
        'S3는 높은 가용성과 내구성을 제공하는 객체 스토리지 서비스입니다. 로그 데이터를 안전하게 보관하기 위해 기본 설정으로 버킷을 생성해 봅니다. 버킷 이름은 전역적으로 고유해야 합니다. 버킷 이름은 my-log-bucket으로 설정해주세요.',
      requiredFields: [
        {
          serviceName: 's3',
          serviceTask: 'bucketCreate',
          serviceSections: ['general', 'tags'],
          fixedOptions: {
            general: {
              bucketName: {
                placeholder: 'my-log-bucket',
                helperText: '전역적으로 고유한 이름을 입력하세요.',
                required: true,
              },
            },
          },
        },
      ],
      tags: [tagMap.get('Storage')!, tagMap.get('S3')!],
    },
    {
      problemType: ProblemType.UNIT,
      title: 'S3 버킷 버전 관리 활성화',
      description:
        '중요한 문서 파일을 저장할 버킷을 만들고 버전 관리를 활성화하세요.',
      descDetail:
        '버전 관리를 활성화하면 실수로 객체를 삭제하거나 덮어써도 이전 버전을 복구할 수 있습니다. 중요 문서나 백업 파일 저장 시 필수적인 설정입니다.',
      requiredFields: [
        {
          serviceName: 's3',
          serviceTask: 'bucketCreate',
          serviceSections: ['general', 'versioning'],
          fixedOptions: {
            versioning: {
              status: {
                value: 'Enabled',
                helperText: '버전 관리를 활성화해야 합니다.',
              },
            },
          },
        },
      ],
      tags: [
        tagMap.get('Storage')!,
        tagMap.get('S3')!,
        tagMap.get('Security')!,
      ],
    },
    {
      problemType: ProblemType.UNIT,
      title: 'CloudFront 원본(Origin) 설정',
      description:
        'S3 버킷을 원본으로 하는 CloudFront 배포의 원본 설정을 구성하세요.',
      descDetail:
        'CloudFront는 전 세계 엣지 로케이션을 통해 콘텐츠를 빠르게 전송하는 CDN 서비스입니다. S3 버킷을 원본으로 지정하고, 원본 액세스 제어(OAC)를 활성화하여 보안을 강화해 봅시다.',
      requiredFields: [
        {
          serviceName: 'cloudFront',
          serviceTask: 'originSettings',
          serviceSections: ['originDomain', 'originAccessControl'],
          fixedOptions: {
            originDomain: {
              domainName: {
                placeholder: 'my-bucket.s3.amazonaws.com',
                required: true,
              },
            },
          },
        },
      ],
      tags: [tagMap.get('CDN')!, tagMap.get('CloudFront')!],
    },
    {
      problemType: ProblemType.UNIT,
      title: '웹 서버용 EC2 인스턴스 생성',
      description:
        '정적 웹사이트의 백엔드 API 서버를 위한 EC2 인스턴스를 생성하세요.',
      descDetail:
        'EC2는 안전하고 크기를 조정할 수 있는 컴퓨팅 파워를 클라우드에서 제공합니다. 프리티어에서 사용 가능한 t2.micro 인스턴스를 생성하고, 기본 네트워크 설정을 구성해 봅니다.',
      requiredFields: [
        {
          serviceName: 'ec2',
          serviceTask: 'instanceCreate',
          serviceSections: [
            'nameTag',
            'ami',
            'instanceType',
            'networkSetting',
            'storage',
          ],
          fixedOptions: {
            images: {
              ami: {
                placeholder: 'Amazon Linux 2023 AMI',
                helperText: '프리티어 사용 가능 AMI를 선택하세요.',
                required: true,
              },
            },
            instanceType: {
              type: {
                value: 't2.micro',
                helperText: '프리티어 사용 가능 인스턴스 타입입니다.',
              },
            },
          },
        },
      ],
      tags: [tagMap.get('Compute')!, tagMap.get('EC2')!, tagMap.get('Server')!],
    },
    {
      problemType: ProblemType.UNIT,
      title: '정적 웹사이트 글로벌 배포 (S3 + CloudFront)',
      description:
        'S3 버킷을 생성하고 CloudFront CDN을 연결하여 웹사이트를 배포하세요.',
      descDetail:
        '단일 리전의 S3 버킷만으로는 전 세계 사용자에게 빠른 속도를 제공하기 어렵습니다. CloudFront를 S3 앞단에 배치하여 성능을 최적화하고, OAC를 통해 보안을 강화하는 구성을 실습합니다.',
      requiredFields: [
        {
          serviceName: 's3',
          serviceTask: 'bucketCreate',
          serviceSections: ['general'],
          fixedOptions: {
            general: {
              bucketName: {
                placeholder: 'my-global-site',
                helperText: '원본용 버킷 이름을 입력하세요.',
                required: true,
              },
            },
          },
        },
        {
          serviceName: 'cloudFront',
          serviceTask: 'originSettings',
          serviceSections: ['originDomain', 'originAccessControl'],
          fixedOptions: {},
        },
      ],
      tags: [
        tagMap.get('S3')!,
        tagMap.get('CloudFront')!,
        tagMap.get('CDN')!,
        tagMap.get('Web Hosting')!,
      ],
    },
    {
      problemType: ProblemType.UNIT,
      title: 'S3 버킷 생성하기',
      description: '기본 설정으로 S3 버킷을 하나 생성하세요',
      descDetail:
        'S3는 객체 스토리지 서비스로, 데이터를 파일 단위로 저장하고 관리할 수 있습니다. 이 문제에서는 특별한 설정 없이 기본 구성으로 S3 버킷을 하나 생성하는 것이 목표입니다. 생성한 버킷은 이후 문제에서 사용될 수 있습니다.',
      requiredFields: [
        {
          serviceName: 's3',
          serviceTask: 'bucketCreate',
          serviceSections: ['general', 'ownership', 'blockPublicAccess'],
        },
        {
          serviceName: 's3',
          serviceTask: 'bucketList',
          serviceSections: ['header', 'bucketTable', 'searchBar'],
        },
        {
          serviceName: 'cloudFront',
          serviceTask: 'websiteSettings',
          serviceSections: ['defaultRootObject'],
        },
      ],
    },
    {
      problemType: ProblemType.UNIT,
      title: 'VPC 생성하기',
      description: '기본 설정으로 VPC를 하나 생성하세요',
      descDetail:
        'VPC는 가상 네트워크를 생성하고 관리할 수 있는 서비스입니다. 이 문제에서는 특별한 설정 없이 기본 구성으로 VPC를 하나 생성하는 것이 목표입니다. 생성한 VPC는 이후 문제에서 사용될 수 있습니다.',
      requiredFields: [
        {
          serviceName: 'vpc',
          serviceTask: 'vpcCreate',
          serviceSections: ['nameTag', 'cidrBlock', 'tags', 'tenancy'],
          fixedOptions: [],
        },
      ],
    },
    {
      problemType: ProblemType.UNIT,
      title: 'EC2 보안 그룹 HTTP 포트 열기',
      description:
        '웹 서버 접근을 위해 보안 그룹에 HTTP(80) 포트를 열어주세요.',
      descDetail: `보안 그룹은 EC2 인스턴스의 가상 방화벽 역할을 합니다.
웹 서버를 외부에서 접근하려면 HTTP(80) 포트를 인바운드 규칙에 추가해야 합니다.

전제 조건:
- VPC가 이미 존재: default-vpc
- EC2 인스턴스가 이미 존재: web-server

학습 목표:
1. 보안 그룹의 역할 이해
2. 인바운드 규칙 추가 방법
3. 포트와 소스 IP 설정`,
      requiredFields: [
        {
          serviceName: 'ec2',
          serviceTask: 'securityGroupCreate',
          serviceSections: ['basicInfo', 'inboundRules'],
          fixedOptions: [
            {
              _type: 'vpc',
              id: 'default-vpc',
              name: 'default-vpc',
            },
          ],
        },
      ],
      solution: {
        answerConfig: {
          securityGroups: [
            {
              name: 'web-server-sg',
              vpcId: 'default-vpc',
              vpcName: 'default-vpc',
              ipPermissions: [
                {
                  ipProtocol: 'tcp',
                  fromPort: '80',
                  toPort: '80',
                  cidrIp: '0.0.0.0/0',
                  isInbound: true,
                },
              ],
            },
          ],
        },
      },
      requirements: {
        securityGroup: {
          'web-server-sg': {
            requireOpenPorts: [80],
          },
        },
      },
      tags: [tagMap.get('Security')!, tagMap.get('EC2')!],
    },
    {
      problemType: ProblemType.UNIT,
      title: 'EC2 User Data로 nginx 웹서버 설정',
      description:
        'User Data 스크립트를 사용하여 EC2 인스턴스에 nginx를 자동 설치하세요.',
      descDetail: `## 전제 조건
- VPC와 퍼블릭 서브넷이 이미 존재합니다.
- 보안 그룹에서 HTTP(80) 포트가 열려있습니다.

## 목표
EC2 인스턴스 시작 시 자동으로 nginx 웹서버를 설치하고 실행하는 User Data 스크립트를 작성하세요.

## 학습 목표
1. EC2 User Data 개념 이해
2. 부트스트래핑을 통한 인스턴스 자동 구성
3. Amazon Linux에서 nginx 설치 명령어

## 힌트
- Amazon Linux에서는 yum 패키지 매니저를 사용합니다.
- systemctl 명령으로 서비스를 시작/활성화합니다.`,
      requiredFields: [
        {
          serviceName: 'ec2',
          serviceTask: 'instanceCreate',
          serviceSections: ['nameTag', 'ami', 'userData'],
          fixedOptions: {
            ami: {
              osType: {
                value: 'amazon-linux',
                helperText: 'Amazon Linux 2023을 선택하세요.',
              },
            },
            userData: {
              script: {
                placeholder:
                  '#!/bin/bash\n# nginx 설치 및 시작 스크립트를 작성하세요',
                helperText: 'yum을 사용하여 nginx를 설치하고 시작하세요.',
              },
            },
          },
        },
      ],
      solution: {
        answerConfig: {
          ec2: [
            {
              name: 'web-server',
              osType: 'amazon-linux',
              userData: 'DONT_CARE',
            },
          ],
        },
      },
      requirements: {
        ec2: {
          'web-server': {
            requireUserData: true,
            userDataMustContain: ['nginx', 'yum install', 'systemctl start'],
          },
        },
      },
      tags: [tagMap.get('Compute')!, tagMap.get('EC2')!, tagMap.get('Server')!],
    },
  ];

  for (const problemData of problems) {
    await problemRepository.save(problemData as any);
  }

  console.log('Problems seeded successfully');
}
