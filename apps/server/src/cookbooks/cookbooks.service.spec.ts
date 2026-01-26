/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CookbooksService } from './cookbooks.service';
import { Cookbook } from '../entities/cookbook.entity';
import { ProblemType } from '../problems/types/problem-type.enum';

describe('CookbooksService', () => {
  let service: CookbooksService;
  let cookbookRepository: jest.Mocked<Repository<Cookbook>>;

  // Mock 데이터
  const MOCK_COOKBOOK_WITH_PROBLEMS = {
    id: 1,
    title: 'VPC 네트워킹 기초',
    description: 'VPC부터 시작해서 완전한 네트워크 구성까지',
    descDetail: 'VPC 네트워킹 상세 설명',
    tags: [
      { id: 1, name: 'VPC' },
      { id: 2, name: '네트워크' },
      { id: 3, name: '기초' },
    ],
    cookbookProblems: [
      {
        cookbookId: 1,
        problemId: 2,
        orderNumber: 2,
        problem: {
          id: 2,
          title: 'Subnet 만들기',
          problemType: ProblemType.UNIT,
        },
      },
      {
        cookbookId: 1,
        problemId: 1,
        orderNumber: 1,
        problem: {
          id: 1,
          title: 'VPC 만들기',
          problemType: ProblemType.UNIT,
        },
      },
      {
        cookbookId: 1,
        problemId: 3,
        orderNumber: 3,
        problem: {
          id: 3,
          title: 'IGW 연결하기',
          problemType: ProblemType.UNIT,
        },
      },
    ],
  } as unknown as Cookbook;

  beforeEach(async () => {
    const mockCookbookRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookbooksService,
        {
          provide: getRepositoryToken(Cookbook),
          useValue: mockCookbookRepository,
        },
      ],
    }).compile();

    service = module.get<CookbooksService>(CookbooksService);
    cookbookRepository = module.get(getRepositoryToken(Cookbook));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByCookbookId', () => {
    it('Given: 존재하는 쿡북 ID일 때, When: findByCookbookId를 호출하면, Then: 쿡북 상세 정보와 정렬된 문제 목록을 반환해야 한다', async () => {
      // Given: 존재하는 쿡북 ID
      const cookbookId = 1;
      cookbookRepository.findOne.mockResolvedValue(MOCK_COOKBOOK_WITH_PROBLEMS);

      // When: findByCookbookId 호출
      const result = await service.findByCookbookId(cookbookId);

      // Then: 쿡북 상세 정보와 정렬된 문제 목록 반환
      expect(cookbookRepository.findOne).toHaveBeenCalledWith({
        where: { id: cookbookId },
        relations: ['tags', 'cookbook_problems', 'cookbook_problems.problem'],
      });
      expect(result).toEqual({
        id: 1,
        title: 'VPC 네트워킹 기초',
        description: 'VPC부터 시작해서 완전한 네트워크 구성까지',
        descDetail: 'VPC 네트워킹 상세 설명',
        tags: ['VPC', '네트워크', '기초'],
        problems: [
          { id: 1, title: 'VPC 만들기', orderNumber: 1 },
          { id: 2, title: 'Subnet 만들기', orderNumber: 2 },
          { id: 3, title: 'IGW 연결하기', orderNumber: 3 },
        ],
      });
    });

    it('Given: 존재하지 않는 쿡북 ID일 때, When: findByCookbookId를 호출하면, Then: NotFoundException을 던져야 한다', async () => {
      // Given: 존재하지 않는 쿡북 ID
      const cookbookId = 999;
      cookbookRepository.findOne.mockResolvedValue(null);

      // When & Then: NotFoundException 발생
      await expect(service.findByCookbookId(cookbookId)).rejects.toThrow(
        new NotFoundException(`Cookbook with ID ${cookbookId} not found`),
      );

      expect(cookbookRepository.findOne).toHaveBeenCalledWith({
        where: { id: cookbookId },
        relations: ['tags', 'cookbook_problems', 'cookbook_problems.problem'],
      });
    });

    it('Given: 문제가 없는 쿡북일 때, When: findByCookbookId를 호출하면, Then: 빈 문제 배열을 반환해야 한다', async () => {
      // Given: 문제가 없는 쿡북
      const cookbookId = 1;
      const cookbookWithoutProblems = {
        ...MOCK_COOKBOOK_WITH_PROBLEMS,
        cookbookProblems: [],
      } as unknown as Cookbook;
      cookbookRepository.findOne.mockResolvedValue(cookbookWithoutProblems);

      // When: findByCookbookId 호출
      const result = await service.findByCookbookId(cookbookId);

      // Then: 빈 문제 배열 반환
      expect(result.problems).toEqual([]);
    });

    it('Given: 문제가 순서대로 정렬되지 않은 쿡북일 때, When: findByCookbookId를 호출하면, Then: order_number 순으로 정렬된 문제 목록을 반환해야 한다', async () => {
      // Given: 순서가 뒤섞인 문제 목록
      const cookbookId = 1;
      cookbookRepository.findOne.mockResolvedValue(MOCK_COOKBOOK_WITH_PROBLEMS);

      // When: findByCookbookId 호출
      const result = await service.findByCookbookId(cookbookId);

      // Then: order_number 기준 오름차순 정렬
      expect(result.problems[0].orderNumber).toBe(1);
      expect(result.problems[1].orderNumber).toBe(2);
      expect(result.problems[2].orderNumber).toBe(3);
      expect(result.problems[0].title).toBe('VPC 만들기');
      expect(result.problems[1].title).toBe('Subnet 만들기');
      expect(result.problems[2].title).toBe('IGW 연결하기');
    });

    it('Given: 태그가 없는 쿡북일 때, When: findByCookbookId를 호출하면, Then: 빈 태그 배열을 반환해야 한다', async () => {
      // Given: 태그가 없는 쿡북
      const cookbookId = 1;
      const cookbookWithoutTags = {
        ...MOCK_COOKBOOK_WITH_PROBLEMS,
        tags: [],
      } as unknown as Cookbook;
      cookbookRepository.findOne.mockResolvedValue(cookbookWithoutTags);

      // When: findByCookbookId 호출
      const result = await service.findByCookbookId(cookbookId);

      // Then: 빈 태그 배열 반환
      expect(result.tags).toEqual([]);
    });
  });
});
