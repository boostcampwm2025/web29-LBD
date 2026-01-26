import { Injectable } from '@nestjs/common';
import {
  S3Config,
  SubnetConfig,
  VPCConfig,
} from '@/problems/types/service-config-type.enum';
import {
  SubmitConfig,
  SubmitRequestDto,
} from '@/problems/dto/submit-request.dto';
import { FeedbackDto } from '@/problems/dto/submit-response.dto';
import {
  EC2ServiceFeedbackType,
  RouteTableServiceFeedbackType,
  S3ServiceFeedbackType,
  SubnetServiceFeedbackType,
  VPCServiceFeedbackType,
} from '@/problems/types/field-validation-feedback-types';
import { ValidationHandler } from './validation.handler';
import { containsCidr, isCidrOverlap } from '../utils/cidr-utils';
import { removeUndefined } from '../utils/refine-request';

@Injectable()
export class FieldValidationHandler implements ValidationHandler {
  private readonly CIDR_REGEX =
    /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\/(3[0-2]|[1-2][0-9]|[0-9])$/;
  private readonly BUCKET_NAME_REGEX = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;

  validate(submitRequestDto: SubmitRequestDto): FeedbackDto[] {
    return this.validateAllFields(submitRequestDto.submitConfig);
  }

  private validateAllFields(submitConfig: SubmitConfig): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    if (submitConfig.vpc) {
      feedbacks.push(...this.validateVpcs(submitConfig.vpc));
    }
    if (submitConfig.subnet) {
      feedbacks.push(
        ...this.validateSubnets(submitConfig.subnet, submitConfig.vpc || []),
      );
    }
    if (submitConfig.ec2) {
      feedbacks.push(...this.validateEc2Instances(submitConfig));
    }
    if (submitConfig.s3) {
      feedbacks.push(...this.validateS3Buckets(submitConfig.s3));
    }
    if (submitConfig.routeTable) {
      feedbacks.push(...this.validateRouteTables(submitConfig));
    }

