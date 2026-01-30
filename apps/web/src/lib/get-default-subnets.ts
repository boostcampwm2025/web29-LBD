import type { GlobalSubmitConfig } from '@/types/submitConfig.types'

export function getDefaultSubnets(defaultConfigs: GlobalSubmitConfig) {
  const subnets: {
    id: string
    name: string
    cidrBlock: string
    vpcId: string
    vpcName: string
  }[] = []
  if (defaultConfigs.subnet) {
    for (const subnetItem of defaultConfigs.subnet) {
      subnets.push({
        id: subnetItem.data.id,
        name: subnetItem.data.name,
        cidrBlock: subnetItem.data.cidrBlock,
        vpcId: subnetItem.data.vpcId,
        vpcName: subnetItem.data.vpcName,
      })
    }
  }
  return subnets
}
