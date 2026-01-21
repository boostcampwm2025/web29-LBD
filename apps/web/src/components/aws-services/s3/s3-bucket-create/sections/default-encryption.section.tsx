import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { S3SectionProps } from '@/types/aws-services/s3/bucket-create'

export const DefaultEncryption = ({ control }: S3SectionProps) => {
  return (
    <SectionContainer
      title="기본 암호화"
      description="서버 측 암호화는 디스크에 기록될 때 데이터를 자동으로 암호화하고 액세스 시 복호화합니다."
    >
      <div className="space-y-4">
        <div className="bg-primary/10 border-primary/20 flex gap-2 rounded-md border p-3">
          <Info className="text-primary h-5 w-5 shrink-0" />
          <p className="text-primary text-sm">
            Amazon S3 관리형 키를 사용한 서버 측 암호화(SSE-S3)는 모든 새 버킷에
            대해 기본적으로 활성화됩니다.
          </p>
        </div>

        <Controller
          name="encryption.type"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              <div className="flex items-start gap-3">
                <RadioGroupItem value="sse-s3" id="sse-s3" />
                <div className="space-y-1">
                  <Label htmlFor="sse-s3" className="font-medium">
                    Amazon S3 관리형 키를 사용한 서버 측 암호화(SSE-S3)
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    저장 시 암호화를 위해 Amazon S3에서 관리하는 키를
                    사용합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RadioGroupItem value="sse-kms" id="sse-kms" />
                <div className="space-y-1">
                  <Label htmlFor="sse-kms" className="font-medium">
                    AWS Key Management Service 키를 사용한 서버 측
                    암호화(SSE-KMS)
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    저장 시 암호화를 위해 AWS KMS에 저장된 키를 사용합니다.
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
