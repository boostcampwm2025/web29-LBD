import { Test, TestingModule } from '@nestjs/testing';
import { UnitValidationHandler } from '../../../../src/problems/validation/handlers/unit-validation.handler';
import { ProblemType } from '../../../../src/problems/types/problem-type.enum';
import { UnitProblemFeedbackType } from '../../../../src/problems/types/unit-problem-feedback-types';
import { VPCServiceFeedbackType } from '../../../../src/problems/types/field-validation-feedback-types';
import { FieldValidationHandler } from '../../../../src/problems/validation/handlers/field-validation.handler';

describe('UnitValidationHandler', () => {
  let handler: UnitValidationHandler;
  let fieldHandler: FieldValidationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitValidationHandler, FieldValidationHandler],
    }).compile();

    handler = module.get<UnitValidationHandler>(UnitValidationHandler);
    fieldHandler = module.get<FieldValidationHandler>(FieldValidationHandler);
  });

  afterEach(() => {});

  it('정의되어야 한다.', () => {
    expect(handler).toBeDefined();
    expect(fieldHandler).toBeDefined();
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
    it('CIDR 블록이 완벽히 일치하거나, 정답 범위에 포함되면 통과하고 틀린 것만 식별해야 한다.', () => {
      const answerVPCConfigs = [
        { id: '1', name: 'vpc-exact', cidrBlock: '10.0.0.0/16' },
        { id: '2', name: 'vpc-included', cidrBlock: '10.0.1.0/24' },
        { id: '3', name: 'vpc-wrong', cidrBlock: '192.168.0.0/24' },
      ];

      const solutionConfigs = [
        { id: '1', name: 'vpc-exact', cidrBlock: '10.0.0.0/16' },
        { id: '2', name: 'vpc-included', cidrBlock: '10.0.0.0/16' },
        { id: '3', name: 'vpc-wrong', cidrBlock: '10.0.0.0/16' },
      ];

      const result = handler['diffServiceConfigs'](
        answerVPCConfigs,
        solutionConfigs,
        'vpc',
      );

      expect(result.onlyInAnswer).toEqual([
        { id: '3', name: 'vpc-wrong', cidrBlock: '192.168.0.0/24' },
      ]);
      expect(result.onlyInSolution).toEqual([
        { id: '3', name: 'vpc-wrong', cidrBlock: '10.0.0.0/16' },
      ]);
    });

    it('필드의 정답에 DONT_CARE가 있을 때 올바르게 처리해야 한다.', () => {
      const answerS3Configs = [
        { id: 's3-1', name: 'bucket-1' },
        { id: 's3-2', name: 'bucket-2' },
      ];
      const solutionConfigs = [
        { id: 's3-1', name: 'bucket-1' },
        { id: 's3-2', name: 'DONT_CARE' },
      ];
      const result = handler['diffServiceConfigs'](
        answerS3Configs,
        solutionConfigs,
        's3',
      );
      expect(result.onlyInAnswer).toEqual([]);
      expect(result.onlyInSolution).toEqual([]);
    });

    it('기타 다른 설정일 때도 차이점을 올바르게 식별해야 한다.', () => {
      const answerS3Configs = [
        { id: 's3-1', name: 'bucket-1' },
        { id: 's3-2', name: 'bucket-2' },
      ];
      const solutionConfigs = [
        { id: 's3-1', name: 'bucket-1' },
        { id: 's3-2', name: 'bucket-22' },
      ];
      const result = handler['diffServiceConfigs'](
        answerS3Configs,
        solutionConfigs,
        's3',
      );
      expect(result.onlyInAnswer).toEqual([{ id: 's3-2', name: 'bucket-2' }]);
      expect(result.onlyInSolution).toEqual([
        { id: 's3-2', name: 'bucket-22' },
      ]);
    });

    it('같은 설정일 경우 빈 배열을 반환해야 한다.', () => {
      const answerS3Configs = [
        { id: 's3-1', name: 'bucket-1' },
        { id: 's3-2', name: 'bucket-2' },
      ];
      const solutionConfigs = [
        { id: 's3-1', name: 'bucket-1' },
        { id: 's3-2', name: 'bucket-2' },
      ];
      const result = handler['diffServiceConfigs'](
        answerS3Configs,
        solutionConfigs,
        's3',
      );
      expect(result.onlyInAnswer).toEqual([]);
      expect(result.onlyInSolution).toEqual([]);
    });
  });

  describe('validate 메서드', () => {
    it('정답과 일치하는 설정에 대해 PASS과 빈 피드백을 반환해야 한다.', () => {
      const submitRequestDto = {
        submitConfig: {
          vpc: [
            { name: 'vpc-1', id: '1', cidrBlock: '10.0.0.0/16' },
            { name: 'vpc-2', id: '2', cidrBlock: '10.1.0.0/16' },
          ],
        },
      };
      const problemData = {
        solution: {
          vpc: [
            { name: 'vpc-1', id: '1', cidrBlock: '10.0.0.0/16' },
            { name: 'vpc-2', id: '2', cidrBlock: '10.1.0.0/16' },
          ],
        },
        problemType: ProblemType.UNIT,
      };
      const result = handler.validate(submitRequestDto, problemData);
      expect(result.result).toBe('PASS');
      expect(result.feedback.length).toBe(0);
      expect(result.feedback).toEqual([]);
    });

    it('정답과 일치하지 않는 설정에 대해 FAIL과 피드백을 반환해야 한다.', () => {
      const submitRequestDto = {
        submitConfig: {
          vpc: [
            { name: 'vpc-1', id: '1', cidrBlock: '10.0.0.0/16' },
            { name: 'vpc-2', id: '2', cidrBlock: '10.0.1.0/16' },
          ],
        },
      };
      const problemData = {
        solution: {
          vpc: [
            { name: 'vpc-1', id: '1', cidrBlock: '10.0.0.0/16' },
            { name: 'vpc-2', id: '2', cidrBlock: '10.1.0.0/16' },
          ],
        },
        problemType: ProblemType.UNIT,
      };
      const result = handler.validate(submitRequestDto, problemData);
      expect(result.result).toBe('FAIL');
      expect(result.feedback.length).toBeGreaterThan(0);
      expect(result.feedback).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-2',
          field: 'cidrBlock',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: cidrBlock',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
          message:
            'VPC vpc-1와 VPC vpc-2의 CIDR 블록이 겹칩니다. (10.0.0.0/16 , 10.0.1.0/16)',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-2',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
          message:
            'VPC vpc-2와 VPC vpc-1의 CIDR 블록이 겹칩니다. (10.0.1.0/16 , 10.0.0.0/16)',
        },
      ]);
    });
  });

  describe('generateFeedbackMessage 메서드', () => {
    it('요구하는 서비스보다 적은 서비스를 구성했을 때 피드백이 잘 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ id: '1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' }],
          onlyInSolution: [
            { id: '1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
            { id: '2', name: 'vpc-2', cidrBlock: '10.0.1.0/16' },
          ],
        },
      };
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          code: UnitProblemFeedbackType.SERVICE_MISSING,
          message:
            '제출한 vpc 설정에 누락된 서비스가 있습니다: 1개의 서비스 설정이 누락되었습니다.',
        },
      ]);
    });
    it('누락된 필드가 있을 때 피드백이 잘 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ id: '1', name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [
            { id: '1', name: 'vpc-1', cidrBlock: 'A', region: 'us-east-1' },
          ],
        },
      };
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'region',
          code: UnitProblemFeedbackType.FIELD_MISSING,
          message: '제출한 vpc 설정에 누락된 필드가 있습니다: region',
        },
      ]);
    });
    it('불필요한 필드가 있을 때 피드백이 잘 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [
            { id: '1', name: 'vpc-1', cidrBlock: 'A', region: 'us-east-1' },
          ],
          onlyInSolution: [{ id: '1', name: 'vpc-1', cidrBlock: 'A' }],
        },
      };
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'region',
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
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([]);
    });

    it('값이 다른 경우에도 피드백이 생성되어야 한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ id: '1', name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [{ id: '1', name: 'vpc-1', cidrBlock: 'B' }],
        },
      };
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
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
              id: '1',
              name: 'vpc-1',
              nested: { nested1: '1', nested2: '2' },
            },
          ],
          onlyInSolution: [
            {
              id: '1',
              name: 'vpc-1',
              nested: { nested1: '1', nested2: '3' },
            },
          ],
        },
      };
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'nested',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: nested',
        },
      ]);
    });
    it('여러 서비스의 피드백에 대해서도 각각의 피드백 배열을 제공해야한다.', () => {
      const validateResult = {
        vpc: {
          onlyInAnswer: [{ id: '1', name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [{ id: '1', name: 'vpc-1', cidrBlock: 'B' }],
        },
        subnet: {
          onlyInAnswer: [{ id: '1', name: 'subnet-1', cidrBlock: 'C' }],
          onlyInSolution: [{ id: '1', name: 'subnet-1', cidrBlock: 'D' }],
        },
      };
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: cidrBlock',
        },
        {
          serviceType: 'subnet',
          service: 'subnet-1',
          field: 'cidrBlock',
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
          onlyInAnswer: [{ id: '1', name: 'vpc-1', cidrBlock: 'A' }],
          onlyInSolution: [
            { id: '1', name: 'vpc-1', cidrBlock: 'B', region: 'us-east-1' },
            { id: '2', name: 'vpc-2' },
          ],
        },
      };
      const feedbacks = handler['generateFeedbacks'](validateResult);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          code: UnitProblemFeedbackType.SERVICE_MISSING,
          message:
            '제출한 vpc 설정에 누락된 서비스가 있습니다: 1개의 서비스 설정이 누락되었습니다.',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'region',
          code: UnitProblemFeedbackType.FIELD_MISSING,
          message: '제출한 vpc 설정에 누락된 필드가 있습니다: region',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
          code: UnitProblemFeedbackType.INCORRECT,
          message: '제출한 vpc 설정에 올바르지 않은 값이 있습니다: cidrBlock',
        },
      ]);
    });
  });
});
