export interface NATGatewayFormData {
    nameTag: string
    subnetId: string
}

export type NATGatewaySubmitConfig = {
    _type: 'natGateway'

    id?: string
    name: string

    vpcId?: string
    vpcName?: string

    subnetId: string
    subnetName: string
}
