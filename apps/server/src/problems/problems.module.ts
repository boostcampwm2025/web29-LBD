import { Module } from '@nestjs/common';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { ValidationService } from './validation/validation.service';
import { HandlerResolver } from './validation/handler-resolver';
import { UnitValidationHandler } from './validation/handlers/unit-validation.handler';

@Module({
  controllers: [ProblemsController],
  providers: [
    ProblemsService,
    ValidationService,
    HandlerResolver,
    UnitValidationHandler,
  ],
})
export class ProblemsModule {}
