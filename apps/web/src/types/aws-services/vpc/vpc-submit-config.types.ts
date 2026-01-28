export type VpcSubmitConfig = {
  _type: 'vpc'
  id: string
  name: string

  cidrBlock: string

  // Tenancy
  tenancy?: 'default' | 'dedicated'
}
