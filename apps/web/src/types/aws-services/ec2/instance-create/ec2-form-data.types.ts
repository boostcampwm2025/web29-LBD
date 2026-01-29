export interface EC2InstanceFormData {
  nameTag: {
    name: string
  }
  ami: {
    osType:
      | 'amazon-linux'
      | 'mac-os'
      | 'ubuntu'
      | 'windows'
      | 'red-hat'
      | 'suse-linux'
      | 'debian'
  }
  instanceType: {
    type: string
  }
  keyPair: {
    keyName: string
  }
  networkSetting: {
    vpcName?: string
    subnetName?: string
    autoAssignPublicIp: boolean
    allowSSH: boolean
    allowHTTPS: boolean
    allowHTTP: boolean
  }
  storage: {
    size: number
    volumeType: string
  }
  userData?: {
    script: string
  }
}
