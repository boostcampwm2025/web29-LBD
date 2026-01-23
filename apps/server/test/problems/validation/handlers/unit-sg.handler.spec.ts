import { Test, TestingModule } from '@nestjs/testing';
import { SgScenarioHandler } from '@/problems/validation/handlers/unit-service-specific-validation/unit-sg-scenario.handler';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { SgRequirements } from '@/problems/types/requirements-types';
import { SGFeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';

describe('SgScenarioHandler', () => {
  let handler: SgScenarioHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SgScenarioHandler],
    }).compile();

    handler = module.get<SgScenarioHandler>(SgScenarioHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  // --- [Case 1] Happy Path ---
  it('모든 요구사항(포트, 소스, EC2연결)을 충족하면 피드백이 없어야 한다', () => {
    const config: SubmitConfig = {
      securityGroups: [
        {
          id: 'sg-1',
          name: 'sg-web',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          ipPermissions: [
            // HTTP Open (Inbound)
            {
              ipProtocol: 'tcp',
              fromPort: '80',
              toPort: '80',
              cidrIp: '0.0.0.0/0',
              isInbound: true,
            },
            // SSH Restricted (Inbound)
            {
              ipProtocol: 'tcp',
              fromPort: '22',
              toPort: '22',
              cidrIp: '1.2.3.4/32',
              isInbound: true,
            },
            // Outbound Rule (Ignore this in validation)
            {
              ipProtocol: '-1',
              fromPort: '0',
              toPort: '0',
              cidrIp: '0.0.0.0/0',
              isInbound: false,
            },
          ],
        },
      ],
      ec2: [
        {
          id: 'i-1',
          name: 'web-server',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 's-1',
          subnetName: 's-1',
          instanceType: 't2.micro',
          securityGroups: ['sg-web'],
        } as any,
      ],
    };

    const reqs: SgRequirements = {
      securityGroup: {
        'sg-web': {
          requireOpenPorts: [80],
          checkSshOpenToWorld: true, // 0.0.0.0/0이 아니므로 통과해야 함
          requireSource: [{ port: 80, source: '0.0.0.0/0' }],
        },
      },
      ec2Attachment: {
        'web-server': { requireSecurityGroups: ['sg-web'] },
      },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(0);
  });

  // --- [Case 2] Port Closed ---
  it('필수 포트가 닫혀있거나 Outbound 규칙만 있으면 SG_INBOUND_PORT_CLOSED 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      securityGroups: [
        {
          id: 'sg-1',
          name: 'sg-web',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          ipPermissions: [
            // Outbound만 존재 (Inbound 80 없음)
            {
              ipProtocol: 'tcp',
              fromPort: '80',
              toPort: '80',
              cidrIp: '0.0.0.0/0',
              isInbound: false,
            },
          ],
        },
      ],
    };
    const reqs: SgRequirements = {
      securityGroup: { 'sg-web': { requireOpenPorts: [80] } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(SGFeedbackScenarios.SG_INBOUND_PORT_CLOSED);
  });

  // --- [Case 3] SSH Open to World ---
  it('SSH가 Inbound 0.0.0.0/0에 열려있으면 SG_SSH_OPEN_TO_WORLD 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      securityGroups: [
        {
          id: 'sg-1',
          name: 'sg-web',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          ipPermissions: [
            {
              ipProtocol: 'tcp',
              fromPort: '22',
              toPort: '22',
              cidrIp: '0.0.0.0/0',
              isInbound: true,
            },
          ],
        },
      ],
    };
    const reqs: SgRequirements = {
      securityGroup: { 'sg-web': { checkSshOpenToWorld: true } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(SGFeedbackScenarios.SG_SSH_OPEN_TO_WORLD);
  });

  // --- [Case 4] Wrong Source ---
  it('특정 포트의 소스(cidrIp)가 틀리면 SG_WRONG_SOURCE 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      securityGroups: [
        {
          id: 'sg-db',
          name: 'sg-db',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          ipPermissions: [
            // 3306 Open but Source is 0.0.0.0/0 (Should be sg-web)
            {
              ipProtocol: 'tcp',
              fromPort: '3306',
              toPort: '3306',
              cidrIp: '0.0.0.0/0',
              isInbound: true,
            },
          ],
        },
      ],
    };
    const reqs: SgRequirements = {
      securityGroup: {
        'sg-db': { requireSource: [{ port: 3306, source: 'sg-web' }] },
      },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(SGFeedbackScenarios.SG_WRONG_SOURCE);
    expect(result[0].message).toContain('0.0.0.0/0');
    expect(result[0].message).toContain('sg-web');
  });

  // --- [Case 5] EC2 Wrong SG Attached ---
  it('EC2에 필수 보안 그룹이 연결되지 않았으면 EC2_WRONG_SG_ATTACHED 피드백을 반환해야 한다', () => {
    const config: SubmitConfig = {
      ec2: [
        {
          id: 'i-1',
          name: 'web-server',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 's-1',
          subnetName: 's-1',
          instanceType: 't2',
          securityGroups: ['sg-default'], // sg-web Missing
        } as any,
      ],
    };
    const reqs: SgRequirements = {
      ec2Attachment: { 'web-server': { requireSecurityGroups: ['sg-web'] } },
    };

    const result = handler.validate(config, reqs);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(SGFeedbackScenarios.EC2_WRONG_SG_ATTACHED);
  });
});
