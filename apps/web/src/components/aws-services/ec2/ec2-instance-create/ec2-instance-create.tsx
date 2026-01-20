'use client'

import { NameTag } from './sections'

import { useForm } from 'react-hook-form'

import { Separator } from '@/components/ui/separator'
import { EC2_INSTANCE_CREATE_SECTIONS } from '@/constants/aws-services/ec2/ec2-instance-create.constants'
import type { EC2InstanceFormData } from '@/types/aws-services/ec2'

interface EC2InstanceCreateProps {
  onNext: () => void
  onPrev: () => void
  canGoPrev: boolean
}

export default function EC2InstanceCreate({
  onNext,
  onPrev,
  canGoPrev,
}: EC2InstanceCreateProps) {
  const { control } = useForm<EC2InstanceFormData>({
    defaultValues: {
      nameTag: { name: '' },
    },
  })

  // 모든 섹션 활성화
  const config = EC2_INSTANCE_CREATE_SECTIONS.reduce(
    (acc, section) => ({ ...acc, [section]: true }),
    {} as Record<(typeof EC2_INSTANCE_CREATE_SECTIONS)[number], boolean>,
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">인스턴스 시작</h2>
        <p className="text-muted-foreground">
          Amazon EC2 인스턴스를 생성하고 구성하세요
        </p>
      </div>

      {config.nameTag && (
        <>
          <NameTag control={control} config={config} />
          <Separator />
        </>
      )}
    </div>
  )
}
