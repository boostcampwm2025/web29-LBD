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
    console.log('Not enough problems found. Skipping solution seeding.');
    return;
  }

  const solutions = [
    {
      problem: problems[0], // 로그 저장용 S3 버킷 생성
      answerConfig: {
        s3: [
          {
            name: 'my-log-bucket',
            region: 'DONT_CARE',
          },
        ],
      },
    },
    {
      problem: problems[1], // S3 버킷 버전 관리 활성화
      answerConfig: {
        s3: [
          {
            name: 'DONT_CARE',
            region: 'DONT_CARE',
            versioningEnabled: true,
          },
        ],
      },
    },
    {
      problem: problems[2], // CloudFront 원본 설정
      answerConfig: {
        cloudFront: [
          {
            // 현재 타입 정의가 없음
            // originDomain: {
            //   domainName: 'my-bucket.s3.amazonaws.com',
            // },
            // originAccessControl: {
            //   signingBehavior: 'always',
            // },
          },
        ],
      },
    },
    {
      problem: problems[3], // 웹 서버용 EC2 인스턴스 생성
      answerConfig: {
        ec2: [
          {
            instanceType: 't2.micro',
          },
        ],
      },
    },
    {
      problem: problems[4], // 정적 웹사이트 글로벌 배포 (S3 + CloudFront)
      answerConfig: {
        s3: [
          {
            name: 'DONT_CARE',
            region: 'DONT_CARE',
          },
        ],
        cloudFront: [
          // 타입 정의 후 추가
        ],
      },
    },
    {
      problem: problems[5], // S3 버킷 생성하기
      answerConfig: {
        s3: [
          {
            id: 'my-first-bucket',
            name: 'my-first-bucket',
            region: 'ap-northeast-2',
            aclEnabled: 'disabled',
            blockAll: true,
            blockPublicAcls: true,
            ignorePublicAcls: true,
            blockPublicPolicy: true,
            restrictPublicBuckets: true,
          },
        ],
      },
    },
  ];

  for (const solutionData of solutions) {
    await solutionRepository.save(solutionData);
  }

  console.log('Solutions seeded successfully');
}
