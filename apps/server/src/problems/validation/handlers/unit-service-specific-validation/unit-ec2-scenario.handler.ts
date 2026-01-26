import { Injectable } from '@nestjs/common';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { FeedbackDto } from '@/problems/dto/submit-response.dto';
import { Ec2Requirements } from '@/problems/types/requirements-types';
import { EC2FeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';
import { removeUndefined } from '@/problems/validation/utils/refine-request';

@Injectable()
export class Ec2ScenarioHandler {
  validate(
    submitConfig: SubmitConfig,
    requirements: Ec2Requirements | undefined,
  ): FeedbackDto[] {
    if (!requirements) return [];
    const feedbacks: FeedbackDto[] = [];

    if (requirements?.ec2) {
      feedbacks.push(
        ...this.validateEc2Requirements(submitConfig, requirements.ec2),
      );
    }

    return feedbacks;
  }

  private validateEc2Requirements(
    config: SubmitConfig,
    reqs: Ec2Requirements['ec2'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const instances = config.ec2 || [];

    const refinedInstances = instances.map((instance) =>
      removeUndefined(instance),
    );

    // 1. EC2_IN_WRONG_SUBNET
    for (const [ec2Name, req] of Object.entries(reqs ?? {})) {
      const instance = refinedInstances.find((i) => i.name === ec2Name);

      if (!instance) continue;

      if (req.expectedSubnet) {
        if (instance.subnetName !== req.expectedSubnet) {
          feedbacks.push({
            serviceType: 'ec2',
            service: ec2Name,
            field: 'subnetName',
            code: EC2FeedbackScenarios.EC2_IN_WRONG_SUBNET,
            message: `EC2 인스턴스 ${ec2Name}이(가) 잘못된 서브넷(${instance.subnetName})에 배치되었습니다. 요구사항: ${req.expectedSubnet}`,
          });
        }
      }

      // 2. EC2_PUBLIC_IP_MISSING
      if (req.requirePublicIp) {
        // publicIpAddress가 있는지 확인
        if (!instance.publicIpAddress) {
          feedbacks.push({
            serviceType: 'ec2',
            service: ec2Name,
            field: 'publicIpAddress',
            code: EC2FeedbackScenarios.EC2_PUBLIC_IP_MISSING,
            message: `EC2 인스턴스 ${ec2Name}에 퍼블릭 IP 자동 할당 설정이 누락되었습니다.`,
          });
        }
      }

      // 3. EC2_WRONG_AMI
      if (req.expectedAmi) {
        if (instance.ami !== req.expectedAmi) {
          feedbacks.push({
            serviceType: 'ec2',
            service: ec2Name,
            field: 'ami',
            code: EC2FeedbackScenarios.EC2_WRONG_AMI,
            message: `EC2 인스턴스 ${ec2Name}의 AMI가 올바르지 않습니다. (현재: ${instance.ami}, 요구: ${req.expectedAmi})`,
          });
        }
      }

      // 4. EC2_WRONG_INSTANCE_TYPE
      if (req.expectedInstanceType) {
        if (instance.instanceType !== req.expectedInstanceType) {
          feedbacks.push({
            serviceType: 'ec2',
            service: ec2Name,
            field: 'instanceType',
            code: EC2FeedbackScenarios.EC2_WRONG_INSTANCE_TYPE,
            message: `EC2 인스턴스 ${ec2Name}의 인스턴스 타입이 올바르지 않습니다. (현재: ${instance.instanceType}, 요구: ${req.expectedInstanceType})`,
          });
        }
      }
    }

    return feedbacks;
  }
}
