import { Injectable } from '@nestjs/common';
import { ConfigDto } from '../dto/submit-request.dto';
import { HandlerResolver } from './handler-resolver';
import { ProblemType } from '../types/problem-type.enum';

@Injectable()
export class ValidationService {
  constructor(private readonly handlerResolver: HandlerResolver) {}

  validate(
    problemType: ProblemType,
    submitConfig: ConfigDto,
    problemData: any,
  ) {
    const handler = this.handlerResolver.resolve(problemType);
    return handler.validate(submitConfig, problemData);
  }
}
