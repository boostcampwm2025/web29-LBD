import { Test, TestingModule } from '@nestjs/testing';
import { UnitValidationHandler } from '../../../../src/problems/validation/handlers/unit-validation.handler';
import { ProblemType } from '../../../../src/problems/types/problem-type.enum';
import { UnitProblemFeedbackType } from '../../../../src/problems/types/unit-problem-feedback-types';

describe('UnitValidationHandler', () => {
  let handler: UnitValidationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitValidationHandler],
    }).compile();

    handler = module.get<UnitValidationHandler>(UnitValidationHandler);
  });

  afterEach(() => {});

  it('정의되어야 한다.', () => {
    expect(handler).toBeDefined();
  });

  describe('isDeepEqual 메서드', () => {
    it('동일한 객체에 대해 true를 반환해야 한다.', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      expect(handler['isDeepEqual'](obj1, obj1)).toBe(true);
    });

    it('동일한 구조와 값을 가진 객체에 대해 true를 반환해야 한다.', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      expect(handler['isDeepEqual'](obj1, obj2)).toBe(true);
    });

    it('다른 값을 가진 객체에 대해 false를 반환해야 한다.', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj3 = { a: 1, b: { c: 3 } };
      expect(handler['isDeepEqual'](obj1, obj3)).toBe(false);
    });

    it('키 순서가 다른 객체에 대해 true를 반환해야 한다.', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 2, a: 1 };
      expect(handler['isDeepEqual'](obj1, obj2)).toBe(true);
    });

    it('null과 객체를 비교할 때 false를 반환해야 한다.', () => {
      expect(handler['isDeepEqual'](null, { a: 1 })).toBe(false);
      expect(handler['isDeepEqual']({ a: 1 }, null)).toBe(false);
    });

    it('배열을 올바르게 비교해야 한다.', () => {
      const obj1 = { arr: [1, 2, 3] };
      const obj2 = { arr: [1, 2, 3] };
      const obj3 = { arr: [1, 2, 4] };

      expect(handler['isDeepEqual'](obj1, obj2)).toBe(true);
      expect(handler['isDeepEqual'](obj1, obj3)).toBe(false);
    });
  });

  describe('checkDifference 메서드', () => {
    it('차이점을 올바르게 식별해야 한다.', () => {
      const answerConfigs = [
        { id: 1, value: 'A' },
        { id: 2, value: 'B' },
        { id: 3, value: 'C' },
      ];
      const solutionConfigs = [
        { id: 2, value: 'B' },
        { id: 3, value: 'C' },
        { id: 4, value: 'D' },
      ];
      const result = handler['checkDifference'](answerConfigs, solutionConfigs);

      expect(result.onlyInAnswer).toEqual([{ id: 1, value: 'A' }]);
      expect(result.onlyInSolution).toEqual([{ id: 4, value: 'D' }]);
    });

    it('같은 설정일 경우 빈 배열을 반환해야 한다.', () => {
      const answerConfigs = [
        { id: 1, value: 'A' },
        { id: 2, value: 'B' },
      ];
      const solutionConfigs = [
        { id: 1, value: 'A' },
        { id: 2, value: 'B' },
      ];
      const result = handler['checkDifference'](answerConfigs, solutionConfigs);
      expect(result.onlyInAnswer).toEqual([]);
      expect(result.onlyInSolution).toEqual([]);
    });
  });

  describe('validate 메서드', () => {
    it('정답과 일치하는 설정에 대해 PASS를 반환해야 한다.', () => {
      const submitRequestDto = {
        submitConfig: {
          vpc: [
            { id: '1', cidrBlock: 'A' },
            { id: '2', cidrBlock: 'B' },
          ],
        },
      };
      const problemData = {
        solution: {
          vpc: [
            { id: '1', cidrBlock: 'A' },
            { id: '2', cidrBlock: 'B' },
          ],
        },
        problemType: ProblemType.UNIT,
      };
      const result = handler.validate(submitRequestDto, problemData);
      expect(result.result).toBe('PASS');
    });

    it('정답과 일치하지 않는 설정에 대해 FAIL를 반환해야 한다.', () => {
      const submitRequestDto = {
        submitConfig: {
          vpc: [
            { id: '1', cidrBlock: 'A' },
            { id: '2', cidrBlock: 'B' },
          ],
        },
      };
      const problemData = {
        solution: {
          vpc: [
            { id: '1', cidrBlock: 'A' },
            { id: '2', cidrBlock: 'C' },
          ],
        },
        problemType: ProblemType.UNIT,
      };
      const result = handler.validate(submitRequestDto, problemData);
      expect(result.result).toBe('FAIL');
    });
  });

  describe('findServiceByName 메서드', () => {
    it('이름으로 서비스를 올바르게 찾아야 한다.', () => {
      const services = [
        { name: 'service1', value: 'A' },
        { name: 'service2', value: 'B' },
      ];
      const result = handler['findServiceByName'](services, 'service2');
      expect(result).toEqual({ name: 'service2', value: 'B' });
    });
    it('존재하지 않는 이름에 대해 undefined를 반환해야 한다.', () => {
      const services = [
        { name: 'service1', value: 'A' },
        { name: 'service2', value: 'B' },
      ];
      const result = handler['findServiceByName'](services, 'service3');
      expect(result).toBeUndefined();
    });
  });

  describe('generateFeedbackMessage 메서드', () => {
    it('요구하는 서비스보다 적은 서비스를 구성했을 때 피드백이 잘 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ name: 'vpc-1' }],
          onlyInSolution: [{ name: 'vpc-1' }, { name: 'vpc-2' }],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.SERVICE_MISSING,
          message:
            '제출한 vpc 설정에 누락된 서비스가 있습니다: 1개의 서비스 설정이 누락되었습니다.',
        },
      ]);
    });
    it('누락된 필드가 있을 때 피드백이 잘 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [
            { name: 'vpc-1', cidrBlock: 'A', region: 'us-east-1' },
          ],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.FIELD_MISSING,
          message: '제출한 vpc 설정에 누락된 필드가 있습니다: region',
        },
      ]);
    });
    it('불필요한 필드가 있을 때 피드백이 잘 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [
            { name: 'vpc-1', cidrBlock: 'A', region: 'us-east-1' },
          ],
          onlyInSolution: [{ name: 'vpc-1', cidrBlock: 'A' }],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.UNNECESSARY,
          message: '제출한 vpc 설정에 불필요한 필드가 있습니다: region',
        },
      ]);
    });
    it('피드백이 없을 때 빈 배열을 반환해야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [],
          onlyInSolution: [],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([]);
    });

    it('값이 다른 경우에도 피드백이 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [{ name: 'vpc-1', cidrBlock: 'B' }],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: cidrBlock',
        },
      ]);
    });
    it('중첩된 객체의 값이 다른 경우에도 피드백이 생성되어야 한다.', () => {
      // 객체 필드의 값이 다를 경우 일단 해당 필드의 키만 피드백에 포함시키도록 함.
      // 일단 가상의 객체 필드 nested를 추가해서 테스트.
      const validateResult = {
        vpc: {
          onlyInAnswer: [
            {
              name: 'vpc-1',
              nested: { nested1: '1', nested2: '2' },
            },
          ],
          onlyInSolution: [
            {
              name: 'vpc-1',
              nested: { nested1: '1', nested2: '3' },
            },
          ],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: nested',
        },
      ]);
    });
    it('여러 서비스의 피드백에 대해서도 각각의 피드백 배열을 제공해야한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [{ name: 'vpc-1', cidrBlock: 'B' }],
        },
        subnet: {
          onlyInAnswer: [{ name: 'subnet-1', cidrBlock: 'C' }],
          onlyInSolution: [{ name: 'subnet-1', cidrBlock: 'D' }],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: cidrBlock',
        },
        {
          field: 'subnet',
          code: UnitProblemFeedbackType.INCORRECT,
          message:
            '제출한 subnet 설정에 올바르지 않은 값이 있습니다: cidrBlock',
        },
      ]);
    });
    it('일반적인 상황에서도 피드백을 잘 생성해야 한다.', () => {
      // 제출한 것이 더 많은/적은 서비스를 포함 + 일부 필드 값이 다름 + 일부 필드가 누락/불필요함
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [
            { name: 'vpc-1', cidrBlock: 'B', region: 'us-east-1' },
            { name: 'vpc-2' },
          ],
        },
      };
      const feedbacks = handler['generateFeedbackMessage'](validateResult);
      expect(feedbacks).toEqual([
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.SERVICE_MISSING,
          message:
            '제출한 vpc 설정에 누락된 서비스가 있습니다: 1개의 서비스 설정이 누락되었습니다.',
        },
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.FIELD_MISSING,
          message: '제출한 vpc 설정에 누락된 필드가 있습니다: region',
        },
        {
          field: 'vpc',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: cidrBlock',
        },
      ]);
    });
  });
});
