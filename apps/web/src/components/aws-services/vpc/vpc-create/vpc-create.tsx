'use client'

import { CidrBlock, GeneralConfig, Tenancy } from './sections'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import type { VpcCreateConfig } from '@/types/aws-services/vpc/constants'
import type { VpcFormData } from '@/types/aws-services/vpc/vpc-form-data.types'
import type { VpcSubmitConfig } from '@/types/aws-services/vpc/vpc-submit-config.types'

const DEFAULT_VALUES: VpcFormData = {
  nameTag: { name: '' },
  cidr: {
    cidrBlock: '10.0.0.0/16',
  },
  tenancy: { type: 'default' },
}

interface VpcCreateProps {
  config: VpcCreateConfig
  onSubmit: (data: VpcSubmitConfig) => void
}

export default function VpcCreate({ config, onSubmit }: VpcCreateProps) {
  const { control, handleSubmit, reset } = useForm<VpcFormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const handleFormSubmit = handleSubmit((data) => {
    const submitData: VpcSubmitConfig = {
      _type: 'vpc',
      id: data.nameTag?.name || crypto.randomUUID(),
      name: data.nameTag?.name || 'Unnamed VPC',
      cidrBlock: data.cidr?.cidrBlock || '10.0.0.0/16',
      tenancy: data.tenancy?.type || 'default',
    }
    onSubmit(submitData)
    reset(DEFAULT_VALUES)
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-5xl space-y-6 p-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">VPC 생성</h1>
        <p className="text-muted-foreground text-sm">
          VPC는 AWS 클라우드의 격리된 부분으로서, Amazon EC2 인스턴스와 같은 AWS
          객체로 채워집니다.
        </p>
      </div>

      {/* 흰색 배경 카드 */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">VPC 설정</h2>
        </div>

        <div className="space-y-8 p-6">
          <GeneralConfig control={control} config={config} />
          <CidrBlock control={control} config={config} />
          <Tenancy control={control} config={config} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="bg-orange-600 font-bold text-white hover:bg-orange-700"
        >
          VPC 생성
        </Button>
      </div>
    </form>
  )
}
