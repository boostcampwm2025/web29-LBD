import { Injectable } from '@nestjs/common';
import { SubmitConfig } from '@/problems/dto/submit-request.dto';
import { FeedbackDto } from '@/problems/dto/submit-response.dto';
import { NetworkRequirements } from '@/problems/types/requirements-types';
import { NetworkFeedbackScenarios } from '@/problems/types/unit-problem-feedback-types';

@Injectable()
export class NetworkScenarioHandler {
  validate(
    submitConfig: SubmitConfig,
    requirements: NetworkRequirements | undefined,
  ): FeedbackDto[] {
    if (!requirements) return [];
    const feedbacks: FeedbackDto[] = [];

    // 1. VPC 검증
    if (requirements.vpc) {
      feedbacks.push(
        ...this.validateVpcRequirements(submitConfig, requirements.vpc),
      );
    }

    // 2. Route Table 검증
    if (requirements.routeTable) {
      feedbacks.push(
        ...this.validateRouteTableRequirements(
          submitConfig,
          requirements.routeTable,
        ),
      );
    }

    // 3. Subnet 검증
    if (requirements.subnet) {
      feedbacks.push(
        ...this.validateSubnetRequirements(submitConfig, requirements.subnet),
      );
    }

    // 4. NAT Gateway 검증
    if (requirements.natGateway) {
      feedbacks.push(
        ...this.validateNatRequirements(submitConfig, requirements.natGateway),
      );
    }

    // 5. NACL 검증 (구조 가정)
    if (requirements.nacl) {
      feedbacks.push(
        ...this.validateNaclRequirements(submitConfig, requirements.nacl),
      );
    }

    return feedbacks;
  }

