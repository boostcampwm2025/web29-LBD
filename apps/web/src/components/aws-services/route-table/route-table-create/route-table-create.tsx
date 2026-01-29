'use client'

import { GeneralSettings } from './sections'

import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'
import { getDefaultVpcs } from '@/lib/get-default-vpcs'
import type {
  RouteTableCreateFormData,
  RouteTableSubmitConfig,
} from '@/types/aws-services/route-table/route-table.types'

const DEFAULT_VALUES: RouteTableCreateFormData = {
  settings: {
    nameTag: '',
    vpcId: '',
  },
  tags: [],
}

interface RouteTableCreateProps {
  onSubmit: (data: RouteTableSubmitConfig) => void
}

export default function RouteTableCreate({ onSubmit }: RouteTableCreateProps) {
  // 1. 생성 전용 폼 데이터 타입 사용
  const { control, handleSubmit, reset } = useForm<RouteTableCreateFormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const { submitConfig } = useProblemForm()
  const defaultVpcs = getDefaultVpcs(submitConfig)
  const vpcs =
    defaultVpcs.length > 0
      ? defaultVpcs
      : [
          {
            id: 'vpc-12345678',
            name: 'Default VPC',
            cidrBlock: '10.0.0.0/16',
          },
        ]

  // 생성 버튼 활성화/비활성화를 위해 감시
  const vpcId = useWatch({ control, name: 'settings.vpcId' })

  const handleFormSubmit = handleSubmit((data) => {
    // 2. 통합 Submit Config 타입으로 변환
    const vpc = vpcs.find((v) => v.id === data.settings.vpcId)
    const submitData: RouteTableSubmitConfig = {
      _type: 'routeTable',

      name: data.settings.nameTag,
      vpcId: data.settings.vpcId,
      tags: data.tags,

      // 생성 시점에는 라우트나 서브넷 정보가 없음
      routes: [{ destination: vpc?.cidrBlock || '', target: 'local' }],
      subnetIds: [],
    }

    onSubmit(submitData)
    reset(DEFAULT_VALUES)
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-5xl space-y-6 p-6 pb-20"
    >
      <div className="mb-4 space-y-2">
        <h1 className="text-2xl font-bold">라우팅 테이블 생성</h1>
        <p className="text-muted-foreground text-sm">
          라우팅 테이블은 VPC, 인터넷 및 VPN 연결 내 서브넷 간에 패킷이 전달되는
          방법을 지정합니다.
        </p>
      </div>

      {/* 1. 일반 설정 (이름, VPC) */}
      <GeneralSettings control={control} vpcs={vpcs} />

      {/* 하단 액션 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          className="bg-orange-600 font-bold text-white hover:bg-orange-700"
          disabled={!vpcId} // VPC 필수 선택
        >
          라우팅 테이블 생성
        </Button>
      </div>
    </form>
  )
}
