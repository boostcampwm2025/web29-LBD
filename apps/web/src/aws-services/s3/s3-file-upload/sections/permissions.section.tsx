import type { S3UploadSectionProps } from '../types'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export const PermissionsSection = ({
  control,
  config,
}: S3UploadSectionProps) => {
  if (!config.permissions) return null

  return (
    <SectionContainer
      title="권한"
      description="업로드된 파일에 대한 액세스 권한을 지정하세요"
    >
      <Controller
        name="permission"
        control={control}
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            <div className="flex items-start gap-3">
              <RadioGroupItem value="private" id="private" />
              <div className="space-y-1">
                <Label htmlFor="private" className="font-medium">
                  비공개(권장)
                </Label>
                <p className="text-muted-foreground text-sm">
                  버킷 소유자만 객체에 액세스할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RadioGroupItem value="public-read" id="public-read" />
              <div className="space-y-1">
                <Label htmlFor="public-read" className="font-medium">
                  퍼블릭 읽기 액세스 권한 부여
                </Label>
                <p className="text-muted-foreground text-sm">
                  모든 사용자가 객체를 읽을 수 있습니다.
                </p>
              </div>
            </div>
          </RadioGroup>
        )}
      />
    </SectionContainer>
  )
}
