export const UnitProblemFeedbackType = {
  SERVICE_MISSING: 'SERVICE_MISSING',
  FIELD_MISSING: 'FIELD_MISSING',
  UNNECESSARY: 'UNNECESSARY',
  INCORRECT: 'INCORRECT',
  INVALID: 'INVALID',
} as const;

export const feedbackMessages = {
  [UnitProblemFeedbackType.SERVICE_MISSING]: (
    service: string,
    details: string,
  ) => `제출한 ${service} 설정에 누락된 서비스가 있습니다: ${details}`,
  [UnitProblemFeedbackType.FIELD_MISSING]: (service: string, details: string) =>
    `제출한 ${service} 설정에 누락된 필드가 있습니다: ${details}`,
  [UnitProblemFeedbackType.UNNECESSARY]: (service: string, details: string) =>
    `제출한 ${service} 설정에 불필요한 필드가 있습니다: ${details}`,
  [UnitProblemFeedbackType.INCORRECT]: (service: string, details: string) =>
    `제출한 ${service} 설정에 올바르지 않은 값이 있습니다: ${details}`,
  [UnitProblemFeedbackType.INVALID]: (service: string, details: string) =>
    `제출한 ${service} 설정에 유효하지 않은 값이 있습니다: ${details}`,
};

export const NetworkFeedbackScenarios = {
  IGW_NOT_ATTACHED: 'IGW_NOT_ATTACHED',
  ROUTES_TO_IGW_MISSING: 'ROUTES_TO_IGW_MISSING',
  SUBNET_RT_ASSOCIATION_MISSING: 'SUBNET_RT_ASSOCIATION_MISSING',
  PRIVATE_SUBNET_HAS_IGW_ROUTE: 'PRIVATE_SUBNET_HAS_IGW_ROUTE',
  NAT_GW_MISSING_IN_ROUTE: 'NAT_GW_MISSING_IN_ROUTE',
  NAT_GW_IN_WRONG_SUBNET: 'NAT_GW_IN_WRONG_SUBNET',
  NACL_DENY_TRAFFIC: 'NACL_DENY_TRAFFIC',
};

export const EC2FeedbackScenarios = {
  EC2_IN_WRONG_SUBNET: 'EC2_IN_WRONG_SUBNET',
  EC2_PUBLIC_IP_MISSING: 'EC2_PUBLIC_IP_MISSING',
  EC2_WRONG_AMI: 'EC2_WRONG_AMI',
  EC2_WRONG_INSTANCE_TYPE: 'EC2_WRONG_INSTANCE_TYPE',
};

export const SGFeedbackScenarios = {
  SG_INBOUND_PORT_CLOSED: 'SG_INBOUND_PORT_CLOSED',
  SG_SSH_OPEN_TO_WORLD: 'SG_SSH_OPEN_TO_WORLD',
  SG_WRONG_SOURCE: 'SG_WRONG_SOURCE',
  EC2_WRONG_SG_ATTACHED: 'EC2_WRONG_SG_ATTACHED',
};

export const S3FeedbackScenarios = {
  BUCKET_NOT_ENCRYPTED: 'BUCKET_NOT_ENCRYPTED',
  BUCKET_PUBLIC_ACCESS_BLOCK_MISSING: 'BUCKET_PUBLIC_ACCESS_BLOCK_MISSING',
  BUCKET_VERSIONING_DISABLED: 'BUCKET_VERSIONING_DISABLED',
};
