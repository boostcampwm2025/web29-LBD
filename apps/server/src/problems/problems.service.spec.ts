/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { Problem } from '../entities/problem.entity';
import { Cookbook } from '../entities/cookbook.entity';
import { ValidationService } from './validation/validation.service';
import { ProblemType } from './types/problem-type.enum';

describe('ProblemsService', () => {
  let service: ProblemsService;
  let problemRepository: jest.Mocked<Repository<Problem>>;

  // Mock 데이터
  const MOCK_PROBLEM_WITH_TAGS = {
    id: 1,
    problem_type: ProblemType.UNIT,
    title: 'VPC 만들기',
    description: 'VPC를 생성하는 문제입니다',
    required_fields: [
      {
        service: 'VPC',
        service_task: 'vpc-create',
        service_sections: ['general'],
        fixed_options: {
          general: {
            cidr_block: {
              placeholder: '10.0.0.0/16',
              helper_text: 'VPC CIDR 블록',
              required: true,
            },
          },
        },
      },
    ],
    tags: [
      { id: 1, name: 'VPC' },
      { id: 2, name: 'CIDR' },
    ],
  } as unknown as Problem;

  beforeEach(async () => {
    const mockProblemRepository = {
      findOne: jest.fn(),
    };

    const mockValidationService = {
      validate: jest.fn(),
    };

    const mockCookbookRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProblemsService,
        {
          provide: getRepositoryToken(Problem),
          useValue: mockProblemRepository,
        },
        {
          provide: ValidationService,
          useValue: mockValidationService,
        },
        {
          provide: getRepositoryToken(Cookbook),
          useValue: mockCookbookRepository,
        },
      ],
    }).compile();

    service = module.get<ProblemsService>(ProblemsService);
    problemRepository = module.get(getRepositoryToken(Problem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByProblemId', () => {
    it('Given: 존재하는 문제 ID일 때, When: findByProblemId를 호출하면, Then: 문제 상세 정보를 반환해야 한다', async () => {
      // Given: 존재하는 문제 ID
      const problemId = 1;
      problemRepository.findOne.mockResolvedValue(MOCK_PROBLEM_WITH_TAGS);

      // When: findByProblemId 호출
      const result = await service.findByProblemId(problemId);

      // Then: 문제 상세 정보 반환
      expect(problemRepository.findOne).toHaveBeenCalledWith({
        where: { id: problemId },
        relations: ['tags'],
      });
      expect(result).toEqual({
        id: 1,
        problem_type: ProblemType.UNIT,
        title: 'VPC 만들기',
        description: 'VPC를 생성하는 문제입니다',
        required_fields: MOCK_PROBLEM_WITH_TAGS.required_fields,
        tags: ['VPC', 'CIDR'],
      });
    });

    it('Given: 존재하지 않는 문제 ID일 때, When: findByProblemId를 호출하면, Then: NotFoundException을 던져야 한다', async () => {
      // Given: 존재하지 않는 문제 ID
      const problemId = 999;
      problemRepository.findOne.mockResolvedValue(null);

      // When & Then: NotFoundException 발생
      await expect(service.findByProblemId(problemId)).rejects.toThrow(
        new NotFoundException(`문제 ID ${problemId}을(를) 찾을 수 없습니다.`),
      );

      expect(problemRepository.findOne).toHaveBeenCalledWith({
        where: { id: problemId },
        relations: ['tags'],
      });
    });

    it('Given: 태그가 없는 문제일 때, When: findByProblemId를 호출하면, Then: 빈 태그 배열을 반환해야 한다', async () => {
      // Given: 태그가 없는 문제
      const problemId = 1;
      const problemWithoutTags = {
        ...MOCK_PROBLEM_WITH_TAGS,
        tags: [],
      } as unknown as Problem;
      problemRepository.findOne.mockResolvedValue(problemWithoutTags);

      // When: findByProblemId 호출
      const result = await service.findByProblemId(problemId);

      // Then: 빈 태그 배열 반환
      expect(result.tags).toEqual([]);
    });
  });
});
