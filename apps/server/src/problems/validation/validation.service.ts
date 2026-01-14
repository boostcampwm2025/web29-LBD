import { Injectable } from '@nestjs/common';
import { HandlerResolver } from './handler-resolver';
import type { ProblemData } from './handlers/validation.handler';
import type { SubmitRequestDto } from 'src/problems/dto/submit-request.dto';

@Injectable()
export class ValidationService {
  constructor(private readonly handlerResolver: HandlerResolver) {}

  validate(submitRequestDto: SubmitRequestDto, problemData: ProblemData) {
    const handler = this.handlerResolver.resolve(problemData.problemType);
    return handler.validate(submitRequestDto, problemData);
  }
}
