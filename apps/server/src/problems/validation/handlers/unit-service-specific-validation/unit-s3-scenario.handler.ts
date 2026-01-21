import { Injectable } from '@nestjs/common';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { FeedbackDto } from '@/problems/dto/submit-response.dto';
import { S3Requirements } from '@/problems/types/requirements-types';
import { S3FeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';

@Injectable()
export class S3ScenarioHandler {
  validate(
    submitConfig: SubmitConfig,
    requirements: S3Requirements | undefined,
  ): FeedbackDto[] {
    if (!requirements) return [];
    const feedbacks: FeedbackDto[] = [];

    if (requirements.s3) {
      feedbacks.push(
        ...this.validateS3Requirements(submitConfig, requirements.s3),
      );
    }

    return feedbacks;
  }

  private validateS3Requirements(
    config: SubmitConfig,
    reqs: S3Requirements['s3'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const buckets = config.s3 || [];

    for (const [bucketName, req] of Object.entries(reqs ?? {})) {
      const bucket = buckets.find((b) => b.name === bucketName);

      if (!bucket) continue;

      // 1. BUCKET_NOT_ENCRYPTED
      if (req.requireEncryption) {
        if (!bucket.serverSideEncryption) {
          feedbacks.push({
            serviceType: 's3',
            service: bucketName,
            field: 'serverSideEncryption',
            code: S3FeedbackScenarios.BUCKET_NOT_ENCRYPTED,
            message: `S3 버킷 ${bucketName}에 기본 암호화(SSE) 설정이 되어 있지 않습니다.`,
          });
        }
      }

      // 2. BUCKET_PUBLIC_ACCESS_BLOCK_MISSING
      if (req.requirePublicAccessBlock) {
        // 보통 4가지 차단 옵션(BlockPublicAcls 등)을 모두 켜야 안전하다고 판단
        if (!bucket.publicAccessBlockEnabled) {
          feedbacks.push({
            serviceType: 's3',
            service: bucketName,
            field: 'publicAccessBlockEnabled',
            code: S3FeedbackScenarios.BUCKET_PUBLIC_ACCESS_BLOCK_MISSING,
            message: `S3 버킷 ${bucketName}에 '퍼블릭 액세스 차단' 설정이 누락되었습니다. 보안을 위해 활성화하세요.`,
          });
        }
      }

      // 3. BUCKET_VERSIONING_DISABLED
      if (req.requireVersioning) {
        if (!bucket.versioningEnabled) {
          feedbacks.push({
            serviceType: 's3',
            service: bucketName,
            field: 'versioningEnabled',
            code: S3FeedbackScenarios.BUCKET_VERSIONING_DISABLED,
            message: `S3 버킷 ${bucketName}의 버전 관리(Versioning) 기능이 비활성화되어 있습니다.`,
          });
        }
      }
    }

    return feedbacks;
  }
}
