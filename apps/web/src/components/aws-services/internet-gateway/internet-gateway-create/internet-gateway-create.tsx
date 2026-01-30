'use client'

import { IgwSettings } from './sections'

import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  InternetGatewayCreateFormData,
  InternetGatewaySubmitConfig,
} from '@/types/aws-services/internet-gateway/internet-gateway.types'

const DEFAULT_VALUES: InternetGatewayCreateFormData = {
  nameTag: '',
}

interface InternetGatewayCreateProps {
  onSubmit: (data: InternetGatewaySubmitConfig) => void
}

export default function InternetGatewayCreate({
  onSubmit,
}: InternetGatewayCreateProps) {
  const { control, handleSubmit } = useForm<InternetGatewayCreateFormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const handleFormSubmit = handleSubmit((data) => {
    const submitData: InternetGatewaySubmitConfig = {
      _type: 'internetGateway',
      vpcId: undefined,
      vpcName: undefined,
      name: data.nameTag,
      id: data.nameTag || crypto.randomUUID(),
    }
    onSubmit(submitData)
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-5xl space-y-6 p-6 pb-20"
    >
      <div className="mb-4 space-y-2">
        <h1 className="text-2xl font-bold">인터넷 게이트웨이 생성</h1>
        <p className="text-muted-foreground text-sm">
          인터넷 게이트웨이는 VPC를 인터넷과 연결하는 가상 라우터입니다. 새
          인터넷 게이트웨이를 생성하려면 아래에서 게이트웨이 이름을 지정해야
          합니다.
        </p>
      </div>

      {/* 설정 섹션 */}
      <IgwSettings control={control} />

      {/* 하단 액션 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
        >
          인터넷 게이트웨이 생성
        </Button>
      </div>
    </form>
  )
}
