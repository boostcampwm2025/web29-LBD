'use client'

import { BasicInfoSection, InboundRulesSection } from './sections'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  DEFAULT_SG_FORM_DATA,
  type EC2SecurityGroupConfig,
  SOURCE_PRESETS,
  type SecurityGroupFormData,
  type VPCOption,
} from '@/types/aws-services/ec2/security-group'
import type { SGSubmitConfig } from '@/types/aws-services/ec2/sg-submit-config.types'
import { useProblemForm } from '@/contexts/problem-form-context'
import { getDefaultVpcs } from '@/lib/get-default-vpcs'

interface EC2SecurityGroupProps {
  config?: EC2SecurityGroupConfig
  onSubmit?: (data: SGSubmitConfig) => void
  vpcOptions?: VPCOption[]
}


export default function EC2SecurityGroup({
  config = { basicInfo: true, inboundRules: true },
  onSubmit,
}: EC2SecurityGroupProps) {
  const form = useForm<SecurityGroupFormData>({
    defaultValues: DEFAULT_SG_FORM_DATA,
  })

  const { submitConfig } = useProblemForm();
  const vpcOptions = getDefaultVpcs(submitConfig).map((vpc) => ({
    id: vpc.id,
    name: vpc.name,
  }));

  const handleSubmit = form.handleSubmit((data) => {
    // 폼 데이터를 SGSubmitConfig로 변환
    const submitConfig: SGSubmitConfig = {
      _type: 'securityGroups',
      id: data.basicInfo.name,
      name: data.basicInfo.name,
      description: data.basicInfo.description,
      vpcId: data.basicInfo.vpcId,
      vpcName:
        data.basicInfo.vpcId || 'Default VPC',
      ipPermissions: data.inboundRules.map((rule) => ({
        ipProtocol: rule.protocol,
        fromPort: rule.fromPort || '0',
        toPort: rule.toPort || '65535',
        cidrIp:
          rule.source === 'anywhere'
            ? SOURCE_PRESETS.anywhere
            : rule.source === 'anywherev6'
              ? SOURCE_PRESETS.anywherev6
              : rule.customCidr,
        isInbound: true,
      })),
    }

    onSubmit?.(submitConfig)
    form.reset(DEFAULT_SG_FORM_DATA)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {config.basicInfo && (
        <BasicInfoSection form={form} vpcOptions={vpcOptions} />
      )}

      {config.inboundRules && <InboundRulesSection form={form} />}

      <div className="flex justify-end">
        <Button type="submit">보안 그룹 생성</Button>
      </div>
    </form>
  )
}
