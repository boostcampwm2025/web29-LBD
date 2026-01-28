import type { GlobalSubmitConfig } from '@/types/submitConfig.types'

export function getDefaultVpcs(defaultConfigs: GlobalSubmitConfig) {
  const vpcs: { id: string; name: string; cidrBlock: string }[] = []
  if (defaultConfigs.vpc) {
    for (const vpcItem of defaultConfigs.vpc) {
      vpcs.push({
        id: vpcItem.data.id,
        name: vpcItem.data.name,
        cidrBlock: vpcItem.data.cidrBlock,
      })
    }
  }
  return vpcs
}
