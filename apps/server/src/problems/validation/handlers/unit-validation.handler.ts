import { ProblemValidationHandler } from './validation.handler';
import { SubmitResponseDto } from 'src/problems/dto/submit-response.dto';
import { SubmitRequestDto } from 'src/problems/dto/submit-request.dto';
import { ProblemType } from '../../types/problem-type.enum';
import type { ProblemData } from './validation.handler';
import type {
  UnitProblemValidateResult,
  UnitProblemValidateResultEntry,
} from '../../types/unit-problem-validate-results';
import {
  UnitProblemFeedbackType,
  feedbackMessages,
} from '../../types/unit-problem-feedback-types';
import type { FeedbackDto } from '../../dto/submit-response.dto';
import { FieldValidationHandler } from './field-validation.handler';
import { Injectable } from '@nestjs/common';
import { containsCidr } from '../utils/cidr-utils';
import { ServiceConfigTypes } from 'src/problems/types/service-config-type.enum';

@Injectable()
export class UnitValidationHandler implements ProblemValidationHandler {
  constructor(private readonly fieldValidationHandler: FieldValidationHandler) {
    this.fieldValidationHandler = fieldValidationHandler;
  }
  support(problemType: ProblemType): boolean {
    return problemType === ProblemType.UNIT;
  }

  // unit 문제는 networkTask가 필요 없음.
  validate(
    submitRequestDto: SubmitRequestDto,
    problemData: ProblemData,
  ): SubmitResponseDto {
    if (!problemData || !submitRequestDto.submitConfig) {
      throw new Error('문제가 존재하지 않거나 제출된 설정이 없습니다.');
    }
    if (submitRequestDto.networkTask) {
      throw new Error('Unit 문제에는 networkTask가 필요하지 않습니다.');
    }
    const solutionConfig = problemData.solution;
    const submitConfig = submitRequestDto.submitConfig;

    const mismatchedConfigs = {};
    for (const key in solutionConfig) {
      const { onlyInAnswer, onlyInSolution } = this.checkDifference(
        submitConfig[key],
        solutionConfig[key],
        key,
      );
      if (onlyInAnswer.length > 0 || onlyInSolution.length > 0) {
        mismatchedConfigs[key] = { onlyInAnswer, onlyInSolution };
      }
    }

    const feedbacks = this.generateFeedbackMessage(
      mismatchedConfigs as UnitProblemValidateResult,
    );

    const fieldFeedbacks =
      this.fieldValidationHandler.validate(submitRequestDto);
    feedbacks.push(...fieldFeedbacks);

    return {
      result: Object.keys(mismatchedConfigs).length === 0 ? 'PASS' : 'FAIL',
      feedback: feedbacks,
    };
  }

  // 같은 것 제외하고 남은 차이점만 골라내기
  // onlyInAnswer: 제출 답안에만 있는 설정들. 정답에 없는 필요 없는 설정들
  // onlyInSolution: 정답에만 있는 설정들. 제출 답안에 없는 필수 설정들
  private checkDifference(
    answerConfigs: ServiceConfigTypes[],
    solutionConfigs: ServiceConfigTypes[],
    serviceKey: string,
  ): {
    onlyInAnswer: ServiceConfigTypes[];
    onlyInSolution: ServiceConfigTypes[];
  } {
    const answer = [...answerConfigs];
    const solution = [...solutionConfigs];

    const matchedAnswerIndices = new Set<number>();
    const matchedSolutionIndices = new Set<number>();

    for (let i = 0; i < answer.length; i++) {
      if (matchedAnswerIndices.has(i)) continue;

      for (let j = 0; j < solution.length; j++) {
        if (matchedSolutionIndices.has(j)) continue;
        if (
          (serviceKey === 'vpc' || serviceKey === 'subnet') &&
          'cidrBlock' in answer[i] &&
          'cidrBlock' in solution[j]
        ) {
          // CIDR의 경우 포함되면 같은 것으로 간주
          const answerCidr = answer[i]['cidrBlock'] as string;
          const solutionCidr = solution[j]['cidrBlock'] as string;
          if (
            containsCidr(solutionCidr, answerCidr) ||
            solutionCidr === 'DONT_CARE'
          ) {
            matchedAnswerIndices.add(i);
            matchedSolutionIndices.add(j);
            break;
          }
        } else if (this.isDeepEqual(answer[i], solution[j])) {
          matchedAnswerIndices.add(i);
          matchedSolutionIndices.add(j);
          break;
        }
      }
    }

    const onlyInAnswer = answer.filter((_, i) => !matchedAnswerIndices.has(i));
    const onlyInSolution = solution.filter(
      (_, i) => !matchedSolutionIndices.has(i),
    );

    return {
      onlyInAnswer,
      onlyInSolution,
    };
  }

