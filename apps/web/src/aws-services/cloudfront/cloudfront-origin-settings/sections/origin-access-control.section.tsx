import type { CloudFrontOriginSectionProps } from '../types'
import { Info } from 'lucide-react'

import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function OriginAccessControlSection({
  control,
}: CloudFrontOriginSectionProps) {
  const accessControl = useWatch({ control, name: 'accessControl' })

  return (
    <SectionContainer
      title="Origin Access Control"
      description="S3 버킷에 대한 액세스 제어 방법을 선택하세요"
    >
      <div className="space-y-4">
        <Controller
          name="accessControl"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              {/* OAC (권장) */}
              <div className="flex items-start gap-3">
                <RadioGroupItem value="oac" id="access-oac" className="mt-1" />
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor="access-oac" className="font-semibold">
                      Origin Access Control (OAC){' '}
                      <span className="text-primary text-sm">(권장)</span>
                    </Label>
                    <p className="text-muted-foreground mt-1 text-sm">
                      최신 방식으로 S3 버킷 정책을 통해 CloudFront만 액세스 허용
                    </p>
                  </div>
                  {accessControl === 'oac' && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="oac-name">OAC 이름</Label>
                        <Controller
                          name="oacName"
                          control={control}
                          render={({ field: oacField }) => (
                            <Input
                              {...oacField}
                              id="oac-name"
                              placeholder="my-cloudfront-oac"
                              className="max-w-md"
                            />
                          )}
                        />
                      </div>
                      <div className="text-muted-foreground bg-muted/50 rounded-md p-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Info className="mt-0.5 h-4 w-4 shrink-0" />
                          <p>
                            배포 생성 후 S3 버킷 정책을 업데이트하여
                            CloudFront에서만 액세스할 수 있도록 설정해야 합니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* OAI (레거시) */}
              <div className="flex items-start gap-3">
                <RadioGroupItem value="oai" id="access-oai" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="access-oai" className="font-semibold">
                    Origin Access Identity (OAI){' '}
                    <span className="text-muted-foreground text-sm">
                      (레거시)
                    </span>
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    이전 방식의 액세스 제어 (신규 배포에는 권장하지 않음)
                  </p>
                </div>
              </div>

              {/* Public Access */}
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="public"
                  id="access-public"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="access-public" className="font-semibold">
                    Public Access
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    S3 버킷이 퍼블릭으로 설정된 경우 선택
                  </p>
                </div>
              </div>
            </RadioGroup>
          )}
        />
      </div>
    </SectionContainer>
  )
}
