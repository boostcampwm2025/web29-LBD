import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

// TODO: 각 서비스별 Config 타입 구체화하기

export class EC2Config {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  vpcId: string;

  @IsString()
  vpcName: string;

  @IsString()
  subnetId: string;
  @IsString()
  subnetName: string;

  @IsString()
  instanceType: string;

  @IsString({ each: true })
  securityGroups: string[]; // Security Group names

  @IsString()
  privateIpAddress: string;
  @IsString()
  publicIpAddress?: string;

  @IsString()
  ami: string;
}

export class VPCConfig {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  cidrBlock: string;
}

export class SubnetConfig {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  vpcId: string;

  @IsString()
  vpcName: string;

  @IsString()
  cidrBlock: string;
}

export class SGRules {
  @IsString()
  ipProtocol: string;
  @IsString()
  fromPort: string;
  @IsString()
  toPort: string;
  @IsString()
  cidrIp: string;
  @IsBoolean()
  isInbound: boolean;
}

export class SecurityGroupsConfig {
  @IsString()
  id: string;
  @IsString()
  vpcId: string;
  @IsString()
  vpcName: string;
  @IsString()
  name: string;
  @IsArray()
  ipPermissions: SGRules[];
}

export class S3Config {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  region: string;

  @IsEnum(['disabled', 'enabled'])
  @IsOptional()
  aclEnabled?: 'disabled' | 'enabled';

  @IsEnum(['bucket-owner-preferred', 'object-writer'])
  @IsOptional()
  ownershipModel?: 'bucket-owner-preferred' | 'object-writer';
  @IsBoolean()
  @IsOptional()
  blockAll?: boolean;
  @IsBoolean()
  @IsOptional()
  ignorePublicAcls?: boolean;
  @IsBoolean()
  @IsOptional()
  blockPublicPolicy?: boolean;
  @IsBoolean()
  @IsOptional()
  blockPublicAcls?: boolean;
  @IsBoolean()
  @IsOptional()
  restrictPublicBuckets?: boolean;
  @IsEnum(['sse-s3', 'sse-kms'])
  @IsOptional()
  encryptionType?: 'sse-s3' | 'sse-kms';
  @IsBoolean()
  @IsOptional()
  versioningEnabled?: boolean;
  @IsOptional()
  @IsArray()
  tags?: Array<{
    key: string;
    value: string;
  }>;
}

export class InternetGatewayConfig {
  @IsString()
  id: string;
  @IsString()
  vpcId: string;
  @IsString()
  vpcName: string;
  @IsString()
  name: string;
}

export type GatewayTypes = InternetGatewayConfig;

export class RouteTableEntry {
  @IsString()
  destinationCidr: string;
  @IsString()
  targetGatewayId: string;
}

export class RouteTableAssociation {
  @IsString()
  subnetId: string;
}

export class RouteTableConfig {
  @IsString()
  id: string;
  @IsString()
  vpcId: string;
  @IsString()
  vpcName: string;
  @IsString()
  name: string;
  @IsArray()
  routes: RouteTableEntry[];
  @IsArray()
  associations: RouteTableAssociation[]; // Subnet IDs
}

export class NATGatewayConfig {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  vpcId: string;
  @IsString()
  subnetId: string;
  @IsString()
  vpcName: string;
  @IsString()
  subnetName: string;
}

export class NACLRule {
  @IsString()
  ruleNumber: string;
  @IsString()
  protocol: string;
  @IsString()
  ruleAction: string;
  @IsBoolean()
  egress: boolean;
  @IsString()
  cidrBlock: string;
  @IsString()
  portRange: string;
}

export class NACLConfig {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  vpcId: string;
  @IsString()
  vpcName: string;
  @IsArray()
  entries: NACLRule[];
}

export type ServiceConfigTypes =
  | EC2Config
  | VPCConfig
  | SubnetConfig
  | RouteTableConfig
  | SecurityGroupsConfig
  | S3Config
  | InternetGatewayConfig;
