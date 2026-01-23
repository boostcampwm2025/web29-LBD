import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SubmitRequestDto } from './dto/submit-request.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { ValidationService } from './validation/validation.service';
import { ProblemType } from './types/problem-type.enum';
import { Problem } from 'src/entities/problem.entity';
import { ProblemDetailResponseDto } from './dto/problem-detail-response.dto';
import {
  CookbookProblemItemResponseDto,
  UnitProblemItemResponseDto,
} from './dto/problem-list-response.dto';
import { Cookbook } from 'src/entities/cookbook.entity';

@Injectable()
export class ProblemsService {
  constructor(
    private readonly validationService: ValidationService,

    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,

    @InjectRepository(Cookbook)
    private readonly cookbookRepository: Repository<Cookbook>,
  ) {}

  private async findUnitProblems(): Promise<UnitProblemItemResponseDto[]> {
    const units = await this.problemRepository.find({
      where: { problem_type: ProblemType.UNIT },
      relations: ['tags'],
    });

    return units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      description: unit.description,
      tags: unit.tags?.map((tag) => tag.name) || [],
    }));
  }

  private async findCookbookProblems(): Promise<
    CookbookProblemItemResponseDto[]
  > {
    const cookbooks = await this.cookbookRepository.find({
      relations: ['tags', 'cookbook_problems', 'cookbook_problems.problem'],
    });

    return cookbooks.map((cookbook) => ({
      id: cookbook.id,
      title: cookbook.title,
      description: cookbook.description,
      tags: cookbook.tags?.map((tag) => tag.name) ?? [],
      problems: cookbook.cookbook_problems
        .sort((a, b) => a.order_number - b.order_number)
        .map((cp) => ({
          id: cp.problem.id,
          title: cp.problem.title,
          description: cp.problem.description,
        })),
    }));
  }

  async findAllProblemsByType(
    type: ProblemType,
  ): Promise<UnitProblemItemResponseDto[] | CookbookProblemItemResponseDto[]> {
    // TODO: 시나리오 유형 추가
    switch (type) {
      case ProblemType.UNIT:
        return this.findUnitProblems();
      case ProblemType.COOKBOOK:
        return this.findCookbookProblems();
      default:
        throw new NotFoundException(`유효하지 않은 문제 유형입니다: ${type}`);
    }
  }

  async findByProblemId(problemId: number): Promise<ProblemDetailResponseDto> {
    const problem = await this.problemRepository.findOne({
      where: { id: problemId },
      relations: ['tags'],
    });

    if (!problem) {
      throw new NotFoundException(
        `문제 ID ${problemId}을(를) 찾을 수 없습니다.`,
      );
    }

    return {
      id: problem.id,
      problem_type: problem.problem_type,
      title: problem.title,
      description: problem.description,
      desc_detail: problem.desc_detail,
      required_fields: problem.required_fields,
      tags: problem.tags.map((tag) => tag.name),
    };
  }

  submit(problemId: number, body: SubmitRequestDto): SubmitResponseDto {
    // MOCK 문제 데이터
    const problemData = {
      problemType: ProblemType.UNIT,
      solution: {},
    };

    // TODO: problemId로 문제 데이터를 조회하는 로직 추후 구현 필요

    const result = this.validationService.validate(body, problemData);
    return result;
  }
}