  // VPC Validation
  private validateVpcRequirements(
    config: SubmitConfig,
    reqs: NetworkRequirements['vpc'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const igws = config.internetGateway || [];

    for (const [vpcName, req] of Object.entries(reqs ?? {})) {
      // 1. IGW_NOT_ATTACHED
      if (req.requireIgwAttached) {
        const attachedIgw = igws.find((igw) => igw.vpcName === vpcName);
        if (!attachedIgw) {
          feedbacks.push({
            serviceType: 'vpc',
            service: vpcName,
            code: NetworkFeedbackScenarios.IGW_NOT_ATTACHED,
            message: `VPC ${vpcName}에 인터넷 게이트웨이가 연결되어 있지 않습니다.`,
          });
        }
      }
    }

    return feedbacks;
  }

  // Route Table Validation
  private validateRouteTableRequirements(
    config: SubmitConfig,
    reqs: NetworkRequirements['routeTable'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const rts = config.routeTable || [];

    for (const [rtName, req] of Object.entries(reqs ?? {})) {
      const rt = rts.find((r) => r.name === rtName);
      if (!rt) continue; // 존재 여부는 UnitValidation에서 처리

      // 2. ROUTES_TO_IGW_MISSING
      if (req.requireIgwRoute) {
        const hasIgwRoute = rt.routes?.some(
          (r) =>
            r.destinationCidr === '0.0.0.0/0' &&
            r.targetGatewayId?.startsWith('igw-'),
        );
        if (!hasIgwRoute) {
          feedbacks.push({
            serviceType: 'routeTable',
            service: rtName,
            field: 'routes',
            code: NetworkFeedbackScenarios.ROUTES_TO_IGW_MISSING,
            message: `라우트 테이블 ${rtName}에 인터넷 게이트웨이(IGW)로 향하는 경로가 없습니다.`,
          });
        }
      }

      // 3. NAT_GW_MISSING_IN_ROUTE
      if (req.requireNatRoute) {
        const hasNatRoute = rt.routes?.some(
          (r) =>
            r.destinationCidr === '0.0.0.0/0' &&
            r.targetGatewayId?.startsWith('nat-'),
        );
        if (!hasNatRoute) {
          feedbacks.push({
            serviceType: 'routeTable',
            service: rtName,
            field: 'routes',
            code: NetworkFeedbackScenarios.NAT_GW_MISSING_IN_ROUTE,
            message: `라우트 테이블 ${rtName}에 NAT 게이트웨이로 향하는 경로가 없습니다.`,
          });
        }
      }
    }
    return feedbacks;
  }

  // Subnet Validation
  private validateSubnetRequirements(
    config: SubmitConfig,
    reqs: NetworkRequirements['subnet'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const subnets = config.subnet || [];
    const rts = config.routeTable || [];

    const getRtForSubnet = (subnetName: string) => {
      return rts.find(
        (rt) => rt.associations?.some((assoc) => assoc.subnetId === subnetName), // subnetId가 name이라고 가정
      );
    };

    for (const [subnetName, req] of Object.entries(reqs ?? {})) {
      const subnet = subnets.find((s) => s.name === subnetName);
      if (!subnet) continue;

      const associatedRt = getRtForSubnet(subnetName);

      // 3. SUBNET_RT_ASSOCIATION_MISSING
      if (req.requireRouteTable) {
        if (!associatedRt || associatedRt.name !== req.requireRouteTable) {
          feedbacks.push({
            serviceType: 'routeTable',
            service: associatedRt?.name,
            field: 'associations',
            code: NetworkFeedbackScenarios.SUBNET_RT_ASSOCIATION_MISSING,
            message: `서브넷 ${subnetName}이(가) 올바른 라우트 테이블(${req.requireRouteTable})과 연결되지 않았습니다.`,
          });
        }
      }

      // 4. PRIVATE_SUBNET_HAS_IGW_ROUTE
      if (req.isPrivate && associatedRt) {
        const hasIgwRoute = associatedRt.routes?.some(
          (r) =>
            r.destinationCidr === '0.0.0.0/0' &&
            r.targetGatewayId?.startsWith('igw-'),
        );

        if (hasIgwRoute) {
          feedbacks.push({
            serviceType: 'routeTable',
            service: associatedRt?.name,
            field: 'associations',
            code: NetworkFeedbackScenarios.PRIVATE_SUBNET_HAS_IGW_ROUTE,
            message: `프라이빗 서브넷 ${subnetName}에 인터넷 게이트웨이로 향하는 경로가 설정되어 있습니다. (보안 위배)`,
          });
        }
      }
    }
    return feedbacks;
  }

  // NAT Gateway Validation
  private validateNatRequirements(
    config: SubmitConfig,
    reqs: NetworkRequirements['natGateway'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const nats = config.natGateway || [];
    const rts = config.routeTable || [];

    const isPublicSubnet = (subnetName: string): boolean => {
      const rt = rts.find((rt) =>
        rt.associations?.some((assoc) => assoc.subnetId === subnetName),
      );
      return !!rt?.routes?.some(
        (r) =>
          r.destinationCidr === '0.0.0.0/0' &&
          r.targetGatewayId?.startsWith('igw-'),
      );
    };

    for (const [natName, req] of Object.entries(reqs ?? {})) {
      const nat = nats.find((n) => n.name === natName);
      if (!nat) continue;

      // 4. NAT_GW_IN_WRONG_SUBNET
      if (req.requirePublicSubnet) {
        const placedSubnet = nat.subnetName;
        if (!isPublicSubnet(placedSubnet)) {
          feedbacks.push({
            serviceType: 'natGateway',
            service: natName,
            field: 'subnetName',
            code: NetworkFeedbackScenarios.NAT_GW_IN_WRONG_SUBNET,
            message: `NAT 게이트웨이 ${natName}가 프라이빗 서브넷(${placedSubnet})에 배치되었습니다. 퍼블릭 서브넷으로 이동하세요.`,
          });
        }
      }
    }
    return feedbacks;
  }

  // NACL Validation
  private validateNaclRequirements(
    config: SubmitConfig,
    reqs: NetworkRequirements['nacl'],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const nacls = config.nacl || [];

    for (const [naclName, req] of Object.entries(reqs ?? {})) {
      const nacl = nacls.find((n) => n.name === naclName);
      if (!nacl) continue;

      // 5. NACL_DENY_TRAFFIC
      if (req.allowAllTraffic) {
        // 인바운드/아웃바운드 규칙 중 Allow All (RuleNumber 100 등)이 있는지 확인
        const hasAllowAllInbound = nacl.entries?.some(
          (e) =>
            !e.egress &&
            e.ruleAction === 'allow' &&
            e.cidrBlock === '0.0.0.0/0',
        );
        const hasAllowAllOutbound = nacl.entries?.some(
          (e) =>
            e.egress && e.ruleAction === 'allow' && e.cidrBlock === '0.0.0.0/0',
        );

        if (!hasAllowAllInbound || !hasAllowAllOutbound) {
          feedbacks.push({
            serviceType: 'networkAcl',
            service: naclName,
            field: 'entries',
            code: NetworkFeedbackScenarios.NACL_DENY_TRAFFIC,
            message: `네트워크 ACL ${naclName}이(가) 모든 트래픽을 허용하지 않습니다. 연결 문제가 발생할 수 있습니다.`,
          });
        }
      }
    }
    return feedbacks;
  }
}