  private generateFeedbackMessage(
    validationInfo: UnitProblemValidateResult,
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    const serviceKeys = Object.keys(
      validationInfo,
    ) as (keyof UnitProblemValidateResult)[];

    for (const serviceKey of serviceKeys) {
      const { onlyInAnswer, onlyInSolution } = validationInfo[
        serviceKey
      ] as UnitProblemValidateResultEntry;

      // 만약 정답보다 적은 서비스 구성했다면 -> 누락된 서비스 피드백
      const serviceMissingFeedback = this.generateServiceMissingFeedback(
        onlyInAnswer,
        onlyInSolution,
        serviceKey,
      );
      if (serviceMissingFeedback) {
        feedbacks.push(serviceMissingFeedback as FeedbackDto);
      }

      for (const submittedConfig of onlyInAnswer) {
        const serviceName = submittedConfig.name;
        const matchedSolutionConfig = this.findServiceByName(
          onlyInSolution,
          serviceName,
        );
        if (!matchedSolutionConfig) {
          // 매칭되는 솔루션이 없으면 다음으로
          continue;
        }

        // 만약 제출 설정의 필드가 더 적다면 -> 누락된 필드 피드백
        const fieldMissingFeedback = this.generateFieldMissingFeedback(
          submittedConfig,
          matchedSolutionConfig,
          serviceKey,
        );
        if (fieldMissingFeedback) {
          feedbacks.push(fieldMissingFeedback as FeedbackDto);
        }

        // 만약 더 많다면 -> 불필요한 필드 피드백
        const unnecessaryFieldFeedback = this.generateUnnecessaryFieldFeedback(
          submittedConfig,
          matchedSolutionConfig,
          serviceKey,
        );
        if (unnecessaryFieldFeedback) {
          feedbacks.push(unnecessaryFieldFeedback as FeedbackDto);
        }
        // 값이 다르다면 -> 올바르지 않은 값 피드백
        const incorrectValueFeedback = this.generateIncorrectValueFeedback(
          submittedConfig,
          matchedSolutionConfig,
          serviceKey,
        );
        if (incorrectValueFeedback) {
          feedbacks.push(incorrectValueFeedback as FeedbackDto);
        }
      }
    }
    return feedbacks;
  }

  private generateServiceMissingFeedback(
    onlyInAnswer: ServiceConfigTypes[],
    onlyInSolution: ServiceConfigTypes[],
    serviceKey: string,
  ) {
    const missingServicesCount = onlyInSolution.length - onlyInAnswer.length;
    if (missingServicesCount > 0) {
      return {
        field: serviceKey,
        code: UnitProblemFeedbackType.SERVICE_MISSING,
        message: feedbackMessages[UnitProblemFeedbackType.SERVICE_MISSING](
          serviceKey,
          `${missingServicesCount}개의 서비스 설정이 누락되었습니다.`,
        ),
      };
    } else {
      return null;
    }
  }

