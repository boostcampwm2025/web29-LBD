'use client'

import { AttachForm } from './sections/attach-form'

import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useActionFeedback } from '@/contexts/action-feedback-context'
import { useProblemForm } from '@/contexts/problem-form-context'
import type {
  InternetGatewayAttachFormData,
  InternetGatewaySubmitConfig,
} from '@/types/aws-services/internet-gateway/internet-gateway.types'
import type { VpcSubmitConfig } from '@/types/aws-services/vpc/vpc-submit-config.types'

interface InternetGatewayAttachProps {
  onAfterSubmit?: () => void
}

export default function InternetGatewayAttach({
  onAfterSubmit,
}: InternetGatewayAttachProps) {
  const { submitConfig, setSubmitConfig } = useProblemForm()

  // 1. 데이터 가공 (Transformation)
  // ServiceConfigItem<{...}>[] 형태를 순수 Config[] 형태로 변환합니다.
  // 이때 wrapper에 있는 'id'를 data 객체 내부에 확실하게 병합합니다.

  const igwList: InternetGatewaySubmitConfig[] = (
    submitConfig.internetGateway || []
  ).map((item) => ({
    ...item.data,
    id: item.id, // wrapper의 ID를 최우선으로 사용
  }))

  const vpcList: VpcSubmitConfig[] = (submitConfig.vpc || []).map((item) => ({
    ...item.data,
    id: item.id,
  }))

  const { control, handleSubmit } = useForm<InternetGatewayAttachFormData>({
    mode: 'onChange',
    defaultValues: {
      internetGatewayId: '',
      vpcId: '',
    },
  })

  // 버튼 활성화를 위해 값 감시
  const [selectedIgw, selectedVpc] = useWatch({
    control,
    name: ['internetGatewayId', 'vpcId'],
  })

  const { showFeedback } = useActionFeedback()

  const handleFormSubmit = handleSubmit((data) => {
    // 2. 전역 상태 업데이트
    setSubmitConfig((prev) => {
      if (!prev.internetGateway) return prev

      return {
        ...prev,
        internetGateway: prev.internetGateway.map((igw) => {
          if (igw.id === data.internetGatewayId) {
            return {
              ...igw,
              isReady: true,
              data: {
                ...igw.data,
                vpcId: data.vpcId,
                vpcName:
                  vpcList.find((v) => v.id === data.vpcId)?.name || data.vpcId,
              },
            }
          }
          return igw
        }),
      }
    })

    showFeedback({
      title: '연결 완료',
      message: `인터넷 게이트웨이가 VPC(${data.vpcId})에 성공적으로 연결되었습니다.`,
      type: 'success',
    })

    if (onAfterSubmit) onAfterSubmit()
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-5xl space-y-6 p-6 pb-20"
    >
      <div className="mb-4 space-y-2">
        <h1 className="text-2xl font-bold">VPC에 연결</h1>
        <p className="text-muted-foreground text-sm">
          인터넷 게이트웨이를 VPC에 연결하여 인터넷 통신을 활성화합니다.
        </p>
      </div>

      {/* 연결 폼 섹션 - 이제 가공된 순수 리스트를 전달합니다 */}
      <AttachForm control={control} igwList={igwList} vpcList={vpcList} />

      {/* 하단 액션 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={!selectedIgw || !selectedVpc}
        >
          인터넷 게이트웨이 연결
        </Button>
      </div>
    </form>
  )
}
