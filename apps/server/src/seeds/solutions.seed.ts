import { DataSource } from 'typeorm';
import { Solution } from '../entities/solution.entity';
import { Problem } from '../entities/problem.entity';

export async function seedSolutions(dataSource: DataSource): Promise<void> {
  const solutionRepository = dataSource.getRepository(Solution);
  const problemRepository = dataSource.getRepository(Problem);

  const problems = await problemRepository.find({
    order: { id: 'ASC' },
  });

  if (problems.length < 5) {
    console.log('Not enough problems found. Skipping solution seeding.');
    return;
  }

  // Common DONT_CARE Templates
  const s3DontCareConfig = {
    id: 'DONT_CARE',
    name: 'DONT_CARE',
    region: 'DONT_CARE',
    aclEnabled: 'DONT_CARE',
    ownershipModel: 'DONT_CARE',
    blockAll: 'DONT_CARE',
    blockPublicAcls: 'DONT_CARE',
    ignorePublicAcls: 'DONT_CARE',
    blockPublicPolicy: 'DONT_CARE',
    objectLockEnabled: 'DONT_CARE',
    restrictPublicBuckets: 'DONT_CARE',
    encryptionType: 'DONT_CARE',
    versioningEnabled: 'DONT_CARE',
    tags: 'DONT_CARE',
  };

  const ec2DontCareConfig = {
    id: 'DONT_CARE',
    name: 'DONT_CARE',
    vpcName: 'DONT_CARE',
    subnetName: 'DONT_CARE',
    osType: 'DONT_CARE',
    instanceType: 'DONT_CARE',
    keyName: 'DONT_CARE',
    autoAssignPublicIp: 'DONT_CARE',
    allowSSH: 'DONT_CARE',
    allowHTTPS: 'DONT_CARE',
    allowHTTP: 'DONT_CARE',
    storageSize: 'DONT_CARE',
    volumeType: 'DONT_CARE',
  };

  const cloudFrontDontCareConfig = {
    id: 'DONT_CARE',
    name: 'DONT_CARE',
    originType: 'DONT_CARE',
    selectedBucket: 'DONT_CARE',
    customDomain: 'DONT_CARE',
    originPath: 'DONT_CARE',
    accessControl: 'DONT_CARE',
    oacName: 'DONT_CARE',
    distributionName: 'DONT_CARE',
    description: 'DONT_CARE',
    enabled: 'DONT_CARE',
    priceClass: 'DONT_CARE',
    cnames: 'DONT_CARE',
    sslCertificate: 'DONT_CARE',
    acmCertificateArn: 'DONT_CARE',
    minTlsVersion: 'DONT_CARE',
    ipv6Enabled: 'DONT_CARE',
    viewerProtocolPolicy: 'DONT_CARE',
    allowedMethods: 'DONT_CARE',
    cachePolicy: 'DONT_CARE',
    managedPolicyName: 'DONT_CARE',
    customTTL: 'DONT_CARE',
    compressionEnabled: 'DONT_CARE',
    viewerRequestFunction: 'DONT_CARE',
    viewerResponseFunction: 'DONT_CARE',
    defaultRootObject: 'DONT_CARE',
    errorResponses: 'DONT_CARE',
    loggingEnabled: 'DONT_CARE',
    loggingBucket: 'DONT_CARE',
    logPrefix: 'DONT_CARE',
    wafEnabled: 'DONT_CARE',
    webAclId: 'DONT_CARE',
  };

  const solutions = [
    {
      problem: problems[0], // 로그 저장용 S3 버킷 생성
      answerConfig: {
        s3: [
          {
            ...s3DontCareConfig,
            name: 'my-log-bucket', // 필수 조건
          },
        ],
      },
    },
    {
      problem: problems[1], // S3 버킷 버전 관리 활성화
      answerConfig: {
        s3: [
          {
            ...s3DontCareConfig,
            versioningEnabled: true, // 필수 조건
          },
        ],
      },
    },
    {
      problem: problems[2], // CloudFront 원본 설정
      answerConfig: {
        cloudFront: [
          {
            ...cloudFrontDontCareConfig,
            originType: 's3',
            // originDomain 관련 필드는 현재 프론트 DTO와 매칭 필요 (임시로 DONT_CARE 유지)
          },
        ],
      },
    },
    {
      problem: problems[3], // 웹 서버용 EC2 인스턴스 생성
      answerConfig: {
        ec2: [
          {
            ...ec2DontCareConfig,
            instanceType: 't2.micro', // 필수 조건
          },
        ],
      },
    },
    {
      problem: problems[4], // 정적 웹사이트 글로벌 배포 (S3 + CloudFront)
      answerConfig: {
        s3: [
          {
            ...s3DontCareConfig,
            name: 'my-global-site', // 문제의 필수 조건
          },
        ],
        cloudFront: [
          {
            ...cloudFrontDontCareConfig,
            originType: 's3',
          },
        ],
      },
    },
    {
      problem: problems[5], // S3 버킷 생성하기 (Unit)
      answerConfig: {
        s3: [
          {
            ...s3DontCareConfig, // 특별한 조건 없음 (기본 생성)
          },
        ],
      },
    },
    {
      problem: problems[6], // EC2 인스턴스 생성하기 (Unit)
      answerConfig: {
        ec2: [
          {
            ...ec2DontCareConfig, // 특별한 조건 없음 (기본 생성)
          },
        ],
      },
    },
  ];

  for (const solutionData of solutions) {
    if (!solutionData.problem) continue; // 문제 데이터가 없으면 스킵
    await solutionRepository.save(solutionData);
  }

  console.log('Solutions seeded successfully');
}
