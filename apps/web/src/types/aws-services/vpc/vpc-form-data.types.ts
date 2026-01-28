export interface VpcFormData {
  nameTag?: {
    name: string
  }
  cidr?: {
    cidrBlock: string
  }
  tenancy?: {
    type: 'default' | 'dedicated'
  }
}
