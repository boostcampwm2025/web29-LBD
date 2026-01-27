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
  // Instance type
  EC2_WRONG_INSTANCE_TYPE: 'EC2_WRONG_INSTANCE_TYPE',

  // OS/AMI
  EC2_WRONG_OS_TYPE: 'EC2_WRONG_OS_TYPE',

  // Key pair
  EC2_KEY_PAIR_MISSING: 'EC2_KEY_PAIR_MISSING',
  EC2_WRONG_KEY_NAME: 'EC2_WRONG_KEY_NAME',

  // Network settings
  EC2_PUBLIC_IP_NOT_ENABLED: 'EC2_PUBLIC_IP_NOT_ENABLED',
  EC2_PUBLIC_IP_SHOULD_BE_DISABLED: 'EC2_PUBLIC_IP_SHOULD_BE_DISABLED',
  EC2_SSH_NOT_ALLOWED: 'EC2_SSH_NOT_ALLOWED',
  EC2_SSH_SHOULD_BE_BLOCKED: 'EC2_SSH_SHOULD_BE_BLOCKED',
  EC2_HTTP_NOT_ALLOWED: 'EC2_HTTP_NOT_ALLOWED',
  EC2_HTTP_SHOULD_BE_BLOCKED: 'EC2_HTTP_SHOULD_BE_BLOCKED',
  EC2_HTTPS_NOT_ALLOWED: 'EC2_HTTPS_NOT_ALLOWED',
  EC2_HTTPS_SHOULD_BE_BLOCKED: 'EC2_HTTPS_SHOULD_BE_BLOCKED',

  // Storage
  EC2_STORAGE_TOO_SMALL: 'EC2_STORAGE_TOO_SMALL',
  EC2_STORAGE_TOO_LARGE: 'EC2_STORAGE_TOO_LARGE',
  EC2_WRONG_VOLUME_TYPE: 'EC2_WRONG_VOLUME_TYPE',
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
