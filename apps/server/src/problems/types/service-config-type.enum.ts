import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

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
  @IsBoolean()
  @IsOptional()
  serverSideEncryption?: boolean; // 암호화 설정 여부
  @IsBoolean()
  @IsOptional()
  publicAccessBlockEnabled?: boolean; // 퍼블릭 액세스 차단 설정 여부
  @IsBoolean()
  @IsOptional()
  versioningEnabled?: boolean; // 버전 관리 활성화 여부
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
