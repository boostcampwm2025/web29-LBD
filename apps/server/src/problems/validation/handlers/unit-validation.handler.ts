import { Injectable } from '@nestjs/common';
import { ProblemValidationHandler, ProblemData } from './validation.handler';
import { FieldValidationHandler } from './field-validation.handler';
import { SubmitResponseDto } from 'src/problems/dto/submit-response.dto';
import { SubmitRequestDto } from 'src/problems/dto/submit-request.dto';
import { FeedbackDto } from '../../dto/submit-response.dto';
import { ProblemType } from '../../types/problem-type.enum';
import {
  ServiceConfigTypes,
  SubnetConfig,
  VPCConfig,
} from 'src/problems/types/service-config-type.enum';
import { UnitProblemValidateResult } from '../../types/unit-problem-validate-results';
import {
  UnitProblemFeedbackType,
  feedbackMessages,
} from '../../types/unit-problem-feedback-types';
import { containsCidr } from '../utils/cidr-utils';

@Injectable()
export class UnitValidationHandler implements ProblemValidationHandler {
  constructor(
    private readonly fieldValidationHandler: FieldValidationHandler,
  ) {}

  support(problemType: ProblemType): boolean {
    return problemType === ProblemType.UNIT;
  }

  validate(
    submitRequestDto: SubmitRequestDto,
    problemData: ProblemData,
  ): SubmitResponseDto {
    const { submitConfig, networkTask } = submitRequestDto;

    // 1. 사전 검증 (Guard Clause)
    if (!problemData || !submitConfig) {
      throw new Error('문제가 존재하지 않거나 제출된 설정이 없습니다.');
    }
    if (networkTask) {
      throw new Error('Unit 문제에는 networkTask가 필요하지 않습니다.');
    }

    const solutionConfig = problemData.solution;
    const mismatchedConfigs: Partial<UnitProblemValidateResult> = {};

    // 2. 서비스별 설정 비교 (Diffing)
    for (const serviceKey in solutionConfig) {
      const diffResult = this.diffServiceConfigs(
        submitConfig[serviceKey] || [],
        solutionConfig[serviceKey] || [],
        serviceKey,
      );

      if (
        diffResult.onlyInAnswer.length > 0 ||
        diffResult.onlyInSolution.length > 0
      ) {
        mismatchedConfigs[serviceKey] = diffResult;
      }
    }

    // 3. 피드백 생성 (Generation)
    const feedbacks = this.generateFeedbacks(
      mismatchedConfigs as UnitProblemValidateResult,
    );

    // 4. 필드 단위 심층 검증 (Deep Validation)
    const fieldFeedbacks =
      this.fieldValidationHandler.validate(submitRequestDto);
    feedbacks.push(...fieldFeedbacks);

    return {
      result: Object.keys(mismatchedConfigs).length === 0 ? 'PASS' : 'FAIL',
      feedback: feedbacks,
    };
  }

  private diffServiceConfigs(
    answerConfigs: ServiceConfigTypes[],
    solutionConfigs: ServiceConfigTypes[],
    serviceKey: string,
  ): {
    onlyInAnswer: ServiceConfigTypes[];
    onlyInSolution: ServiceConfigTypes[];
  } {
    const matchedAnswerIndices = new Set<number>();
    const matchedSolutionIndices = new Set<number>();

    for (let i = 0; i < answerConfigs.length; i++) {
      for (let j = 0; j < solutionConfigs.length; j++) {
        if (matchedAnswerIndices.has(i)) break;
        if (matchedSolutionIndices.has(j)) continue;

        if (
          this.isConfigMatch(answerConfigs[i], solutionConfigs[j], serviceKey)
        ) {
          matchedAnswerIndices.add(i);
          matchedSolutionIndices.add(j);
        }
      }
    }

    return {
      onlyInAnswer: answerConfigs.filter(
        (_, i) => !matchedAnswerIndices.has(i),
      ),
      onlyInSolution: solutionConfigs.filter(
        (_, i) => !matchedSolutionIndices.has(i),
      ),
    };
  }

  private isConfigMatch(
    answer: ServiceConfigTypes,
    solution: ServiceConfigTypes,
    serviceKey: string,
  ): boolean {
    const isNetworkResource = serviceKey === 'vpc' || serviceKey === 'subnet';
    const hasCidr = 'cidrBlock' in answer && 'cidrBlock' in solution;

    if (isNetworkResource && hasCidr) {
      return this.isVPCorSubnetConfigMatch(answer, solution);
    }

    return this.isDeepEqual(answer, solution);
  }

  private isVPCorSubnetConfigMatch(
    answer: VPCConfig | SubnetConfig,
    solution: VPCConfig | SubnetConfig,
  ): boolean {
    const { cidrBlock: answerCidr, ...answerRest } = answer;
    const { cidrBlock: solutionCidr, ...solutionRest } = solution;

    // 1. CIDR 검증 (포함 관계 확인)
    if (
      solutionCidr !== 'DONT_CARE' &&
      !containsCidr(solutionCidr, answerCidr)
    ) {
      return false;
    }

    // 2. 나머지 필드 검증
    return this.isDeepEqual(answerRest, solutionRest);
  }

