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
        'S3는 높은 가용성과 내구성을 제공하는 객체 스토리지 서비스입니다. 로그 데이터를 안전하게 보관하기 위해 기본 설정으로 버킷을 생성해 봅니다. 버킷 이름은 전역적으로 고유해야 합니다.',
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
          serviceSections: ['nameAndTags', 'images', 'instanceType', 'network'],
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
  ];

  for (const problemData of problems) {
    await problemRepository.save(problemData as any);
  }

  console.log('Problems seeded successfully');
}