  private generateFieldMissingFeedback(
    submittedConfig: ServiceConfigTypes,
    solutionConfig: ServiceConfigTypes,
    serviceKey: string,
  ) {
    const submittedKeys = Object.keys(submittedConfig);
    const solutionKeys = Object.keys(solutionConfig);
    const missingFields = solutionKeys.filter(
      (key) => !submittedKeys.includes(key),
    );

    if (
      missingFields.length > 0 &&
      solutionKeys.length > submittedKeys.length
    ) {
      return {
        field: serviceKey,
        code: UnitProblemFeedbackType.FIELD_MISSING,
        message: feedbackMessages[UnitProblemFeedbackType.FIELD_MISSING](
          serviceKey,
          missingFields.join(', '),
        ),
      };
    } else {
      return null;
    }
  }

  private generateUnnecessaryFieldFeedback(
    submittedConfig: ServiceConfigTypes,
    solutionConfig: ServiceConfigTypes,
    serviceKey: string,
  ) {
    const submittedKeys = Object.keys(submittedConfig);

    const solutionKeys = Object.keys(solutionConfig);
    const unnecessaryFields = submittedKeys.filter(
      (key) => !solutionKeys.includes(key),
    );
    if (
      unnecessaryFields.length > 0 &&
      submittedKeys.length > solutionKeys.length
    ) {
      return {
        field: serviceKey,
        code: UnitProblemFeedbackType.UNNECESSARY,
        message: feedbackMessages[UnitProblemFeedbackType.UNNECESSARY](
          serviceKey,
          unnecessaryFields.join(', '),
        ),
      };
    } else {
      return null;
    }
  }

  private generateIncorrectValueFeedback(
    submittedConfig: ServiceConfigTypes,
    solutionConfig: ServiceConfigTypes,
    serviceKey: string,
  ) {
    const incorrectFields: string[] = [];
    const submittedKeys = Object.keys(submittedConfig);
    const solutionKeys = Object.keys(solutionConfig);
    const commonKeys = submittedKeys.filter((key) =>
      solutionKeys.includes(key),
    );
    for (const key of commonKeys) {
      if (!this.isDeepEqual(submittedConfig[key], solutionConfig[key])) {
        incorrectFields.push(key);
      }
    }

    if (incorrectFields.length > 0) {
      return {
        field: serviceKey,
        code: UnitProblemFeedbackType.INCORRECT,
        message: feedbackMessages[UnitProblemFeedbackType.INCORRECT](
          serviceKey,
          incorrectFields.join(', '),
        ),
      };
    } else {
      return null;
    }
  }

  private findServiceByName(
    serviceConfigs: ServiceConfigTypes[],
    serviceName: string,
  ): ServiceConfigTypes | undefined {
    for (const config of serviceConfigs) {
      if (
        typeof config === 'object' &&
        config !== null &&
        'name' in config &&
        config['name'] === serviceName
      ) {
        return config;
      }
    }
    return undefined;
  }

  private isDeepEqual(obj1: unknown, obj2: unknown): boolean {
    // 1. 참조가 같으면 true
    if (obj1 === obj2) return true;

    // 2. null 체크 및 타입 불일치 체크
    if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2) {
      return false;
    }

    // 3. 원시 타입(Primitive) 비교
    if (typeof obj1 !== 'object') {
      return obj1 === obj2 || obj2 === 'DONT_CARE';
    }

    // 4. Date 객체 처리
    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }

    // 5. 배열 처리
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => this.isDeepEqual(item, obj2[index]));
    }

    // 한쪽만 배열인 경우
    if (Array.isArray(obj1) || Array.isArray(obj2)) {
      return false;
    }

    // 6. 일반 객체 비교
    const o1 = obj1 as Record<string, unknown>;
    const o2 = obj2 as Record<string, unknown>;

    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      if (!Object.prototype.hasOwnProperty.call(o2, key)) return false;

      // 재귀 호출
      return this.isDeepEqual(o1[key], o2[key]);
    });
  }
}
