import { ValidationHandler } from './validation.handler';
import { SubmitResponseDto } from 'src/problems/dto/submit-response.dto';
import { ConfigDto } from 'src/problems/dto/submit-request.dto';
import { ProblemType } from 'src/problems/types/problem-type.enum';

export class UnitValidationHandler implements ValidationHandler {
  support(problemType: ProblemType): boolean {
    return problemType === ProblemType.UNIT;
  }

  validate(submitConfig: ConfigDto, problemData: any): SubmitResponseDto {
    // test 용 검증 로직: 제출한 풀이가 problemData.answer와 일치하는지 확인
    const answer = (submitConfig.configInfo?.answer ?? '') as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const expectedAnswer = problemData.answer as string;

    if (answer === expectedAnswer) {
      return { result: 'PASS', feedback: [] };
    }

    return {
      result: 'FAIL',
      feedback: [
        {
          field: 'answer',
          code: 'WRONG_ANSWER',
          message: '틀렸습니다.',
        },
      ],
    };
  }
}
