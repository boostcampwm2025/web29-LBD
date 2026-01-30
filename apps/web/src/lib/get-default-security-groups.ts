import type { GlobalSubmitConfig } from '@/types/submitConfig.types'

export function getDefaultSecurityGroups(defaultConfigs: GlobalSubmitConfig) {
    const sgs: { id: string; name: string; vpcId: string }[] = []
    if (defaultConfigs.securityGroups) {
        for (const sgItem of defaultConfigs.securityGroups) {
            sgs.push({
                id: sgItem.data.id,
                name: sgItem.data.name,
                vpcId: sgItem.data.vpcId,
            })
        }
    }
    return sgs
}
