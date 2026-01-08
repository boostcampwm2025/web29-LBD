import { Injectable } from '@nestjs/common';
import { SubmitRequestDto } from './dto/submit-request.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { ValidationService } from './validation/validation.service';
import { ProblemType } from './types/problem-type.enum';

@Injectable()
export class ProblemsService {
  constructor(private readonly validationService: ValidationService) {}

  submit(problemId: number, body: SubmitRequestDto): SubmitResponseDto {
    // MOCK 문제 데이터
    const problemData = {
      problemType: ProblemType.UNIT,
      answer: '1234',
    };

    const result = this.validationService.validate(
      problemData.problemType,
      body.submitConfig[0],
      problemData,
    );

    return result;
  }
}
