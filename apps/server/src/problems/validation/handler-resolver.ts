import { Injectable } from '@nestjs/common';
import { ValidationHandler } from './handlers/validation.handler';
import { UnitValidationHandler } from './handlers/unit-validation.handler';

@Injectable()
export class HandlerResolver {
  private handlers: Map<string, ValidationHandler>;

  constructor(private readonly unitHandler: UnitValidationHandler) {
    this.handlers = new Map([['unit', this.unitHandler]]);
  }

  resolve(problemType: string): ValidationHandler {
    const handler = this.handlers.get(problemType);
    if (!handler) {
      throw new Error(`${problemType} 에 대한 ValidationHandler가 없습니다.`);
    }
    return handler;
  }
}
