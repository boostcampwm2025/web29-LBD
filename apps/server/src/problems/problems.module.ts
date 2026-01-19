import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from 'src/entities/problem.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { ValidationService } from './validation/validation.service';
import { HandlerResolver } from './validation/handler-resolver';
import { UnitValidationHandler } from './validation/handlers/unit-validation.handler';
import { Cookbook } from 'src/entities/cookbook.entity';
import { CookbookProblem } from 'src/entities/cookbook-problem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, Cookbook, CookbookProblem])],
  controllers: [ProblemsController],
  providers: [
    ProblemsService,
    ValidationService,
    HandlerResolver,
    UnitValidationHandler,
  ],
})
export class ProblemsModule {}
