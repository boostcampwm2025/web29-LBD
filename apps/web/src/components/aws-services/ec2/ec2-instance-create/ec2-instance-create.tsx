'use client'

import { ServiceTitle } from '../../common/service-title'
import {
  Ami,
  InstanceType,
  KeyPair,
  NameTag,
  NetworkSetting,
  Storage,
  UserData,
} from './sections'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import type { EC2SubmitConfig } from '@/types/aws-services/ec2/ec2-submit-config.types'
import type {
  EC2InstanceCreateConfig,
  EC2InstanceFormData,
} from '@/types/aws-services/ec2/instance-create'

const DEFAULT_VALUES: EC2InstanceFormData = {
  nameTag: { name: '' },
  ami: { osType: 'amazon-linux' },
  instanceType: { type: 't2.micro' },
  keyPair: { keyName: '' },
  networkSetting: {
    autoAssignPublicIp: true,
    allowSSH: true,
    allowHTTPS: false,
    allowHTTP: false,
  },
  storage: { size: 8, volumeType: 'gp3' },
  userData: { script: '' },
}

interface EC2InstanceCreateProps {
  config: EC2InstanceCreateConfig
  onSubmit: (data: EC2SubmitConfig) => void
  buttonText?: string
}

export default function EC2InstanceCreate({
  config,
  onSubmit,
  buttonText = 'EC2 인스턴스 추가',
}: EC2InstanceCreateProps) {
  const { control, handleSubmit, watch, reset } = useForm<EC2InstanceFormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const instanceName = watch('nameTag.name') || ''

  const isDisabled = instanceName.length === 0

  const handleFormSubmit = handleSubmit((data) => {
    const uniqueId = crypto.randomUUID()
    const submitData: EC2SubmitConfig = {
      _type: 'ec2',
      id: data.nameTag.name || `ec2-${uniqueId}`,
      name: data.nameTag.name || `ec2-${uniqueId}`,
      vpcName: data.networkSetting?.vpcName,
      subnetName: data.networkSetting?.subnetName,
      osType: data.ami?.osType,
      instanceType: data.instanceType?.type,
      keyName: data.keyPair?.keyName,
      autoAssignPublicIp: data.networkSetting?.autoAssignPublicIp,
      allowSSH: data.networkSetting?.allowSSH,
      allowHTTPS: data.networkSetting?.allowHTTPS,
      allowHTTP: data.networkSetting?.allowHTTP,
      storageSize: data.storage?.size,
      volumeType: data.storage?.volumeType,
      userData: data.userData?.script,
    }
    onSubmit(submitData)
    reset(DEFAULT_VALUES)
  })

  return (
    <form onSubmit={handleFormSubmit} className="w-full space-y-4 p-8">
      <ServiceTitle
        title="인스턴스 시작"
        description="Amazon EC2 인스턴스를 생성하고 구성하세요"
        button={{
          isDisabled,
          buttonText,
        }}
      />

      {config.nameTag && <NameTag control={control} config={config} />}

      {config.ami && <Ami control={control} config={config} />}

      {config.instanceType && (
        <InstanceType control={control} config={config} />
      )}

      {config.keyPair && <KeyPair control={control} config={config} />}

      {config.networkSetting && (
        <NetworkSetting control={control} config={config} />
      )}

      {config.storage && <Storage control={control} config={config} />}

      {config.userData && <UserData control={control} config={config} />}
    </form>
  )
}