  private generateFeedbacks(
    validationInfo: UnitProblemValidateResult,
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const serviceKeys = Object.keys(
      validationInfo,
    ) as (keyof UnitProblemValidateResult)[];

    for (const serviceKey of serviceKeys) {
      const { onlyInAnswer, onlyInSolution } = validationInfo[serviceKey]!;

      // 1. 서비스 누락 (Service Missing)
      feedbacks.push(
        ...this.createServiceMissingFeedbacks(
          onlyInAnswer,
          onlyInSolution,
          serviceKey,
        ),
      );

      const solutionMap = new Map<string, ServiceConfigTypes>();
      for (const config of onlyInSolution) {
        if ('name' in config) {
          solutionMap.set(config.name, config);
        }
      }

      for (const submittedConfig of onlyInAnswer) {
        const matchedSolution = solutionMap.get(submittedConfig.name);
        if (!matchedSolution) continue;

        // 2. 필드 누락 (Field Missing)
        feedbacks.push(
          ...this.createFieldMissingFeedbacks(
            submittedConfig,
            matchedSolution,
            serviceKey,
          ),
        );

        // 3. 불필요한 필드 (Unnecessary Field)
        feedbacks.push(
          ...this.createUnnecessaryFieldFeedbacks(
            submittedConfig,
            matchedSolution,
            serviceKey,
          ),
        );

        // 4. 값 불일치 (Incorrect Value)
        feedbacks.push(
          ...this.createIncorrectValueFeedbacks(
            submittedConfig,
            matchedSolution,
            serviceKey,
          ),
        );
      }
    }
    return feedbacks;
  }

  private createServiceMissingFeedbacks(
    onlyInAnswer: ServiceConfigTypes[],
    onlyInSolution: ServiceConfigTypes[],
    serviceKey: string,
  ): FeedbackDto[] {
    const count = onlyInSolution.length - onlyInAnswer.length;
    if (count <= 0) return [];

    return [
      {
        serviceType: serviceKey,
        code: UnitProblemFeedbackType.SERVICE_MISSING,
        message: feedbackMessages[UnitProblemFeedbackType.SERVICE_MISSING](
          serviceKey,
          `${count}개의 서비스 설정이 누락되었습니다.`,
        ),
      },
    ];
  }

  private createFieldMissingFeedbacks(
    submitted: ServiceConfigTypes,
    solution: ServiceConfigTypes,
    serviceKey: string,
  ): FeedbackDto[] {
    const submittedKeys = Object.keys(submitted);
    const solutionKeys = Object.keys(solution);

    if (solutionKeys.length <= submittedKeys.length) return [];

    return solutionKeys
      .filter((key) => !submittedKeys.includes(key))
      .map((field) => ({
        serviceType: serviceKey,
        service: submitted['name'],
        field,
        code: UnitProblemFeedbackType.FIELD_MISSING,
        message: feedbackMessages[UnitProblemFeedbackType.FIELD_MISSING](
          serviceKey,
          field,
        ),
      }));
  }

  private createUnnecessaryFieldFeedbacks(
    submitted: ServiceConfigTypes,
    solution: ServiceConfigTypes,
    serviceKey: string,
  ): FeedbackDto[] {
    const submittedKeys = Object.keys(submitted);
    const solutionKeys = Object.keys(solution);

    if (submittedKeys.length <= solutionKeys.length) return [];

    return submittedKeys
      .filter((key) => !solutionKeys.includes(key))
      .map((field) => ({
        serviceType: serviceKey,
        service: submitted['name'],
        field,
        code: UnitProblemFeedbackType.UNNECESSARY,
        message: feedbackMessages[UnitProblemFeedbackType.UNNECESSARY](
          serviceKey,
          field,
        ),
      }));
  }

  private createIncorrectValueFeedbacks(
    submitted: ServiceConfigTypes,
    solution: ServiceConfigTypes,
    serviceKey: string,
  ): FeedbackDto[] {
    const submittedKeys = Object.keys(submitted);
    const solutionKeys = Object.keys(solution);
    const commonKeys = submittedKeys.filter((key) =>
      solutionKeys.includes(key),
    );
    const incorrectFields: string[] = [];

    const isNetworkResource = serviceKey === 'vpc' || serviceKey === 'subnet';

    for (const key of commonKeys) {
      if (isNetworkResource && key === 'cidrBlock') {
        const subCidr = submitted[key] as string;
        const solCidr = solution[key] as string;

        if (solCidr === 'DONT_CARE' || containsCidr(solCidr, subCidr)) {
          continue;
        }
      }

      if (!this.isDeepEqual(submitted[key], solution[key])) {
        incorrectFields.push(key);
      }
    }

    return incorrectFields.map((field) => ({
      serviceType: serviceKey,
      service: submitted['name'],
      field,
      code: UnitProblemFeedbackType.INCORRECT,
      message: feedbackMessages[UnitProblemFeedbackType.INCORRECT](
        serviceKey,
        field,
      ),
    }));
  }

  private isDeepEqual(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) return true;
    if (obj2 === 'DONT_CARE') return true;

    if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2) {
      return false;
    }

    if (typeof obj1 !== 'object') {
      return false;
    }

    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => this.isDeepEqual(item, obj2[index]));
    }

    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    const o1 = obj1 as Record<string, unknown>;
    const o2 = obj2 as Record<string, unknown>;
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      if (!Object.prototype.hasOwnProperty.call(o2, key)) return false;
      return this.isDeepEqual(o1[key], o2[key]);
    });
  }
}
