import { DataSource } from 'typeorm';
import { Solution } from '../entities/solution.entity';
import { Problem } from '../entities/problem.entity';

export async function seedSolutions(dataSource: DataSource): Promise<void> {
  const solutionRepository = dataSource.getRepository(Solution);
  const problemRepository = dataSource.getRepository(Problem);

  // 문제들을 title 순서로 가져오기
  const problems = await problemRepository.find({
    order: { id: 'ASC' },
  });

  if (problems.length < 5) {
    throw new Error('Not enough problems found. Please seed problems first.');
  }

  const solutions = [
    {
      problem: problems[0], // 충분히 넓은 VPC 네트워크 만들기
      answer_config: {
        vpc: {
          cidr_block: '10.0.0.0/16',
        },
      },
    },
    {
      problem: problems[1], // VPC 안에 포함되는 Subnet 생성하기
      answer_config: {
        subnet: {
          vpc_id: '@vpc',
          cidr_block: '10.0.1.0/24',
        },
      },
    },
    {
      problem: problems[2], // 퍼블릭 서브넷 생성하기
      answer_config: {
        subnet: {
          vpc_id: '@vpc',
          cidr_block: '10.0.2.0/24',
          map_public_ip_on_launch: true,
        },
      },
    },
    {
      problem: problems[3], // Internet Gateway 연결하기
      answer_config: {
        internet_gateway: {
          vpc_id: '@vpc',
        },
      },
    },
    {
      problem: problems[4], // 라우팅 테이블 설정하기
      answer_config: {
        route_table: {
          vpc_id: '@vpc',
        },
        route: {
          destination_cidr_block: '0.0.0.0/0',
          gateway_id: '@internet_gateway',
        },
        route_table_association: {
          subnet_id: '@subnet',
          route_table_id: '@route_table',
        },
      },
    },
  ];

  for (const solutionData of solutions) {
    await solutionRepository.save(solutionData);
  }

  console.log('Solutions seeded successfully');
}
