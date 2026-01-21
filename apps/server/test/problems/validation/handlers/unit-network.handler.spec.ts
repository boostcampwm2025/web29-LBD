import { Test, TestingModule } from '@nestjs/testing';
import { NetworkScenarioHandler } from '@/problems/validation/handlers/unit-service-specific-validation/unit-network-scenario.handler';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { NetworkRequirements } from '@/problems/types/requirements-types';
import { NetworkFeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';

// DTO 타입과 일치하도록 테스트 데이터 생성
describe('NetworkScenarioHandler', () => {
  let handler: NetworkScenarioHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkScenarioHandler],
    }).compile();

    handler = module.get<NetworkScenarioHandler>(NetworkScenarioHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  // --- [Case 1] Happy Path ---
  it('모든 요구사항(VPC, IGW, Routing)을 충족했을 때 피드백을 반환하지 않아야 한다', () => {
    // Given
    const validConfig: SubmitConfig = {
      vpc: [
        {
          id: 'vpc-1',
          name: 'vpc-1',
          cidrBlock: '10.0.0.0/16',
        },
      ],
      internetGateway: [
        { id: 'igw-1', name: 'igw-1', vpcId: 'vpc-1', vpcName: 'vpc-1' },
      ],
      subnet: [
        {
          id: 'subnet-1',
          name: 'subnet-public',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.1.0/24',
        },
      ],
      routeTable: [
        {
          id: 'rt-1',
          name: 'rt-public',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          routes: [{ destinationCidr: '0.0.0.0/0', targetGatewayId: 'igw-1' }],
          associations: [{ subnetId: 'subnet-public' }], // 로직상 name 매칭을 가정 (ID와 Name을 동일하게 처리하거나 매핑)
        },
      ],
    };

    const requirements: NetworkRequirements = {
      vpc: { 'vpc-1': { requireIgwAttached: true, requireDnsHostnames: true } },
      routeTable: { 'rt-public': { requireIgwRoute: true } },
      subnet: { 'subnet-public': { requireRouteTable: 'rt-public' } },
    };

    // When
    const result = handler.validate(validConfig, requirements);

    // Then
    expect(result).toHaveLength(0);
  });

  // --- [Case 2] VPC Scenarios ---
  describe('VPC Scenarios', () => {
    it('IGW가 다른 VPC에 연결되어 있으면 IGW_NOT_ATTACHED 피드백을 반환해야 한다', () => {
      const config: SubmitConfig = {
        vpc: [
          {
            id: 'vpc-1',
            name: 'vpc-1',
            cidrBlock: '10.0.0.0/16',
          },
        ],
        internetGateway: [
          { id: 'igw-1', name: 'igw-1', vpcId: 'vpc-2', vpcName: 'vpc-2' },
        ], // vpc-1이 아님
      };
      const reqs: NetworkRequirements = {
        vpc: { 'vpc-1': { requireIgwAttached: true } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(NetworkFeedbackScenarios.IGW_NOT_ATTACHED);
    });
  });

  // --- [Case 3] Route Table Scenarios ---
  describe('Route Table Scenarios', () => {
    it('IGW 경로가 없으면 ROUTES_TO_IGW_MISSING 피드백을 반환해야 한다', () => {
      const config: SubmitConfig = {
        routeTable: [
          {
            id: 'rt-1',
            name: 'rt-public',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            routes: [], // 경로 없음
            associations: [],
          },
        ],
      };
      const reqs: NetworkRequirements = {
        routeTable: { 'rt-public': { requireIgwRoute: true } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(
        NetworkFeedbackScenarios.ROUTES_TO_IGW_MISSING,
      );
    });

    it('NAT 경로가 없으면 NAT_GW_MISSING_IN_ROUTE 피드백을 반환해야 한다', () => {
      const config: SubmitConfig = {
        routeTable: [
          {
            id: 'rt-1',
            name: 'rt-private',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            routes: [
              { destinationCidr: '0.0.0.0/0', targetGatewayId: 'igw-1' },
            ], // NAT가 아닌 IGW
            associations: [],
          },
        ],
      };
      const reqs: NetworkRequirements = {
        routeTable: { 'rt-private': { requireNatRoute: true } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(
        NetworkFeedbackScenarios.NAT_GW_MISSING_IN_ROUTE,
      );
    });
  });

  // --- [Case 4] Subnet Scenarios ---
  describe('Subnet Scenarios', () => {
    it('요구된 라우트 테이블과 연결되지 않았으면 SUBNET_RT_ASSOCIATION_MISSING 피드백을 반환해야 한다', () => {
      const config: SubmitConfig = {
        subnet: [
          {
            id: 'sub-1',
            name: 'subnet-1',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            cidrBlock: '10.0.1.0/24',
          },
        ],
        routeTable: [
          {
            id: 'rt-1',
            name: 'rt-wrong', // rt-correct가 아님
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            routes: [],
            associations: [{ subnetId: 'subnet-1' }],
          },
        ],
      };
      const reqs: NetworkRequirements = {
        subnet: { 'subnet-1': { requireRouteTable: 'rt-correct' } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(
        NetworkFeedbackScenarios.SUBNET_RT_ASSOCIATION_MISSING,
      );
    });

    it('프라이빗 서브넷 요구사항이 있는데 IGW 경로가 있으면 PRIVATE_SUBNET_HAS_IGW_ROUTE 피드백을 반환해야 한다', () => {
      const config: SubmitConfig = {
        subnet: [
          {
            id: 'sub-p',
            name: 'subnet-private',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            cidrBlock: '10.0.2.0/24',
          },
        ],
        routeTable: [
          {
            id: 'rt-p',
            name: 'rt-private',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            routes: [
              { destinationCidr: '0.0.0.0/0', targetGatewayId: 'igw-1' },
            ], // IGW 경로 존재 (실수)
            associations: [{ subnetId: 'subnet-private' }],
          },
        ],
      };
      const reqs: NetworkRequirements = {
        subnet: { 'subnet-private': { isPrivate: true } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(
        NetworkFeedbackScenarios.PRIVATE_SUBNET_HAS_IGW_ROUTE,
      );
    });
  });

  // --- [Case 5] NAT Gateway Scenarios ---
  describe('NAT Gateway Scenarios', () => {
    it('NAT Gateway가 프라이빗 서브넷(IGW경로 없음)에 배치되면 NAT_GW_IN_WRONG_SUBNET 피드백을 반환해야 한다', () => {
      const config: SubmitConfig = {
        // NAT가 배치된 서브넷: subnet-private
        natGateway: [
          {
            id: 'nat-1',
            name: 'nat-1',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            subnetId: 'sub-p',
            subnetName: 'subnet-private',
          },
        ],

        // subnet-private는 rt-private와 연결됨
        subnet: [
          {
            id: 'sub-p',
            name: 'subnet-private',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            cidrBlock: '10.0.2.0/24',
          },
        ],

        // rt-private에는 IGW 경로가 없음 -> 즉 프라이빗 서브넷
        routeTable: [
          {
            id: 'rt-p',
            name: 'rt-private',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            routes: [],
            associations: [{ subnetId: 'subnet-private' }],
          },
        ],
      };

      const reqs: NetworkRequirements = {
        natGateway: { 'nat-1': { requirePublicSubnet: true } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(
        NetworkFeedbackScenarios.NAT_GW_IN_WRONG_SUBNET,
      );
    });
  });

  // --- [Case 6] NACL Scenarios ---
  describe('NACL Scenarios', () => {
    it('allowAllTraffic 요구사항이 있는데 Allow All 규칙이 없으면 NACL_DENY_TRAFFIC 피드백을 반환해야 한다', () => {
      const config: SubmitConfig = {
        nacl: [
          {
            id: 'nacl-1',
            name: 'nacl-1',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            entries: [
              // Deny All만 있거나 Allow All이 누락된 경우
              {
                ruleNumber: '100',
                protocol: '6',
                ruleAction: 'deny',
                egress: false,
                cidrBlock: '0.0.0.0/0',
                portRange: 'ALL',
              },
            ],
          },
        ],
      };
      const reqs: NetworkRequirements = {
        nacl: { 'nacl-1': { allowAllTraffic: true } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(NetworkFeedbackScenarios.NACL_DENY_TRAFFIC);
    });

    it('Inbound/Outbound 모두 Allow All이 있어야 통과한다', () => {
      const config: SubmitConfig = {
        nacl: [
          {
            id: 'nacl-1',
            name: 'nacl-1',
            vpcId: 'vpc-1',
            vpcName: 'vpc-1',
            entries: [
              // Inbound Allow
              {
                ruleNumber: '100',
                protocol: '-1',
                ruleAction: 'allow',
                egress: false,
                cidrBlock: '0.0.0.0/0',
                portRange: 'ALL',
              },
              // Outbound Allow (egress: 'true' as string per DTO)
              {
                ruleNumber: '100',
                protocol: '-1',
                ruleAction: 'allow',
                egress: true,
                cidrBlock: '0.0.0.0/0',
                portRange: 'ALL',
              },
            ],
          },
        ],
      };
      const reqs: NetworkRequirements = {
        nacl: { 'nacl-1': { allowAllTraffic: true } },
      };

      const result = handler.validate(config, reqs);
      expect(result).toHaveLength(0);
    });
  });
});
