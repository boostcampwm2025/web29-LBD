export type SubnetSubmitConfig = {
  _type: 'subnet'
  vpcId: string
  vpcName: string
  id: string
  name: string
  availabilityZone?: string
  cidrBlock: string
}
