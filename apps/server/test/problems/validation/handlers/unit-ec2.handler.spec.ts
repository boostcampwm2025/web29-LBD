import { Test, TestingModule } from '@nestjs/testing';
import { Ec2ScenarioHandler } from '@/problems/validation/handlers/unit-service-specific-validation/unit-ec2-scenario.handler';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { Ec2Requirements } from '@/problems/types/requirements-types';
import { EC2FeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';
describe('Ec2ScenarioHandler', () => {
  let handler: Ec2ScenarioHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Ec2ScenarioHandler],
    }).compile();

    handler = module.get<Ec2ScenarioHandler>(Ec2ScenarioHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  // --- [Case 1] Happy Path ---
  it('모든 요구사항(서브넷, AMI, 타입, Public IP)을 충족하면 피드백이 없어야 한다', () => {
    const config: SubmitConfig = {
      ec2: [
        {
          id: 'i-1',
          name: 'web-server',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'sub-1',
          subnetName: 'subnet-public', // Correct Subnet
          instanceType: 't2.micro', // Correct Type
          securityGroups: ['sg-web'],
          ami: 'ami-12345678', // Correct AMI
          privateIpAddress: '10.0.0.1',
          publicIpAddress: '1.2.3.4', // Correct Public IP
        },
      ],
    };

    const reqs: Ec2Requirements = {
      ec2: {
        'web-server': {
          expectedSubnet: 'subnet-public',
          expectedInstanceType: 't2.micro',
          expectedAmi: 'ami-12345678',
          requirePublicIp: true,
        },
      },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(0);
  });

  // --- [Case 2] Wrong Subnet ---
  it('잘못된 서브넷에 배치되면 EC2_IN_WRONG_SUBNET 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      ec2: [
        {
          id: 'i-1',
          name: 'web-server',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'sub-2',
          subnetName: 'subnet-private', // Wrong Subnet
          instanceType: 't2.micro',
          securityGroups: [],
          ami: 'ami-12345678',
          privateIpAddress: '10.0.0.2',
        },
      ],
    };
    const reqs: Ec2Requirements = {
      ec2: { 'web-server': { expectedSubnet: 'subnet-public' } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(EC2FeedbackScenarios.EC2_IN_WRONG_SUBNET);
    expect(result[0].message).toContain('subnet-private');
  });

  // --- [Case 3] Public IP Missing ---
  it('Public IP가 필요한데 설정이 없으면 EC2_PUBLIC_IP_MISSING 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      ec2: [
        {
          id: 'i-1',
          name: 'web-server',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'sub-1',
          subnetName: 'subnet-public',
          instanceType: 't2.micro',
          securityGroups: [],
          privateIpAddress: '10.0.0.1',
          ami: 'ami-12345678',
        },
      ],
    };
    const reqs: Ec2Requirements = {
      ec2: { 'web-server': { requirePublicIp: true } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(EC2FeedbackScenarios.EC2_PUBLIC_IP_MISSING);
  });

  // --- [Case 4] Wrong AMI ---
  it('AMI가 다르면 EC2_WRONG_AMI 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      ec2: [
        {
          id: 'i-1',
          name: 'web-server',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'sub-1',
          subnetName: 'subnet-public',
          instanceType: 't2.micro',
          securityGroups: [],
          ami: 'ami-wrong', // Wrong AMI
          privateIpAddress: '10.0.0.2', // Wrong AMI
        },
      ],
    };
    const reqs: Ec2Requirements = {
      ec2: { 'web-server': { expectedAmi: 'ami-correct' } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(EC2FeedbackScenarios.EC2_WRONG_AMI);
  });

  // --- [Case 5] Wrong Instance Type ---
  it('인스턴스 타입이 다르면 EC2_WRONG_INSTANCE_TYPE 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      ec2: [
        {
          id: 'i-1',
          name: 'web-server',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'sub-1',
          subnetName: 'subnet-public',
          instanceType: 'm5.large', // Wrong Type
          securityGroups: [],
          ami: 'ami-12345678',
          privateIpAddress: '10.0.0.2',
        },
      ],
    };
    const reqs: Ec2Requirements = {
      ec2: { 'web-server': { expectedInstanceType: 't2.micro' } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(EC2FeedbackScenarios.EC2_WRONG_INSTANCE_TYPE);
  });
});
