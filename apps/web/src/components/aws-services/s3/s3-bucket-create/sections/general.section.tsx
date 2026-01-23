import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { S3SectionProps } from '@/types/aws-services/s3/bucket-create'

const GENERAL_OPTIONS = {
  bucketName: {
    placeholder: 'my-unique-bucket-name',
    infoText:
      '버킷은 DNS를 통해 배포되기 때문에 버킷 이름은 전역적으로 고유해야 하며 DNS 규격을 준수해야 합니다. 소문자, 숫자, 하이픈 및 마침표만 사용할 수 있습니다.',
  },
  region: {
    availableRegions: [
      { value: 'us-east-1', label: '미국 동부(버지니아 북부) us-east-1' },
      { value: 'us-east-2', label: '미국 동부(오하이오) us-east-2' },
      { value: 'us-west-1', label: '미국 서부(캘리포니아 북부) us-west-1' },
      { value: 'us-west-2', label: '미국 서부(오레곤) us-west-2' },
      { value: 'ap-northeast-2', label: '아시아 태평양(서울) ap-northeast-2' },
      { value: 'ap-northeast-1', label: '아시아 태평양(도쿄) ap-northeast-1' },
      { value: 'eu-west-1', label: '유럽(아일랜드) eu-west-1' },
    ],
  },
} as const

export const GeneralConfiguration = ({
  control,
  config: { general: _general },
}: S3SectionProps) => {
  return (
    <SectionContainer
      title="일반 구성"
      description="버킷에 고유한 이름을 선택하고 AWS 리전을 선택하세요"
    >
      <div className="space-y-6">
        {/* Bucket Name */}
        <div className="space-y-2">
          <Label htmlFor="bucket-name">버킷 이름</Label>
          <Controller
            name="general.bucketName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="bucket-name"
                placeholder={GENERAL_OPTIONS.bucketName.placeholder}
                className="max-w-md"
              />
            )}
          />
          <div className="text-muted-foreground flex items-start gap-2 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="">{GENERAL_OPTIONS.bucketName.infoText}</p>
          </div>
        </div>

        {/* AWS Region */}
        <div className="space-y-2">
          <Label htmlFor="region">AWS 리전</Label>
          <Controller
            name="general.region"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="region" className="max-w-md">
                  <SelectValue placeholder="리전 선택" />
                </SelectTrigger>
                <SelectContent>
                  {GENERAL_OPTIONS.region.availableRegions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </SectionContainer>
  )
}
