export interface SGRuleConfig {
  ipProtocol: string
  fromPort: string
  toPort: string
  cidrIp: string
  isInbound: boolean
}

export type SGSubmitConfig = {
  _type: 'securityGroups'
  id: string
  name: string
  description?: string
  vpcId: string
  vpcName: string
  ipPermissions: SGRuleConfig[]
}

export type SGServerPayload = Omit<SGSubmitConfig, '_type'>
