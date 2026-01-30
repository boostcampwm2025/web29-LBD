export type EC2SubmitConfig = {
  _type: 'ec2'
  id: string
  name: string

  // AMI
  osType?:
  | 'amazon-linux'
  | 'mac-os'
  | 'ubuntu'
  | 'windows'
  | 'red-hat'
  | 'suse-linux'
  | 'debian'

  // Instance type
  instanceType?: string

  // Key pair
  keyName?: string

  // Network settings
  vpcName?: string
  vpcId?: string
  subnetId?: string
  subnetName?: string
  autoAssignPublicIp?: boolean
  allowSSH?: boolean
  allowHTTPS?: boolean
  allowHTTP?: boolean
  securityGroups?: string[]

  // Storage
  storageSize?: number
  volumeType?: string

  // User Data
  userData?: string
}

export type EC2ServerPayload = Omit<EC2SubmitConfig, '_type'>
