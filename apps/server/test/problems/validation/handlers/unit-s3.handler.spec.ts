import { Test, TestingModule } from '@nestjs/testing';
import { S3ScenarioHandler } from '@/problems/validation/handlers/unit-service-specific-validation/unit-s3-scenario.handler';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { S3Requirements } from '@/problems/types/requirements-types';
import { S3FeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';

describe('S3ScenarioHandler', () => {
  let handler: S3ScenarioHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3ScenarioHandler],
    }).compile();

    handler = module.get<S3ScenarioHandler>(S3ScenarioHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  // --- [Case 1] Happy Path ---
  it('모든 보안 요구사항(암호화, 퍼블릭차단, 버전관리)을 충족하면 피드백이 없어야 한다', () => {
    const config: SubmitConfig = {
      s3: [
        {
          id: 'b-1',
          name: 'secure-bucket',
          serverSideEncryption: true,
          publicAccessBlockEnabled: true,
          versioningEnabled: true,
        } as any,
      ],
    };

    const reqs: S3Requirements = {
      s3: {
        'secure-bucket': {
          requireEncryption: true,
          requirePublicAccessBlock: true,
          requireVersioning: true,
        },
      },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(0);
  });

  // --- [Case 2] Encryption Missing ---
  it('암호화 설정이 누락되면 BUCKET_NOT_ENCRYPTED 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      s3: [
        {
          id: 'b-1',
          name: 'data-bucket',
          serverSideEncryption: false, // Missing
        },
      ],
    };
    const reqs: S3Requirements = {
      s3: { 'data-bucket': { requireEncryption: true } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(S3FeedbackScenarios.BUCKET_NOT_ENCRYPTED);
  });

  // --- [Case 3] Public Access Block Missing ---
  it('퍼블릭 액세스 차단이 꺼져있으면 BUCKET_PUBLIC_ACCESS_BLOCK_MISSING 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      s3: [
        {
          id: 'b-1',
          name: 'private-bucket',
          publicAccessBlockEnabled: false, // Missing
        },
      ],
    };
    const reqs: S3Requirements = {
      s3: { 'private-bucket': { requirePublicAccessBlock: true } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(
      S3FeedbackScenarios.BUCKET_PUBLIC_ACCESS_BLOCK_MISSING,
    );
  });

  // --- [Case 4] Versioning Disabled ---
  it('버전 관리가 비활성화되어 있으면 BUCKET_VERSIONING_DISABLED 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      s3: [
        {
          id: 'b-1',
          name: 'versioned-bucket',
          versioningEnabled: false, // Disabled
        },
      ],
    };
    const reqs: S3Requirements = {
      s3: { 'versioned-bucket': { requireVersioning: true } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(S3FeedbackScenarios.BUCKET_VERSIONING_DISABLED);
  });
});
