export const CommonFeedbackType = {
  TAGS_INVALID: 'TAGS_INVALID', // 태그 형식이 올바르지 않음
  NAME_LENGTH_EXCEEDED: 'NAME_LENGTH_EXCEEDED', // 이름 길이 초과
  USING_RESERVED_WORDS: 'USING_RESERVED_WORDS', // 예약어 사용
} as const;

export const VPCServiceFeedbackType = {
  CIDR_BLOCK_INVALID: 'CIDR_BLOCK_INVALID', // CIDR 블록 형식이 올바르지 않음
  VPC_NAME_DUPLICATED: 'VPC_NAME_DUPLICATED', // VPC Name이 중복됨
  VPC_CIDR_BLOCK_SIZE_INVALID: 'VPC_CIDR_BLOCK_SIZE_INVALID', // VPC의 CIDR 블록 크기가 올바르지 않음(16~28 사이여야 함)
  VPC_CIDR_OVERLAP: 'VPC_CIDR_OVERLAP', // VPC 간의 CIDR 블록이 겹침
} as const;

export const SubnetServiceFeedbackType = {
  CIDR_BLOCK_INVALID: 'CIDR_BLOCK_INVALID', // CIDR 블록 형식이 올바르지 않음
  NO_VPC_EXIST: 'NO_VPC_EXIST', // 해당 VPC가 존재하지 않음
  SUBNET_NAME_DUPLICATED: 'SUBNET_NAME_DUPLICATED', // 서브넷 이름이 중복됨
  SUBNET_CIDR_OUT_OF_VPC_CIDR: 'SUBNET_CIDR_OUT_OF_VPC_CIDR', // 서브넷의 CIDR 블록이 VPC의 CIDR 블록 범위를 벗어남
  SUBNET_CIDR_OVERLAP: 'SUBNET_CIDR_OVERLAP', // 같은 VPC 내 서브넷 간의 CIDR 블록이 겹침
} as const;

export const EC2ServiceFeedbackType = {
  EC2_NAME_DUPLICATED: 'EC2_NAME_DUPLICATED', // EC2 인스턴스 이름이 중복됨
  NO_VPC_EXIST: 'NO_VPC_EXIST', // 해당 VPC가 존재하지 않음
  NO_SUBNET_EXIST: 'NO_SUBNET_EXIST', // 해당 서브넷이 존재하지 않음
  CANT_REF_SG_IN_OTHER_VPC: 'CANT_REF_SG_IN_OTHER_VPC', // 다른 VPC의 SG를 참조할 수 없음
} as const;

export const S3ServiceFeedbackType = {
  BUCKET_NAME_DUPLICATED: 'BUCKET_NAME_DUPLICATED', // 버킷 이름이 중복됨
  BUCKET_NAME_INVALID: 'BUCKET_NAME_INVALID', // 버킷 이름이 올바르지 않음
} as const;

export const RouteTableServiceFeedbackType = {
  ROUTE_TABLE_NAME_DUPLICATED: 'ROUTE_TABLE_NAME_DUPLICATED', // 라우트 테이블 이름이 중복됨
  ROUTE_TABLE_NAME_INVALID: 'ROUTE_TABLE_NAME_INVALID', // 라우트 테이블 이름이 올바르지 않음
  ROUTE_CIDR_INVALID: 'ROUTE_CIDR_INVALID', // 라우트의 CIDR 블록이 올바르지 않음
  TARGET_RESOURCE_NOT_EXIST: 'TARGET_RESOURCE_NOT_EXIST', // 라우트의 대상 리소스가 존재하지 않음
} as const;
