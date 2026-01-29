'use client'

import { SubnetSettings } from './sections/subnet-settings-section'
import { VpcSelect } from './sections/vpc-select-section'

import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'
import { getDefaultVpcs } from '@/lib/get-default-vpcs'
import type { SubnetFormData } from '@/types/aws-services/subnet/subnet-form-data.types'
import type { SubnetSubmitConfig } from '@/types/aws-services/subnet/subnet-submit-config.types'

const DEFAULT_VALUES: SubnetFormData = {
  vpcId: '',
  subnetSettings: {
    nameTag: '',
    availabilityZone: 'no-preference',
    cidrBlock: '',
  },
}

interface SubnetCreateProps {
  onSubmit: (data: SubnetSubmitConfig) => void
}

export default function SubnetCreate({ onSubmit }: SubnetCreateProps) {
  const { control, handleSubmit, reset } = useForm<SubnetFormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })
  const { submitConfig } = useProblemForm()
  const defaultVpcs = getDefaultVpcs(submitConfig)
  const vpcs =
    defaultVpcs.length > 0
      ? defaultVpcs
      : [{ id: 'vpc-12345678', name: 'Default VPC', cidrBlock: '10.0.0.0/16' }]

  // 1. VPC 선택 여부 감시
  const selectedVpcId = useWatch({ control, name: 'vpcId' })

  // 2. 선택된 VPC의 정보 가져오기 (CIDR 힌트용)
  const selectedVpc = vpcs.find((v) => v.id === selectedVpcId)

  const handleFormSubmit = handleSubmit((data) => {
    const submitData: SubnetSubmitConfig = {
      _type: 'subnet',
      vpcId: data.vpcId,
      vpcName: data.vpcId,
      id: data.subnetSettings.nameTag,
      name: data.subnetSettings.nameTag,
      availabilityZone: data.subnetSettings.availabilityZone,
      cidrBlock: data.subnetSettings.cidrBlock,
    }
    onSubmit(submitData)
    reset(DEFAULT_VALUES)
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-5xl space-y-6 p-6"
    >
      <div className="mb-4 space-y-2">
        <h1 className="text-2xl font-bold">서브넷 생성</h1>
        <p className="text-muted-foreground text-sm">
          VPC 네트워크 범위를 세분화하여 리소스를 격리합니다.
        </p>
      </div>

      {/* 섹션 1: VPC 선택 */}
      <VpcSelect control={control} vpcs={vpcs} />

      {/* 섹션 2: 서브넷 설정 (VPC가 선택되었을 때만 노출) */}
      {selectedVpcId && (
        <SubnetSettings control={control} vpcCidr={selectedVpc?.cidrBlock} />
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          size="lg"
          className="bg-orange-600 font-bold text-white hover:bg-orange-700"
          disabled={!selectedVpcId} // VPC 미선택 시 버튼 비활성화
        >
          서브넷 생성
        </Button>
      </div>
    </form>
  )
}
