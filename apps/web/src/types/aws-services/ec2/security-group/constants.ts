export const EC2_SECURITY_GROUP_SECTIONS = [
  'basicInfo',
  'inboundRules',
] as const

export type EC2SecurityGroupSectionKey =
  (typeof EC2_SECURITY_GROUP_SECTIONS)[number]

export type EC2SecurityGroupConfig = Record<EC2SecurityGroupSectionKey, boolean>

// 자주 사용되는 규칙 타입 프리셋
export const RULE_TYPE_PRESETS = {
  HTTP: { protocol: 'tcp', fromPort: '80', toPort: '80' },
  HTTPS: { protocol: 'tcp', fromPort: '443', toPort: '443' },
  SSH: { protocol: 'tcp', fromPort: '22', toPort: '22' },
  RDP: { protocol: 'tcp', fromPort: '3389', toPort: '3389' },
  MYSQL: { protocol: 'tcp', fromPort: '3306', toPort: '3306' },
  PostgreSQL: { protocol: 'tcp', fromPort: '5432', toPort: '5432' },
  'Custom TCP': { protocol: 'tcp', fromPort: '', toPort: '' },
  'Custom UDP': { protocol: 'udp', fromPort: '', toPort: '' },
  'All traffic': { protocol: '-1', fromPort: '0', toPort: '65535' },
} as const

export type RuleTypePreset = keyof typeof RULE_TYPE_PRESETS

export const SOURCE_PRESETS = {
  anywhere: '0.0.0.0/0',
  anywherev6: '::/0',
} as const
