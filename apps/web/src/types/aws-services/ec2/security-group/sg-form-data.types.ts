import type { RuleTypePreset } from './constants'

export interface SGRuleFormData {
  id: string
  type: RuleTypePreset
  protocol: 'tcp' | 'udp' | '-1'
  fromPort: string
  toPort: string
  source: 'anywhere' | 'anywherev6' | 'custom'
  customCidr: string
  description: string
}

export interface SGBasicInfoFormData {
  name: string
  description: string
  vpcId: string
}

export interface SecurityGroupFormData {
  basicInfo: SGBasicInfoFormData
  inboundRules: SGRuleFormData[]
}

// 기본값
export const DEFAULT_SG_RULE: Omit<SGRuleFormData, 'id'> = {
  type: 'Custom TCP',
  protocol: 'tcp',
  fromPort: '',
  toPort: '',
  source: 'anywhere',
  customCidr: '',
  description: '',
}

export const DEFAULT_SG_FORM_DATA: SecurityGroupFormData = {
  basicInfo: {
    name: '',
    description: '',
    vpcId: '',
  },
  inboundRules: [],
}
