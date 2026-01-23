export interface NetworkRequirements {
  vpc?: {
    [vpcName: string]: {
      requireIgwAttached?: boolean;
      requireDnsHostnames?: boolean;
    };
  };
  subnet?: {
    [subnetName: string]: {
      requireRouteTable?: string;
      isPrivate?: boolean;
      requirePublic?: boolean;
    };
  };
  routeTable?: {
    [rtName: string]: {
      requireIgwRoute?: boolean;
      requireNatRoute?: boolean;
    };
  };
  natGateway?: {
    [natName: string]: {
      requirePublicSubnet?: boolean;
    };
  };
  nacl?: {
    [naclName: string]: {
      allowAllTraffic?: boolean;
    };
  };
}

export interface Ec2Requirements {
  ec2?: {
    [ec2Name: string]: {
      expectedSubnet?: string;
      requirePublicIp?: boolean;
      expectedAmi?: string;
      expectedInstanceType?: string;
    };
  };
}

export interface SgRequirements {
  securityGroup?: {
    [sgName: string]: {
      requireOpenPorts?: number[];

      checkSshOpenToWorld?: boolean;

      requireSource?: { port: number; source: string }[];
    };
  };

  ec2Attachment?: {
    [ec2Name: string]: {
      requireSecurityGroups?: string[];
    };
  };
}

export interface S3Requirements {
  s3?: {
    [bucketName: string]: {
      requireEncryption?: boolean;
      requirePublicAccessBlock?: boolean;
      requireVersioning?: boolean;
    };
  };
}
