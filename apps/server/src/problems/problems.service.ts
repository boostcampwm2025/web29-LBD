import { Injectable } from '@nestjs/common';
import { SubmitRequestDto } from './dto/submit-request.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';

@Injectable()
export class ProblemsService {
  submit(problemId: string, body: SubmitRequestDto): SubmitResponseDto {
    const problem_type = body.submitConfig?.[0];
    const answer = (problem_type?.configInfo?.answer ?? '') as string;

    // test: 정답이 1234이면 PASS, 아니면 FAIL
    const isCorrect = answer === '1234';

    return isCorrect
      ? { result: 'PASS', feedback: [] }
      : {
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
