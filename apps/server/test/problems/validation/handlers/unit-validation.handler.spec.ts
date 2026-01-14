import { Test, TestingModule } from '@nestjs/testing';
import { UnitValidationHandler } from '../../../../src/problems/validation/handlers/unit-validation.handler';
import { ProblemType } from '../../../../src/problems/types/problem-type.enum';

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
});
