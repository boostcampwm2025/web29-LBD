import { Injectable } from '@nestjs/common';
import {
  S3Config,
  SubnetConfig,
  VPCConfig,
} from 'src/problems/types/service-config-type.enum';
import {
  SubmitConfig,
  SubmitRequestDto,
} from 'src/problems/dto/submit-request.dto';
import { FeedbackDto } from 'src/problems/dto/submit-response.dto';
import {
  EC2ServiceFeedbackType,
  RouteTableServiceFeedbackType,
  S3ServiceFeedbackType,
  SubnetServiceFeedbackType,
  VPCServiceFeedbackType,
} from '../../types/field-validation-feedback-types';
import { ValidationHandler } from './validation.handler';
import { containsCidr, isCidrOverlap } from '../utils/cidr-utils';

@Injectable()
export class FieldValidationHandler implements ValidationHandler {
  private readonly CIDR_REGEX =
    /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\/(3[0-2]|[1-2][0-9]|[0-9])$/;
  private readonly BUCKET_NAME_REGEX = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;

  validate(submitRequestDto: SubmitRequestDto): FeedbackDto[] {
    return this.validateField(submitRequestDto.submitConfig);
  }

  private validateField(submitConfig: SubmitConfig): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    // VPC 검사
    if (submitConfig.vpc) {
      feedbacks.push(...this.validateVPCField(submitConfig.vpc));
    }

    // Subnet 검사
    if (submitConfig.subnet) {
      feedbacks.push(
        ...this.validateSubnetField(
          submitConfig.subnet,
          submitConfig.vpc || [],
        ),
      );
    }

    // EC2 검사
    if (submitConfig.ec2) {
      feedbacks.push(...this.validateEC2Field(submitConfig));
    }

    // S3 검사
    if (submitConfig.s3) {
      feedbacks.push(...this.validateS3Field(submitConfig.s3));
    }

    // RouteTable 검사
    if (submitConfig.routeTable) {
      feedbacks.push(...this.validateRouteTableField(submitConfig));
    }

