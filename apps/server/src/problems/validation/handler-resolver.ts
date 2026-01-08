import { Injectable } from '@nestjs/common';
import { ValidationHandler } from './handlers/validation.handler';
import { UnitValidationHandler } from './handlers/unit-validation.handler';
import { ProblemType } from '../types/problem-type.enum';

@Injectable()
export class HandlerResolver {
  private handlers: Map<ProblemType, ValidationHandler>;

  constructor(private readonly unitHandler: UnitValidationHandler) {
    this.handlers = new Map([[ProblemType.UNIT, this.unitHandler]]);
  }

  resolve(problemType: ProblemType): ValidationHandler {
    const handler = this.handlers.get(problemType);
    if (!handler) {
      throw new Error(`${problemType} 에 대한 ValidationHandler가 없습니다.`);
    }
    return handler;
  }
}
