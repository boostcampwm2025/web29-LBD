import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// TODO: 각 서비스별 Config 타입 구체화하기

export class EC2Config {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  vpcName: string;

  @IsString()
  subnetName: string;

  @IsEnum([
    'amazon-linux',
    'mac-os',
    'ubuntu',
    'windows',
    'red-hat',
    'suse-linux',
    'debian',
  ])
  @IsOptional()
  osType?: string;

  @IsString()
  @IsOptional()
  instanceType?: string;

  @IsString()
  @IsOptional()
  keyName?: string;

  @IsBoolean()
  @IsOptional()
  autoAssignPublicIp?: boolean;

  @IsBoolean()
  @IsOptional()
  allowSSH?: boolean;

  @IsBoolean()
  @IsOptional()
  allowHTTPS?: boolean;

  @IsBoolean()
  @IsOptional()
  allowHTTP?: boolean;

  @IsNumber()
  @IsOptional()
  storageSize?: number;

  @IsString()
  @IsOptional()
  volumeType?: string;

  @IsString()
  @IsOptional()
  userData?: string;
}

export class VPCConfig {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  cidrBlock: string;

  @IsEnum(['default', 'dedicated'])
  tenancy: 'default' | 'dedicated';
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

  @IsString()
  @IsOptional()
  availabilityZone?: string;
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
  objectLockEnabled?: boolean;

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

export class ErrorResponse {
  @IsString()
  errorCode: string;

  @IsString()
  responsePagePath: string;

  @IsString()
  responseCode: string;

  @IsString()
  ttl: string;
}

export class CloudFrontConfig {
  @IsString()
  id: string;

  @IsString()
  name: string;

  // Origin Settings
  @IsEnum(['s3', 'custom'])
  @IsOptional()
  originType?: 's3' | 'custom';

  @IsString()
  @IsOptional()
  selectedBucket?: string;

  @IsString()
  @IsOptional()
  customDomain?: string;

  @IsString()
  @IsOptional()
  originPath?: string;

  @IsEnum(['oac', 'oai', 'public'])
  @IsOptional()
  accessControl?: 'oac' | 'oai' | 'public';

  @IsString()
  @IsOptional()
  oacName?: string;

  // +) custom-headers 나중에 //

  // Distribution Settings
  @IsString()
  @IsOptional()
  distributionName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsEnum(['all', 'performance', 'cost-optimized'])
  @IsOptional()
  priceClass?: 'all' | 'performance' | 'cost-optimized';

  @IsArray()
  @IsOptional()
  cnames?: string[];

  @IsEnum(['cloudfront', 'acm'])
  @IsOptional()
  sslCertificate?: 'cloudfront' | 'acm';

  @IsString()
  @IsOptional()
  acmCertificateArn?: string;

  @IsString()
  @IsOptional()
  minTlsVersion?: string;

  @IsBoolean()
  @IsOptional()
  ipv6Enabled?: boolean;

  // Cache Behavior
  @IsEnum(['allow-all', 'redirect-to-https', 'https-only'])
  @IsOptional()
  viewerProtocolPolicy?: 'allow-all' | 'redirect-to-https' | 'https-only';

  @IsEnum(['GET_HEAD', 'GET_HEAD_OPTIONS', 'ALL'])
  @IsOptional()
  allowedMethods?: 'GET_HEAD' | 'GET_HEAD_OPTIONS' | 'ALL';

  @IsEnum(['managed', 'custom'])
  @IsOptional()
  cachePolicy?: 'managed' | 'custom';

  @IsString()
  @IsOptional()
  managedPolicyName?: string;

  @IsOptional()
  customTTL?: { min: string; default: string; max: string };

  @IsBoolean()
  @IsOptional()
  compressionEnabled?: boolean;

  @IsString()
  @IsOptional()
  viewerRequestFunction?: string;

  @IsString()
  @IsOptional()
  viewerResponseFunction?: string;

  // Website Settings
  @IsString()
  @IsOptional()
  defaultRootObject?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorResponse)
  @IsOptional()
  errorResponses?: ErrorResponse[];

  @IsBoolean()
  @IsOptional()
  loggingEnabled?: boolean;

  @IsString()
  @IsOptional()
  loggingBucket?: string;

  @IsString()
  @IsOptional()
  logPrefix?: string;

  @IsBoolean()
  @IsOptional()
  wafEnabled?: boolean;

  @IsString()
  @IsOptional()
  webAclId?: string;
}

export type ServiceConfigTypes =
  | EC2Config
  | VPCConfig
  | SubnetConfig
  | RouteTableConfig
  | SecurityGroupsConfig
  | S3Config
  | InternetGatewayConfig
  | CloudFrontConfig;