    return feedbacks;
  }

  private validateVPCField(vpcConfigs: VPCConfig[]): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    // 1. 이름 중복 검사
    const vpcNames = vpcConfigs.map((c) => c['name']);
    const duplicatedNames = this.getDuplicatedValues(vpcNames);
    if (duplicatedNames.length > 0) {
      feedbacks.push({
        field: 'vpc',
        code: VPCServiceFeedbackType.VPC_NAME_DUPLICATED,
        message: `중복된 VPC Name이 존재합니다. ${duplicatedNames.join(', ')}`,
      });
    }

    // 2. CIDR 검사 (형식 및 크기)
    for (const config of vpcConfigs) {
      const cidr = config['cidrBlock'];
      const name = config['name'];

      if (!this.validateCIDRBlock(cidr)) {
        feedbacks.push({
          field: 'vpc',
          code: VPCServiceFeedbackType.CIDR_BLOCK_INVALID,
          message: `VPC ${name}의 CIDR 블록 형식이 올바르지 않습니다. (${cidr})`,
        });
        continue;
      }

      const prefix = parseInt(cidr.split('/')[1], 10);
      if (prefix < 16 || prefix > 28) {
        feedbacks.push({
          field: 'vpc',
          code: VPCServiceFeedbackType.VPC_CIDR_BLOCK_SIZE_INVALID,
          message: `VPC ${name}의 CIDR 블록 크기가 올바르지 않습니다. (${cidr})`,
        });
      }
    }

    // 3. VPC 간 CIDR 겹침 검사
    for (let i = 0; i < vpcConfigs.length; i++) {
      for (let j = i + 1; j < vpcConfigs.length; j++) {
        const cidr1 = vpcConfigs[i]['cidrBlock'];
        const cidr2 = vpcConfigs[j]['cidrBlock'];

        if (isCidrOverlap(cidr1, cidr2)) {
          feedbacks.push({
            field: 'vpc',
            code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
            message: `VPC ${vpcConfigs[i]['name']}와 VPC ${vpcConfigs[j]['name']}의 CIDR 블록이 겹칩니다. (${cidr1} , ${cidr2})`,
          });
        }
      }
    }

    return feedbacks;
  }

  private validateSubnetField(
    subnetConfigs: SubnetConfig[],
    vpcConfigs: VPCConfig[],
  ): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    // 1. 이름 중복 검사
    const subnetNames = subnetConfigs.map((c) => c['name']);
    const duplicatedNames = this.getDuplicatedValues(subnetNames);
    if (duplicatedNames.length > 0) {
      feedbacks.push({
        field: 'subnet',
        code: SubnetServiceFeedbackType.SUBNET_NAME_DUPLICATED,
        message: `중복된 Subnet Name이 존재합니다. ${duplicatedNames.join(', ')}`,
      });
    }

    const vpcCidrMap = new Map<string, string>();
    vpcConfigs.forEach((vpc) => vpcCidrMap.set(vpc['name'], vpc['cidrBlock']));

    const vpcSubnetMap: Record<string, SubnetConfig[]> = {};

    // 2. 단일 Subnet 검사 (CIDR 형식, VPC 포함 여부)
    for (const config of subnetConfigs) {
      const cidr = config['cidrBlock'];
      const vpcName = config['vpcName'];
      const name = config['name'];

      // 그룹핑 먼저 진행
      if (!vpcSubnetMap[vpcName]) vpcSubnetMap[vpcName] = [];
      vpcSubnetMap[vpcName].push(config);

      const vpcCidr = vpcCidrMap.get(vpcName);

      if (!vpcCidr) {
        feedbacks.push({
          field: 'subnet',
          code: SubnetServiceFeedbackType.NO_VPC_EXIST,
          message: `Subnet ${name}이(가) 존재하지 않는 VPC ${vpcName}을(를) 참조하고 있습니다.`,
        });
        continue;
      }

      if (!this.validateCIDRBlock(cidr)) {
        feedbacks.push({
          field: 'subnet',
          code: SubnetServiceFeedbackType.CIDR_BLOCK_INVALID,
          message: `Subnet ${name}의 CIDR 블록 형식이 올바르지 않습니다. (${cidr})`,
        });
      }

      if (!containsCidr(vpcCidr, cidr)) {
        feedbacks.push({
          field: 'subnet',
          code: SubnetServiceFeedbackType.SUBNET_CIDR_OUT_OF_VPC_CIDR,
          message: `Subnet ${name}의 CIDR 블록이 VPC ${vpcName}의 CIDR 블록 범위를 벗어났습니다. (${cidr} not in ${vpcCidr})`,
        });
      }
    }

    // 3. 같은 VPC 내 Subnet 간 겹침 검사
    for (const vpcName in vpcSubnetMap) {
      const subnets = vpcSubnetMap[vpcName];
      for (let i = 0; i < subnets.length; i++) {
        for (let j = i + 1; j < subnets.length; j++) {
          const cidr1 = subnets[i]['cidrBlock'];
          const cidr2 = subnets[j]['cidrBlock'];

          if (isCidrOverlap(cidr1, cidr2)) {
            feedbacks.push({
              field: 'subnet',
              code: SubnetServiceFeedbackType.SUBNET_CIDR_OVERLAP,
              message: `VPC ${vpcName} 내 Subnet ${subnets[i]['name']}와 Subnet ${subnets[j]['name']}의 CIDR 블록이 겹칩니다. (${cidr1}, ${cidr2})`,
            });
          }
        }
      }
    }

    return feedbacks;
  }

  private validateEC2Field(submitConfig: SubmitConfig): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];
    const ec2Configs = submitConfig.ec2 || [];
    const vpcConfigs = submitConfig.vpc || [];
    const subnetConfigs = submitConfig.subnet || [];
    const sgConfigs = submitConfig.securityGroups || [];

    // 1. 이름 중복 검사
    const ec2Names = ec2Configs.map((c) => c['name']);
    const duplicatedNames = this.getDuplicatedValues(ec2Names);
    if (duplicatedNames.length > 0) {
      feedbacks.push({
        field: 'ec2',
        code: EC2ServiceFeedbackType.EC2_NAME_DUPLICATED,
        message: `중복된 EC2 Name이 존재합니다. ${duplicatedNames.join(', ')}`,
      });
    }

    const vpcNameSet = new Set(vpcConfigs.map((c) => c['name']));
    const subnetNameSet = new Set(subnetConfigs.map((c) => c['name']));
    const sgVpcMap = new Map<string, string>(); // SG Name -> VPC Name
    sgConfigs.forEach((sg) => sgVpcMap.set(sg['name'], sg['vpcName']));

    for (const config of ec2Configs) {
      const name = config['name'];
      const vpcName = config['vpcName'];
      const subnetName = config['subnetName'];

      // 2. VPC 존재 여부
      if (!vpcNameSet.has(vpcName)) {
        feedbacks.push({
          field: 'ec2',
          code: EC2ServiceFeedbackType.NO_VPC_EXIST,
          message: `EC2 ${name}가 존재하지 않는 VPC ${vpcName}를 참조하고 있습니다.`,
        });
      }

      // 3. Subnet 존재 여부
      if (!subnetNameSet.has(subnetName)) {
        feedbacks.push({
          field: 'ec2',
          code: EC2ServiceFeedbackType.NO_SUBNET_EXIST,
          message: `EC2 ${name}가 존재하지 않는 Subnet ${subnetName}를 참조하고 있습니다.`,
        });
      }

      // 4. SG 참조 검사 (다른 VPC의 SG 참조 불가)
      const targetSgNames = config['securityGroups'] || [];
      for (const sgName of targetSgNames) {
        const sgVpc = sgVpcMap.get(sgName);
        // sgVpc가 존재하고 현재 EC2의 vpcName과 다르면 에러
        if (sgVpc && sgVpc !== vpcName) {
          feedbacks.push({
            field: 'ec2',
            code: EC2ServiceFeedbackType.CANT_REF_SG_IN_OTHER_VPC,
            message: `EC2 ${name}가 다른 VPC의 Security Group ${sgName}를 참조하고 있습니다.`,
          });
        }
      }
    }

    return feedbacks;
  }

  private validateS3Field(s3Configs: S3Config[]): FeedbackDto[] {
    const feedbacks: FeedbackDto[] = [];

    // 1. 이름 중복 검사
    const bucketNames = s3Configs.map((c) => c['name']);
    const duplicatedNames = this.getDuplicatedValues(bucketNames);
    if (duplicatedNames.length > 0) {
      feedbacks.push({
        field: 's3',
        code: S3ServiceFeedbackType.BUCKET_NAME_DUPLICATED,
        message: `중복된 S3 버킷 이름이 존재합니다. ${duplicatedNames.join(', ')}`,
      });
    }

    // 2. 이름 형식 검사
    for (const config of s3Configs) {
      const name = config['name'];
      if (
        name.length < 3 ||
        name.length > 63 ||
        !this.BUCKET_NAME_REGEX.test(name)
      ) {
        feedbacks.push({
          field: 's3',
          code: S3ServiceFeedbackType.BUCKET_NAME_INVALID,
          message: `S3 버킷 이름이 올바르지 않습니다. (${name})`,
        });
      }
    }

    return feedbacks;
  }

  private validateRouteTableField(submitConfig: SubmitConfig): FeedbackDto[] {
    const routeTableConfigs = submitConfig.routeTable || [];
    const internetGateways = submitConfig.internetGateway || [];
    const feedbacks: FeedbackDto[] = [];

    const igwIdSet = new Set(internetGateways.map((igw) => igw.id));

    for (const config of routeTableConfigs) {
      const name = config['name'];
      const routes = config['routes'] || [];

      // 1. 이름 길이 검사
      if (name.length < 1 || name.length > 255) {
        feedbacks.push({
          field: 'routeTable',
          code: RouteTableServiceFeedbackType.ROUTE_TABLE_NAME_INVALID,
          message: `라우트 테이블 ${name}의 이름 길이가 올바르지 않습니다.`,
        });
      }

      for (const route of routes) {
        const cidr = route['destinationCidr'];
        const targetGateway = route['targetGatewayId'];

        // 2. CIDR 형식 검사
        if (!this.validateCIDRBlock(cidr)) {
          feedbacks.push({
            field: 'routeTable',
            code: RouteTableServiceFeedbackType.ROUTE_CIDR_INVALID,
            message: `라우트 테이블 ${name}의 라우트 대상 CIDR 블록 형식이 올바르지 않습니다. (${cidr})`,
          });
        }

        // 3. 게이트웨이 존재 여부 검사
        if (targetGateway && !igwIdSet.has(targetGateway)) {
          feedbacks.push({
            field: 'routeTable',
            code: RouteTableServiceFeedbackType.TARGET_RESOURCE_NOT_EXIST,
            message: `라우트 테이블 ${name}의 라우트가 존재하지 않는 게이트웨이 ${targetGateway}를 참조하고 있습니다.`,
          });
        }
      }
    }

    return feedbacks;
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
