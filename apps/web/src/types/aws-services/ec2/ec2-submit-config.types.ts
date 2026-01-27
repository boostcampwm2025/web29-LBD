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
  autoAssignPublicIp?: boolean
  allowSSH?: boolean
  allowHTTPS?: boolean
  allowHTTP?: boolean

  // Storage
  storageSize?: number
  volumeType?: string
}
