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
