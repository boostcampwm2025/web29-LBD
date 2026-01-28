import type { GlobalSubmitConfig } from '@/types/submitConfig.types'

export function getDefaultSubnets(defaultConfigs: GlobalSubmitConfig) {
  const subnets: { id: string; name: string; cidrBlock: string }[] = []
  if (defaultConfigs.subnet) {
    for (const subnetItem of defaultConfigs.subnet) {
      subnets.push({
        id: subnetItem.data.id,
        name: subnetItem.data.name,
        cidrBlock: subnetItem.data.cidrBlock,
      })
    }
  }
  return subnets
}
