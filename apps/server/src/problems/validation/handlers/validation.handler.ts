import { ConfigDto } from 'src/problems/dto/submit-request.dto';
import { SubmitResponseDto } from 'src/problems/dto/submit-response.dto';
import { ProblemType } from 'src/problems/types/problem-type.enum';

export interface ValidationHandler {
  /**
   * 문제 타입(ex. unit)에 대해 핸들러가 지원되는지 여부를 반환하는 메서드
   * @param problemType 문제 타입
   * @returns 지원 여부 (true/false)
   */
  support(problemType: ProblemType): boolean;

  /**
   * 제출된 풀이를 검증하고 결과를 반환하는 메서드
   * @param submitConfig 제출된 풀이 객체
   * @param problemData 문제의 메타데이터 (우선은 이렇게 둠)
   * @returns 검증 결과 객체
   */
  validate(submitConfig: ConfigDto, problemData: any): SubmitResponseDto;
}
