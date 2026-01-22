import { DataSource } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ProblemType } from '../problems/types/problem-type.enum';
import { Tag } from '../entities/tag.entity';

export async function seedProblems(dataSource: DataSource): Promise<void> {
  const problemRepository = dataSource.getRepository(Problem);
  const tagRepository = dataSource.getRepository(Tag);

  // 태그 데이터 먼저 생성
  const tagNames = [
    'VPC',
    'CIDR',
    '네트워크',
    '기초',
    'Subnet',
    'Public',
    'Internet Gateway',
    'IGW',
    'Route Table',
    'Routing',
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
      problem_type: ProblemType.UNIT,
      title: '충분히 넓은 VPC 네트워크 만들기',
      description:
        '여러 Subnet을 생성할 수 있도록 /16 대역의 VPC를 하나 생성하세요',
      desc_detail:
        'VPC는 여러 Subnet을 담는 가장 큰 네트워크 단위입니다. 너무 작은 네트워크 범위를 설정하면 이후에 Subnet을 추가하거나 확장하기 어렵습니다. 이를 방지하기 위해 충분히 넓은 네트워크 대역을 먼저 설정해야 합니다. 여러 Subnet을 생성할 수 있도록 /16 대역의 VPC를 하나 생성하세요.',
      required_fields: [
        {
          service: 'VPC',
          service_task: 'vpc-create',
          service_sections: ['general'],
          fixed_options: {
            general: {
              cidr_block: {
                placeholder: '10.0.0.0/16',
                helper_text:
                  'VPC는 여러 Subnet을 담기 위해 넓은 네트워크 범위가 필요합니다.',
                required: true,
              },
            },
          },
        },
      ],
      tags: [
        tagMap.get('VPC')!,
        tagMap.get('CIDR')!,
        tagMap.get('네트워크')!,
        tagMap.get('기초')!,
      ],
    },
    {
      problem_type: ProblemType.UNIT,
      title: 'VPC 안에 포함되는 Subnet 생성하기',
      description:
        '생성한 VPC의 네트워크 범위 안에 포함되는 Subnet을 하나 생성하세요',
      desc_detail:
        'Subnet은 반드시 VPC의 네트워크 범위 안에 포함되어야 합니다. VPC보다 넓거나 겹치지 않는 CIDR을 사용하면 Subnet은 정상적으로 동작하지 않습니다. 생성한 VPC의 네트워크 범위 안에 포함되는 Subnet을 하나 생성하세요.',
      required_fields: [
        {
          service: 'Subnet',
          service_task: 'subnet-create',
          service_sections: ['general'],
          fixed_options: {
            general: {
              vpc_id: {
                placeholder: 'VPC를 선택하세요',
                helper_text: 'Subnet CIDR은 VPC CIDR 범위 안에 있어야 합니다.',
                required: true,
              },
              cidr_block: {
                placeholder: 'x.x.x.x/x',
                helper_text: 'VPC CIDR 범위 안에 포함되어야 합니다.',
                required: true,
              },
            },
          },
        },
      ],
      tags: [
        tagMap.get('Subnet')!,
        tagMap.get('VPC')!,
        tagMap.get('CIDR')!,
        tagMap.get('네트워크')!,
      ],
    },
    {
      problem_type: ProblemType.UNIT,
      title: '퍼블릭 서브넷 생성하기',
      description:
        '기존 VPC 내부에 퍼블릭 서브넷으로 사용할 서브넷을 하나 생성하세요',
      desc_detail:
        'EC2 인스턴스를 외부에서 접근 가능하게 만들기 위해서는 단순히 인스턴스를 생성하는 것만으로는 부족합니다. 인스턴스가 위치한 네트워크 공간이 외부 트래픽을 받을 수 있도록 설계된 서브넷이어야 합니다. 이 문제에서는, 이후 웹 서버를 배치하기 위한 준비 단계로 VPC 내부에 퍼블릭 서브넷을 하나 생성합니다.',
      required_fields: [
        {
          service: 'Subnet',
          service_task: 'public-subnet-create',
          service_sections: ['general', 'public_access'],
          fixed_options: {
            general: {
              vpc_id: {
                placeholder: '서브넷을 생성할 VPC를 선택하세요.',
                helper_text: '서브넷은 반드시 하나의 VPC에 속해야 합니다.',
                required: true,
              },
              cidr_block: {
                placeholder: 'x.x.x.x/x',
                helper_text: 'VPC CIDR 범위 안에 포함되어야 합니다.',
                required: true,
              },
            },
            public_access: {
              map_public_ip_on_launch: {
                value: true,
                helper_text: '퍼블릭 IP 자동 할당을 활성화합니다.',
              },
            },
          },
        },
      ],
      tags: [
        tagMap.get('Subnet')!,
        tagMap.get('Public')!,
        tagMap.get('VPC')!,
        tagMap.get('네트워크')!,
      ],
    },
    {
      problem_type: ProblemType.UNIT,
      title: 'Internet Gateway 연결하기',
      description: '기존 VPC에 Internet Gateway를 하나 생성하고 연결하세요',
      desc_detail:
        'VPC와 서브넷을 생성했다고 해서 자동으로 인터넷과 통신할 수 있는 것은 아닙니다. VPC 내부의 리소스가 외부와 통신하려면 인터넷으로 나가는 출입구 역할을 하는 리소스가 필요합니다. Internet Gateway는 VPC 단위로 연결되는 리소스로, 외부 인터넷과 VPC를 연결하는 필수 전제 조건입니다. 기존 VPC에 Internet Gateway를 하나 생성하고 연결하세요.',
      required_fields: [
        {
          service: 'InternetGateway',
          service_task: 'igw-attach',
          service_sections: ['general'],
          fixed_options: {
            general: {
              vpc_id: {
                placeholder: 'Internet Gateway를 연결할 VPC를 선택하세요',
                helper_text: 'Internet Gateway는 VPC 단위로 연결됩니다',
                required: true,
              },
            },
          },
        },
      ],
      tags: [
        tagMap.get('Internet Gateway')!,
        tagMap.get('IGW')!,
        tagMap.get('VPC')!,
        tagMap.get('네트워크')!,
      ],
    },
    {
      problem_type: ProblemType.UNIT,
      title: '라우팅 테이블 설정하기',
      description:
        '퍼블릭 서브넷의 기본 트래픽이 Internet Gateway로 향하도록 라우팅 테이블을 설정하세요',
      desc_detail:
        '퍼블릭 서브넷과 Internet Gateway를 생성했더라도, 아직 외부 인터넷과 실제로 통신할 수 있는 상태는 아닙니다. 네트워크 트래픽은 명시된 경로(Route)가 없으면 어디로 가야 할지 알 수 없습니다. 라우팅 테이블은 이 서브넷에서 발생한 트래픽을 어디로 보낼 것인가를 정의하는 설정입니다. 퍼블릭 서브넷의 기본 트래픽이 Internet Gateway로 향하도록 라우팅 테이블을 설정하세요.',
      required_fields: [
        {
          service: 'RouteTable',
          service_task: 'route-table-configure',
          service_sections: ['general', 'routes', 'subnet_associations'],
          fixed_options: {
            general: {
              vpc_id: {
                placeholder: '라우팅 테이블을 생성할 VPC를 선택하세요.',
                helper_text: '라우팅 테이블은 VPC 단위로 관리됩니다.',
                required: true,
              },
            },
            routes: {
              destination_cidr_block: {
                placeholder: '예: 0.0.0.0/0',
                helper_text: '모든 외부 트래픽을 의미하는 기본 경로입니다',
                required: true,
              },
              gateway_id: {
                placeholder: 'Internet Gateway 선택',
                helper_text: '외부 인터넷으로 나가기 위한 대상입니다',
                required: true,
              },
            },
            subnet_associations: {
              subnet_id: {
                helper_text: '이 라우팅 테이블을 적용할 서브넷을 선택하세요',
                required: true,
              },
            },
          },
        },
      ],
      tags: [
        tagMap.get('Route Table')!,
        tagMap.get('Routing')!,
        tagMap.get('IGW')!,
        tagMap.get('네트워크')!,
      ],
    },
    {
      problem_type: ProblemType.UNIT,
      title: 'test unit',
      description: 'test용 문제',
      desc_detail: 'test용 문제입니다.',
      required_fields: [
        {
          service: 'CloudFront',
          service_task: 'origin-settings',
          fixed_options: {},
          service_sections: ['originDomain', 'originAccessControl'],
        },
      ],
      tags: [
        tagMap.get('VPC')!,
        tagMap.get('CIDR')!,
        tagMap.get('네트워크')!,
        tagMap.get('기초')!,
      ],
    },
    {
      problem_type: ProblemType.UNIT,
      title: 'test unit 2',
      description: '서비스 2개 테스트용',
      desc_detail: '서비스 2개 테스트용입니다.',
      required_fields: [
        {
          service: 'CloudFront',
          service_task: 'origin-settings',
          fixed_options: {},
          service_sections: ['originDomain', 'originAccessControl'],
        },
        {
          service: 'S3',
          service_task: 'bucket-create',
          fixed_options: {},
          service_sections: ['ownership', 'versioning'],
        },
      ],

      tags: [
        tagMap.get('VPC')!,
        tagMap.get('CIDR')!,
        tagMap.get('네트워크')!,
        tagMap.get('기초')!,
      ],
    },
  ];

  for (const problemData of problems) {
    await problemRepository.save(problemData as any);
  }

  console.log('Problems seeded successfully');
}
