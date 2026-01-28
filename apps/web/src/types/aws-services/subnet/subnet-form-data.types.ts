export interface SubnetFormData {
  vpcId: string
  subnetSettings: {
    nameTag: string
    availabilityZone?: string
    cidrBlock: string
  }
}