    return feedbacks;
  }

  private validateVpcs(vpcConfigs: VPCConfig[]): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    const refinedVpcConfigs = vpcConfigs.map((config) =>
      removeUndefined(config),
    );

    // 1. 이름 중복 검사
    feedbacks.push(
      ...this.generateDuplicateNameFeedbacks(
        refinedVpcConfigs,
        'vpc',
        VPCServiceFeedbackType.VPC_NAME_DUPLICATED,
        '중복된 VPC Name이 존재합니다.',
      ),
    );

    // 2. CIDR 검사 (형식 및 크기)
    for (const config of refinedVpcConfigs) {
      const cidr = config['cidrBlock'];
      const name = config['name'];

      if (!this.validateCIDRBlock(cidr)) {
        feedbacks.push({
          serviceType: 'vpc',
          service: name,
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.CIDR_BLOCK_INVALID,
          message: `VPC ${name}의 CIDR 블록 형식이 올바르지 않습니다. (${cidr})`,
        });
        continue;
      }

      const prefix = parseInt(cidr.split('/')[1], 10);
      if (prefix < 16 || prefix > 28) {
        feedbacks.push({
          serviceType: 'vpc',
          service: name,
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_BLOCK_SIZE_INVALID,
          message: `VPC ${name}의 CIDR 블록 크기가 올바르지 않습니다. (${cidr})`,
        });
      }
    }

    // 3. VPC 간 CIDR 겹침 검사
    for (let i = 0; i < refinedVpcConfigs.length; i++) {
      for (let j = i + 1; j < refinedVpcConfigs.length; j++) {
        const configA = refinedVpcConfigs[i];
        const configB = refinedVpcConfigs[j];

        if (isCidrOverlap(configA.cidrBlock, configB.cidrBlock)) {
          feedbacks.push(
            {
              serviceType: 'vpc',
              service: configA.name,
              field: 'cidrBlock',
              code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
              message: `VPC ${configA.name}와 VPC ${configB.name}의 CIDR 블록이 겹칩니다. (${configA.cidrBlock} , ${configB.cidrBlock})`,
            },
            {
              serviceType: 'vpc',
              service: configB.name,
              field: 'cidrBlock',
              code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
              message: `VPC ${configB.name}와 VPC ${configA.name}의 CIDR 블록이 겹칩니다. (${configB.cidrBlock} , ${configA.cidrBlock})`,
            },
          );
        }
      }
    }

    return feedbacks;
  }

  private validateSubnets(
    subnetConfigs: SubnetConfig[],
    vpcConfigs: VPCConfig[],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    const refinedSubnetConfigs = subnetConfigs.map((config) =>
      removeUndefined(config),
    );

    // 1. 이름 중복 검사
    feedbacks.push(
      ...this.generateDuplicateNameFeedbacks(
        refinedSubnetConfigs,
        'subnet',
        SubnetServiceFeedbackType.SUBNET_NAME_DUPLICATED,
        '중복된 Subnet Name이 존재합니다.',
      ),
    );

    const vpcCidrMap = new Map<string, string>();
    vpcConfigs.forEach((vpc) => vpcCidrMap.set(vpc.name, vpc.cidrBlock));

    const vpcSubnetMap: Record<string, SubnetConfig[]> = {};

    // 2. 단일 Subnet 검사
    for (const config of refinedSubnetConfigs) {
      const { cidrBlock, vpcName, name } = config;

      // 그룹핑
      if (!vpcSubnetMap[vpcName]) vpcSubnetMap[vpcName] = [];
      vpcSubnetMap[vpcName].push(config);

      const vpcCidr = vpcCidrMap.get(vpcName);

      if (!vpcCidr) {
        feedbacks.push({
          serviceType: 'subnet',
          service: name,
          field: 'vpcId',
          code: SubnetServiceFeedbackType.NO_VPC_EXIST,
          message: `Subnet ${name}이 존재하지 않는 VPC ${vpcName}를 참조하고 있습니다.`,
        });
        continue;
      }

      if (!this.validateCIDRBlock(cidrBlock)) {
        feedbacks.push({
          serviceType: 'subnet',
          service: name,
          field: 'cidrBlock',
          code: SubnetServiceFeedbackType.CIDR_BLOCK_INVALID,
          message: `Subnet ${name}의 CIDR 블록 형식이 올바르지 않습니다. (${cidrBlock})`,
        });
      }

      if (!containsCidr(vpcCidr, cidrBlock)) {
        feedbacks.push({
          serviceType: 'subnet',
          service: name,
          field: 'cidrBlock',
          code: SubnetServiceFeedbackType.SUBNET_CIDR_OUT_OF_VPC_CIDR,
          message: `Subnet ${name}의 CIDR 블록이 VPC ${vpcName}의 CIDR 블록 범위를 벗어났습니다. (${cidrBlock} not in ${vpcCidr})`,
        });
      }
    }

    // 3. 같은 VPC 내 Subnet 간 겹침 검사
    for (const vpcName in vpcSubnetMap) {
      const subnets = vpcSubnetMap[vpcName];
      for (let i = 0; i < subnets.length; i++) {
        for (let j = i + 1; j < subnets.length; j++) {
          const subA = subnets[i];
          const subB = subnets[j];

          if (isCidrOverlap(subA.cidrBlock, subB.cidrBlock)) {
            feedbacks.push(
              {
                serviceType: 'subnet',
                service: subA.name,
                field: 'cidrBlock',
                code: SubnetServiceFeedbackType.SUBNET_CIDR_OVERLAP,
                message: `VPC ${vpcName} 내 Subnet ${subA.name}와 Subnet ${subB.name}의 CIDR 블록이 겹칩니다. (${subA.cidrBlock}, ${subB.cidrBlock})`,
              },
              {
                serviceType: 'subnet',
                service: subB.name,
                field: 'cidrBlock',
                code: SubnetServiceFeedbackType.SUBNET_CIDR_OVERLAP,
                message: `VPC ${vpcName} 내 Subnet ${subB.name}와 Subnet ${subA.name}의 CIDR 블록이 겹칩니다. (${subB.cidrBlock}, ${subA.cidrBlock})`,
              },
            );
          }
        }
      }
    }

    return feedbacks;
  }

  private validateEc2Instances(submitConfig: SubmitConfig): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const ec2Configs = submitConfig.ec2 || [];
    const vpcConfigs = submitConfig.vpc || [];
    const subnetConfigs = submitConfig.subnet || [];
    const sgConfigs = submitConfig.securityGroups || [];

    const refinedEc2Configs = ec2Configs.map((config) =>
      removeUndefined(config),
    );
    const refinedVpcConfigs = vpcConfigs.map((config) =>
      removeUndefined(config),
    );
    const refinedSubnetConfigs = subnetConfigs.map((config) =>
      removeUndefined(config),
    );
    const refinedSgConfigs = sgConfigs.map((config) => removeUndefined(config));

    // 1. 이름 중복 검사
    feedbacks.push(
      ...this.generateDuplicateNameFeedbacks(
        refinedEc2Configs,
        'ec2',
        EC2ServiceFeedbackType.EC2_NAME_DUPLICATED,
        '중복된 EC2 Name이 존재합니다.',
      ),
    );

    const vpcNameSet = new Set(refinedVpcConfigs.map((c) => c.name));
    const subnetNameSet = new Set(refinedSubnetConfigs.map((c) => c.name));
    const sgVpcMap = new Map<string, string>(); // SG Name -> VPC Name
    refinedSgConfigs.forEach((sg) => sgVpcMap.set(sg.name, sg.vpcName));

    for (const config of refinedEc2Configs) {
      const {
        name,
        vpcName,
        subnetName,
        securityGroups: targetSgNames,
      } = config;

      // 2. VPC 존재 여부
      if (!vpcNameSet.has(vpcName)) {
        feedbacks.push({
          serviceType: 'ec2',
          service: name,
          field: 'vpcId',
          code: EC2ServiceFeedbackType.NO_VPC_EXIST,
          message: `EC2 ${name}가 존재하지 않는 VPC ${vpcName}를 참조하고 있습니다.`,
        });
      }

      // 3. Subnet 존재 여부
      if (!subnetNameSet.has(subnetName)) {
        feedbacks.push({
          serviceType: 'ec2',
          service: name,
          field: 'subnetId',
          code: EC2ServiceFeedbackType.NO_SUBNET_EXIST,
          message: `EC2 ${name}가 존재하지 않는 Subnet ${subnetName}를 참조하고 있습니다.`,
        });
      }

      // 4. SG 참조 검사 (다른 VPC의 SG 참조 불가)
      const sgNames = targetSgNames || [];
      for (const sgName of sgNames) {
        const sgVpc = sgVpcMap.get(sgName);
        if (sgVpc && sgVpc !== vpcName) {
          feedbacks.push({
            serviceType: 'ec2',
            service: name,
            field: 'securityGroups',
            code: EC2ServiceFeedbackType.CANT_REF_SG_IN_OTHER_VPC,
            message: `EC2 ${name}가 다른 VPC의 Security Group ${sgName}를 참조하고 있습니다.`,
          });
        }
      }
    }

    return feedbacks;
  }

  private validateS3Buckets(s3Configs: S3Config[]): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const refinedS3Configs = s3Configs.map((config) => removeUndefined(config));

    // 1. 이름 중복 검사
    feedbacks.push(
      ...this.generateDuplicateNameFeedbacks(
        refinedS3Configs,
        's3',
        S3ServiceFeedbackType.BUCKET_NAME_DUPLICATED,
        '중복된 S3 버킷 이름이 존재합니다.',
      ),
    );

    // 2. 이름 형식 검사
    for (const config of refinedS3Configs) {
      const name = config.name;
      if (
        name.length < 3 ||
        name.length > 63 ||
        !this.BUCKET_NAME_REGEX.test(name)
      ) {
        feedbacks.push({
          serviceType: 's3',
          service: name,
          field: 'name',
          code: S3ServiceFeedbackType.BUCKET_NAME_INVALID,
          message: `S3 버킷 이름이 올바르지 않습니다. (${name})`,
        });
      }
    }

    return feedbacks;
  }

  private validateRouteTables(submitConfig: SubmitConfig): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const routeTableConfigs = submitConfig.routeTable || [];
    const internetGateways = submitConfig.internetGateway || [];

    const refinedRouteTableConfigs = routeTableConfigs.map((config) =>
      removeUndefined(config),
    );
    const refinedInternetGateways = internetGateways.map((igw) =>
      removeUndefined(igw),
    );

    const igwIdSet = new Set(refinedInternetGateways.map((igw) => igw.id));

    for (const config of refinedRouteTableConfigs) {
      const name = config.name;
      const routes = config.routes || [];

      // 1. 이름 길이 검사
      if (name.length < 1 || name.length > 255) {
        feedbacks.push({
          serviceType: 'routeTable',
          service: name,
          field: 'name',
          code: RouteTableServiceFeedbackType.ROUTE_TABLE_NAME_INVALID,
          message: `라우트 테이블 ${name}의 이름 길이가 올바르지 않습니다.`,
        });
      }

      for (const route of routes) {
        const cidr = route.destinationCidr;
        const targetGateway = route.targetGatewayId;

        // 2. CIDR 형식 검사
        if (!this.validateCIDRBlock(cidr)) {
          feedbacks.push({
            serviceType: 'routeTable',
            service: name,
            field: 'routeTable',
            code: RouteTableServiceFeedbackType.ROUTE_CIDR_INVALID,
            message: `라우트 테이블 ${name}의 라우트 대상 CIDR 블록 형식이 올바르지 않습니다. (${cidr})`,
          });
        }

        // 3. 게이트웨이 존재 여부 검사
        if (targetGateway && !igwIdSet.has(targetGateway)) {
          feedbacks.push({
            serviceType: 'routeTable',
            service: name,
            field: 'routeTable',
            code: RouteTableServiceFeedbackType.TARGET_RESOURCE_NOT_EXIST,
            message: `라우트 테이블 ${name}의 라우트가 존재하지 않는 게이트웨이 ${targetGateway}를 참조하고 있습니다.`,
          });
        }
      }
    }

    return feedbacks;
  }

  private generateDuplicateNameFeedbacks<T extends { name: string }>(
    configs: T[],
    serviceType: string,
    code: string,
    baseMessage: string,
  ): FeedbackDto[] {
    const names = configs.map((c) => c.name);
    const duplicatedNames = this.getDuplicatedValues(names);

    if (duplicatedNames.length === 0) {
      return [];
    }

    return duplicatedNames
      .map((name) => ({
        serviceType,
        service: name,
        field: 'name',
        code,
        message: `${baseMessage}${serviceType !== 'subnet' && serviceType !== 'ec2' && serviceType !== 's3' ? ' ' + name : ''}`,
      }))
      .map((feedback) => {
        if (serviceType === 'vpc') return feedback;

        return feedback;
      });
  }

  private getDuplicatedValues<T>(values: T[]): T[] {
    const counts = new Map<T, number>();
    const duplicates: T[] = [];

    for (const value of values) {
      const count = (counts.get(value) || 0) + 1;
      counts.set(value, count);

      if (count === 2) {
        duplicates.push(value);
      }
    }
    return duplicates;
  }

  private validateCIDRBlock(cidr: string): boolean {
    return this.CIDR_REGEX.test(cidr);
  }
}
