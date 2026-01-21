import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from 'src/entities/problem.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { ValidationService } from './validation/validation.service';
import { HandlerResolver } from './validation/handler-resolver';
import { UnitValidationHandler } from './validation/handlers/unit-validation.handler';
import { FieldValidationHandler } from './validation/handlers/field-validation.handler';
import { Ec2ScenarioHandler } from './validation/handlers/unit-service-specific-validation/unit-ec2-scenario.handler';
import { SgScenarioHandler } from './validation/handlers/unit-service-specific-validation/unit-sg-scenario.handler';
import { NetworkScenarioHandler } from './validation/handlers/unit-service-specific-validation/unit-network-scenario.handler';
import { S3ScenarioHandler } from './validation/handlers/unit-service-specific-validation/unit-s3-scenario.handler';
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
    FieldValidationHandler,
    SgScenarioHandler,
    Ec2ScenarioHandler,
    NetworkScenarioHandler,
    S3ScenarioHandler,
  ],
})
export class ProblemsModule {}
