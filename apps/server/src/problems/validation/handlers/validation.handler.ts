import {
  SubmitRequestDto,
  SubmitConfig,
} from 'src/problems/dto/submit-request.dto';
import { SubmitResponseDto } from 'src/problems/dto/submit-response.dto';
import { ProblemType } from 'src/problems/types/problem-type.enum';
import { FeedbackDto } from 'src/problems/dto/submit-response.dto';

export type ProblemData = {
  solution: SubmitConfig;
  problemType: ProblemType;
};

export interface ProblemValidationHandler {
  /**
   * 문제 타입(ex. unit)에 대해 핸들러가 지원되는지 여부를 반환하는 메서드
   * @param problemType 문제 타입
   * @returns 지원 여부 (true/false)
   */
  support(problemType: ProblemType): boolean;

  /**
   * 제출된 풀이를 검증하고 결과를 반환하는 메서드
   * @param submitRequsestDto 검증에 필요한 제출 요청 데이터
   * @param problemData 문제의 정답 데이터 및 메타데이터
   * @returns 제출 검증 결과: 피드백 포함
   */
  validate(
    submitRequsestDto: SubmitRequestDto,
    problemData: ProblemData,
  ): SubmitResponseDto;
}

export interface ValidationHandler {
  validate(submitRequsestDto: SubmitRequestDto): FeedbackDto[];
}
