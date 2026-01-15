import { ValidationHandler } from './validation.handler';
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

export class UnitValidationHandler implements ValidationHandler {
  support(problemType: ProblemType): boolean {
    return problemType === ProblemType.UNIT;
  }

  // unit 문제는 networkTask가 필요 없음.
  // TODO: feedback 생성하는 로직 작성 후 이 메서드에서 사용하기
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
    // 만약 키가 다르면, 즉 구성한 서비스 종류가 다르면 바로 틀림 처리
    if (
      !this.isDeepEqual(Object.keys(submitConfig), Object.keys(solutionConfig))
    ) {
      return {
        result: 'FAIL',
        feedback: [],
      };
    }
    const mismatchedConfigs = {};
    for (const key in solutionConfig) {
      const { onlyInAnswer, onlyInSolution } = this.checkDifference(
        submitConfig[key],
        solutionConfig[key],
      );
      if (onlyInAnswer.length > 0 || onlyInSolution.length > 0) {
        mismatchedConfigs[key] = { onlyInAnswer, onlyInSolution };
      }
    }

    // 만약 다른 설정 없음? -> 통과
    if (Object.keys(mismatchedConfigs).length === 0) {
      // 통과
      return {
        result: 'PASS',
        feedback: [],
      };
    }

    // 아니면 정답과 일치하지 않는 설정들 -> 틀림
    return {
      result: 'FAIL',
      feedback: [],
    };
  }

  // 같은 것 제외하고 남은 차이점만 골라내기
  // onlyInAnswer: 제출 답안에만 있는 설정들. 정답에 없는 필요 없는 설정들
  // onlyInSolution: 정답에만 있는 설정들. 제출 답안에 없는 필수 설정들
  // 나중에 unknown 타입 서비스 union으로 변경하기
  private checkDifference(
    answerConfigs: unknown[],
    solutionConfigs: unknown[],
  ): { onlyInAnswer: unknown[]; onlyInSolution: unknown[] } {
    const answer = [...answerConfigs];
    const solution = [...solutionConfigs];

    const matchedAnswerIndices = new Set<number>();
    const matchedSolutionIndices = new Set<number>();

    for (let i = 0; i < answer.length; i++) {
      if (matchedAnswerIndices.has(i)) continue;

      for (let j = 0; j < solution.length; j++) {
        if (matchedSolutionIndices.has(j)) continue;

        if (this.isDeepEqual(answer[i], solution[j])) {
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
        const serviceName = (submittedConfig as Record<string, unknown>)
          .name as string;
        const matchedSolutionConfig = this.findServiceByName(
          onlyInSolution,
          serviceName,
        );

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
    onlyInAnswer: unknown[],
    onlyInSolution: unknown[],
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
    submittedConfig: unknown,
    solutionConfig: unknown,
    serviceKey: string,
  ) {
    const submittedKeys = Object.keys(
      submittedConfig as Record<string, unknown>,
    );
    const solutionKeys = Object.keys(solutionConfig as Record<string, unknown>);
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
    submittedConfig: unknown,
    solutionConfig: unknown,
    serviceKey: string,
  ) {
    const submittedKeys = Object.keys(
      submittedConfig as Record<string, unknown>,
    );
    const solutionKeys = Object.keys(solutionConfig as Record<string, unknown>);
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
    submittedConfig: unknown,
    solutionConfig: unknown,
    serviceKey: string,
  ) {
    const incorrectFields: string[] = [];
    const submittedKeys = Object.keys(
      submittedConfig as Record<string, unknown>,
    );
    const solutionKeys = Object.keys(solutionConfig as Record<string, unknown>);
    const commonKeys = submittedKeys.filter((key) =>
      solutionKeys.includes(key),
    );
    for (const key of commonKeys) {
      if (
        !this.isDeepEqual(
          (submittedConfig as Record<string, unknown>)[key],
          (solutionConfig as Record<string, unknown>)[key],
        )
      ) {
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
    serviceConfigs: unknown[],
    serviceName: string,
  ): unknown {
    for (const config of serviceConfigs) {
      if (
        typeof config === 'object' &&
        config !== null &&
        'name' in config &&
        (config as Record<string, unknown>)['name'] === serviceName
      ) {
        return config as unknown;
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
      return obj1 === obj2;
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
