import { Test, TestingModule } from '@nestjs/testing';
import { FieldValidationHandler } from '../../../../src/problems/validation/handlers/field-validation.handler';
import type { SubmitConfig } from 'src/problems/dto/submit-request.dto';
import { FeedbackDto } from 'src/problems/dto/submit-response.dto';
import { VPCConfig } from 'src/problems/types/service-config-type.enum';
import {
  EC2ServiceFeedbackType,
  RouteTableServiceFeedbackType,
  S3ServiceFeedbackType,
  SubnetServiceFeedbackType,
  VPCServiceFeedbackType,
} from '../../../../src/problems/types/field-validation-feedback-types';

describe('FieldValidationHandler', () => {
  let handler: FieldValidationHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldValidationHandler],
    }).compile();
    handler = module.get<FieldValidationHandler>(FieldValidationHandler);
  });
  // describe('validate', () => {});
  // describe('validateField', () => {});
  describe('validateVPCField', () => {
    it('중복된 vpc 이름이 존재할 경우 피드백을 반환한다', () => {
      const vpcConfigs: VPCConfig[] = [
        { id: '1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
        { id: '2', name: 'vpc-1', cidrBlock: '10.1.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateVPCField'](vpcConfigs);
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'name',
          code: VPCServiceFeedbackType.VPC_NAME_DUPLICATED,
          message: '중복된 VPC Name이 존재합니다. vpc-1',
        },
      ]);
    });

    it('잘못된 CIDR 블록 형식이 존재할 경우 피드백을 반환한다', () => {
      const vpcConfigs: VPCConfig[] = [
        { id: '1', name: 'vpc-1', cidrBlock: 'invalid-cidr' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateVPCField'](vpcConfigs);
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.CIDR_BLOCK_INVALID,
          message:
            'VPC vpc-1의 CIDR 블록 형식이 올바르지 않습니다. (invalid-cidr)',
        },
      ]);
    });

    it('겹치는 CIDR 블록이 존재할 경우 피드백을 반환한다', () => {
      const vpcConfigs: VPCConfig[] = [
        { id: '1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
        { id: '2', name: 'vpc-2', cidrBlock: '10.0.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateVPCField'](vpcConfigs);
      expect(feedbacks).toHaveLength(2);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
          message:
            'VPC vpc-1와 VPC vpc-2의 CIDR 블록이 겹칩니다. (10.0.0.0/16 , 10.0.0.0/16)',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-2',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
          message:
            'VPC vpc-2와 VPC vpc-1의 CIDR 블록이 겹칩니다. (10.0.0.0/16 , 10.0.0.0/16)',
        },
      ]);
    });

    it('CIDR 블록 크기는 16~28 사이여야 한다', () => {
      const vpcConfigs: VPCConfig[] = [
        { id: '1', name: 'vpc-1', cidrBlock: '10.0.0.0/15' },
        { id: '2', name: 'vpc-2', cidrBlock: '10.0.0.0/29' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateVPCField'](vpcConfigs);
      expect(feedbacks).toHaveLength(4);
      expect(feedbacks).toEqual([
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_BLOCK_SIZE_INVALID,
          message:
            'VPC vpc-1의 CIDR 블록 크기가 올바르지 않습니다. (10.0.0.0/15)',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-2',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_BLOCK_SIZE_INVALID,
          message:
            'VPC vpc-2의 CIDR 블록 크기가 올바르지 않습니다. (10.0.0.0/29)',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-1',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
          message:
            'VPC vpc-1와 VPC vpc-2의 CIDR 블록이 겹칩니다. (10.0.0.0/15 , 10.0.0.0/29)',
        },
        {
          serviceType: 'vpc',
          service: 'vpc-2',
          field: 'cidrBlock',
          code: VPCServiceFeedbackType.VPC_CIDR_OVERLAP,
          message:
            'VPC vpc-2와 VPC vpc-1의 CIDR 블록이 겹칩니다. (10.0.0.0/29 , 10.0.0.0/15)',
        },
      ]);
    });

    it('문제가 없는 경우 빈 배열을 반환한다', () => {
      const vpcConfigs: VPCConfig[] = [
        { id: '1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
        { id: '2', name: 'vpc-2', cidrBlock: '10.1.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateVPCField'](vpcConfigs);
      expect(feedbacks).toHaveLength(0);
    });
  });
  describe('validateSubnetField', () => {
    it('중복된 subnet 이름이 존재할 경우 피드백을 반환한다', () => {
      const subnetConfigs = [
        {
          id: '1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.0/24',
        },
        {
          id: '2',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.1.0/24',
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateSubnetField'](
        subnetConfigs,
        vpcConfigs,
      );
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'subnet',
          service: 'subnet-1',
          field: 'name',
          code: SubnetServiceFeedbackType.SUBNET_NAME_DUPLICATED,
          message: '중복된 Subnet Name이 존재합니다.',
        },
      ]);
    });
    it('잘못된 CIDR 블록 형식이 존재할 경우 피드백을 반환한다', () => {
      const subnetConfigs = [
        {
          id: '1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: 'invalid-cidr',
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateSubnetField'](
        subnetConfigs,
        vpcConfigs,
      );
      expect(feedbacks).toHaveLength(2);
      expect(feedbacks).toEqual([
        {
          serviceType: 'subnet',
          service: 'subnet-1',
          field: 'cidrBlock',
          code: SubnetServiceFeedbackType.CIDR_BLOCK_INVALID,
          message:
            'Subnet subnet-1의 CIDR 블록 형식이 올바르지 않습니다. (invalid-cidr)',
        },
        {
          serviceType: 'subnet',
          service: 'subnet-1',
          field: 'cidrBlock',
          code: SubnetServiceFeedbackType.SUBNET_CIDR_OUT_OF_VPC_CIDR,
          message:
            'Subnet subnet-1의 CIDR 블록이 VPC vpc-1의 CIDR 블록 범위를 벗어났습니다. (invalid-cidr not in 10.0.0.0/16)',
        },
      ]);
    });
    it('서브넷이 VPC CIDR 블록 범위를 벗어날 경우 피드백을 반환한다', () => {
      const subnetConfigs = [
        {
          id: '1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.1.0.0/24',
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateSubnetField'](
        subnetConfigs,
        vpcConfigs,
      );
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'subnet',
          service: 'subnet-1',
          field: 'cidrBlock',
          code: SubnetServiceFeedbackType.SUBNET_CIDR_OUT_OF_VPC_CIDR,
          message:
            'Subnet subnet-1의 CIDR 블록이 VPC vpc-1의 CIDR 블록 범위를 벗어났습니다. (10.1.0.0/24 not in 10.0.0.0/16)',
        },
      ]);
    });

    it('같은 VPC 내 서브넷 간의 CIDR 블록이 겹칠 경우 피드백을 반환한다', () => {
      const subnetConfigs = [
        {
          id: '1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.0/24',
        },
        {
          id: '2',
          name: 'subnet-2',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.128/25',
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateSubnetField'](
        subnetConfigs,
        vpcConfigs,
      );
      expect(feedbacks).toHaveLength(2);
      expect(feedbacks).toEqual([
        {
          serviceType: 'subnet',
          service: 'subnet-1',
          field: 'cidrBlock',
          code: SubnetServiceFeedbackType.SUBNET_CIDR_OVERLAP,
          message:
            'VPC vpc-1 내 Subnet subnet-1와 Subnet subnet-2의 CIDR 블록이 겹칩니다. (10.0.0.0/24, 10.0.0.128/25)',
        },
        {
          serviceType: 'subnet',
          service: 'subnet-2',
          field: 'cidrBlock',
          code: SubnetServiceFeedbackType.SUBNET_CIDR_OVERLAP,
          message:
            'VPC vpc-1 내 Subnet subnet-2와 Subnet subnet-1의 CIDR 블록이 겹칩니다. (10.0.0.128/25, 10.0.0.0/24)',
        },
      ]);
    });
    it('문제가 없는 경우 빈 배열을 반환한다', () => {
      const subnetConfigs = [
        {
          id: '1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.0/24',
        },
        {
          id: '2',
          name: 'subnet-2',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.1.0/24',
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateSubnetField'](
        subnetConfigs,
        vpcConfigs,
      );
      expect(feedbacks).toHaveLength(0);
      expect(feedbacks).toEqual([]);
    });
  });
  describe('validateEC2Field', () => {
    it('중복된 EC2 인스턴스 이름이 존재할 경우 피드백을 반환한다', () => {
      const ec2Configs = [
        {
          id: '1',
          name: 'ec2-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'subnet-1',
          subnetName: 'subnet-1',
          instanceType: 't2.micro',
          securityGroups: ['sg-1'],
        },
        {
          id: '2',
          name: 'ec2-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'subnet-1',
          subnetName: 'subnet-1',
          instanceType: 't2.micro',
          securityGroups: ['sg-1'],
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const subnetConfigs = [
        {
          id: 'subnet-1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.0/24',
        },
      ];
      const sgConfigs = [
        { id: 'sg-1', name: 'sg-1', vpcId: 'vpc-1', vpcName: 'vpc-1' },
      ];
      const submitConfig: SubmitConfig = {
        ec2: ec2Configs,
        vpc: vpcConfigs,
        subnet: subnetConfigs,
        securityGroups: sgConfigs,
      };
      const feedbacks: FeedbackDto[] =
        handler['validateEC2Field'](submitConfig);
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'ec2',
          service: 'ec2-1',
          field: 'name',
          code: EC2ServiceFeedbackType.EC2_NAME_DUPLICATED,
          message: '중복된 EC2 Name이 존재합니다.',
        },
      ]);
    });
    it('존재하지 않는 VPC를 참조하는 EC2 인스턴스가 있을 경우 피드백을 반환한다', () => {
      const ec2Configs = [
        {
          id: '1',
          name: 'ec2-1',
          vpcId: 'vpc-nonexistent',
          vpcName: 'vpc-nonexistent',
          subnetId: 'subnet-1',
          subnetName: 'subnet-1',
          instanceType: 't2.micro',
          securityGroups: ['sg-1'],
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const subnetConfigs = [
        {
          id: 'subnet-1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.0/24',
        },
      ];
      const sgConfigs = [
        { id: 'sg-1', name: 'sg-1', vpcId: 'vpc-1', vpcName: 'vpc-1' },
      ];
      const submitConfig: SubmitConfig = {
        ec2: ec2Configs,
        vpc: vpcConfigs,
        subnet: subnetConfigs,
        securityGroups: sgConfigs,
      };
      const feedbacks: FeedbackDto[] =
        handler['validateEC2Field'](submitConfig);
      expect(feedbacks).toHaveLength(2);
      expect(feedbacks).toEqual([
        {
          serviceType: 'ec2',
          service: 'ec2-1',
          field: 'vpcId',
          code: EC2ServiceFeedbackType.NO_VPC_EXIST,
          message:
            'EC2 ec2-1가 존재하지 않는 VPC vpc-nonexistent를 참조하고 있습니다.',
        },
        {
          serviceType: 'ec2',
          service: 'ec2-1',
          field: 'securityGroups',
          code: EC2ServiceFeedbackType.CANT_REF_SG_IN_OTHER_VPC,
          message:
            'EC2 ec2-1가 다른 VPC의 Security Group sg-1를 참조하고 있습니다.',
        },
      ]);
    });
    it('존재하지 않는 Subnet을 참조하는 EC2 인스턴스가 있을 경우 피드백을 반환한다', () => {
      const ec2Configs = [
        {
          id: '1',
          name: 'ec2-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          subnetId: 'subnet-nonexistent',
          subnetName: 'subnet-nonexistent',
          instanceType: 't2.micro',
          securityGroups: ['sg-1'],
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const subnetConfigs = [
        {
          id: 'subnet-1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.0/24',
        },
      ];
      const sgConfigs = [
        { id: 'sg-1', name: 'sg-1', vpcId: 'vpc-1', vpcName: 'vpc-1' },
      ];
      const submitConfig: SubmitConfig = {
        ec2: ec2Configs,
        vpc: vpcConfigs,
        subnet: subnetConfigs,
        securityGroups: sgConfigs,
      };
      const feedbacks: FeedbackDto[] =
        handler['validateEC2Field'](submitConfig);
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'ec2',
          service: 'ec2-1',
          field: 'subnetId',
          code: EC2ServiceFeedbackType.NO_SUBNET_EXIST,
          message:
            'EC2 ec2-1가 존재하지 않는 Subnet subnet-nonexistent를 참조하고 있습니다.',
        },
      ]);
    });
    it('다른 VPC의 Security Group을 참조하는 EC2 인스턴스가 있을 경우 피드백을 반환한다', () => {
      const ec2Configs = [
        {
          id: '1',
          name: 'ec2-1',
          vpcId: 'vpc-2',
          vpcName: 'vpc-2',
          subnetId: 'subnet-1',
          subnetName: 'subnet-1',
          instanceType: 't2.micro',
          securityGroups: ['sg-1'],
        },
      ];
      const vpcConfigs: VPCConfig[] = [
        { id: 'vpc-1', name: 'vpc-1', cidrBlock: '10.0.0.0/16' },
      ];
      const subnetConfigs = [
        {
          id: 'subnet-1',
          name: 'subnet-1',
          vpcId: 'vpc-1',
          vpcName: 'vpc-1',
          cidrBlock: '10.0.0.0/24',
        },
      ];
      const sgConfigs = [
        { id: 'sg-1', name: 'sg-1', vpcId: 'vpc-1', vpcName: 'vpc-1' },
      ];
      const submitConfig: SubmitConfig = {
        ec2: ec2Configs,
        vpc: vpcConfigs,
        subnet: subnetConfigs,
        securityGroups: sgConfigs,
      };
      const feedbacks: FeedbackDto[] =
        handler['validateEC2Field'](submitConfig);
      expect(feedbacks).toHaveLength(2);
      expect(feedbacks).toEqual([
        {
          serviceType: 'ec2',
          service: 'ec2-1',
          field: 'vpcId',
          code: EC2ServiceFeedbackType.NO_VPC_EXIST,
          message: 'EC2 ec2-1가 존재하지 않는 VPC vpc-2를 참조하고 있습니다.',
        },
        {
          serviceType: 'ec2',
          service: 'ec2-1',
          field: 'securityGroups',
          code: EC2ServiceFeedbackType.CANT_REF_SG_IN_OTHER_VPC,
          message:
            'EC2 ec2-1가 다른 VPC의 Security Group sg-1를 참조하고 있습니다.',
        },
      ]);
    });
  });
  describe('validateS3Field', () => {
    it('중복된 S3 버킷 이름이 존재할 경우 피드백을 반환한다', () => {
      const s3Configs = [
        { id: '1', name: 'bucket-1' },
        { id: '2', name: 'bucket-1' },
      ];
      const feedbacks: FeedbackDto[] = handler['validateS3Field'](s3Configs);
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 's3',
          service: 'bucket-1',
          field: 'name',
          code: S3ServiceFeedbackType.BUCKET_NAME_DUPLICATED,
          message: '중복된 S3 버킷 이름이 존재합니다.',
        },
      ]);
    });
    it('올바르지 않은 S3 버킷 이름이 존재할 경우 피드백을 반환한다', () => {
      const s3Configs = [
        { id: '1', name: 'Invalid_Bucket_Name' },
        { id: '2', name: 'valid-bucket-name' },
        { id: '3', name: 'another.invalid.name!' },
        {
          id: '4',
          name: 'another-invalid-naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame',
        },
        {
          id: '5',
          name: '-invalid-start-char',
        },
      ];
      const feedbacks: FeedbackDto[] = handler['validateS3Field'](s3Configs);
      expect(feedbacks).toHaveLength(4);
      expect(feedbacks).toEqual([
        {
          serviceType: 's3',
          service: 'Invalid_Bucket_Name',
          field: 'name',
          code: S3ServiceFeedbackType.BUCKET_NAME_INVALID,
          message: 'S3 버킷 이름이 올바르지 않습니다. (Invalid_Bucket_Name)',
        },
        {
          serviceType: 's3',
          service: 'another.invalid.name!',
          field: 'name',
          code: S3ServiceFeedbackType.BUCKET_NAME_INVALID,
          message: 'S3 버킷 이름이 올바르지 않습니다. (another.invalid.name!)',
        },
        {
          serviceType: 's3',
          service:
            'another-invalid-naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame',
          field: 'name',
          code: S3ServiceFeedbackType.BUCKET_NAME_INVALID,
          message:
            'S3 버킷 이름이 올바르지 않습니다. (another-invalid-naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame)',
        },
        {
          serviceType: 's3',
          service: '-invalid-start-char',
          field: 'name',
          code: S3ServiceFeedbackType.BUCKET_NAME_INVALID,
          message: 'S3 버킷 이름이 올바르지 않습니다. (-invalid-start-char)',
        },
      ]);
    });
  });
  describe('validateRouteTableField', () => {
    const rtb2name = 'rtb'.repeat(100);
    it('이름 길이 제한을 초과한 Route Table이 있을 경우 피드백을 반환한다', () => {
      const routeTableConfigs = [
        {
          id: '1',
          name: 'rtb-1',
          vpcId: 'vpc-1',
          routes: [{ destinationCidr: '0.0.0.0/0', targetGatewayId: 'igw-1' }],
          associations: ['subnet-1'],
        },
        {
          id: '2',
          name: rtb2name,
          vpcId: 'vpc-1',
          routes: [{ destinationCidr: '0.0.0.0/0', targetGatewayId: 'igw-1' }],
          associations: ['subnet-2'],
        },
      ];

      const submitConfig: SubmitConfig = {
        routeTable: routeTableConfigs,
        internetGateway: [
          {
            id: 'igw-1',
            name: 'igw-1',
            vpcId: 'vpc-1',
          },
        ],
      };
      const feedbacks: FeedbackDto[] =
        handler['validateRouteTableField'](submitConfig);
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'routeTable',
          service: rtb2name,
          field: 'name',
          code: RouteTableServiceFeedbackType.ROUTE_TABLE_NAME_INVALID,
          message: `라우트 테이블 ${rtb2name}의 이름 길이가 올바르지 않습니다.`,
        },
      ]);
    });
    it('존재하지 않는 게이트웨이를 타겟으로 하는 Route가 있을 경우 피드백을 반환한다', () => {
      const routeTableConfigs = [
        {
          id: '1',
          name: 'rtb-1',
          vpcId: 'vpc-1',
          routes: [
            { destinationCidr: '0.0.0.0/0', targetGatewayId: 'igw-1' },
            { destinationCidr: '0.0.0.0/0', targetGatewayId: 'igw-2' },
          ],
          associations: ['subnet-1'],
        },
      ];
      const submitConfig: SubmitConfig = {
        routeTable: routeTableConfigs,
        internetGateway: [
          {
            id: 'igw-1',
            name: 'igw-1',
            vpcId: 'vpc-1',
          },
        ],
      };
      const feedbacks: FeedbackDto[] =
        handler['validateRouteTableField'](submitConfig);
      expect(feedbacks).toHaveLength(1);
      expect(feedbacks).toEqual([
        {
          serviceType: 'routeTable',
          service: 'rtb-1',
          field: 'routeTable',
          code: RouteTableServiceFeedbackType.TARGET_RESOURCE_NOT_EXIST,
          message: `라우트 테이블 rtb-1의 라우트가 존재하지 않는 게이트웨이 igw-2를 참조하고 있습니다.`,
        },
      ]);
    });
  });
});
