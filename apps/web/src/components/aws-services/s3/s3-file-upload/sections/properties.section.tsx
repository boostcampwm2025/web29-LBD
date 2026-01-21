import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { S3UploadSectionProps } from '@/types/aws-services/s3/file-upload'

export const PropertiesSection = ({
  control,
  config,
}: S3UploadSectionProps) => {
  if (!config.properties) return null

  return (
    <SectionContainer
      title="속성"
      description="객체의 스토리지 클래스 및 메타데이터를 설정하세요"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storage-class">스토리지 클래스</Label>
          <Controller
            name="storageClass"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="storage-class" className="max-w-md">
                  <SelectValue placeholder="스토리지 클래스 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">
                    Standard - 자주 액세스하는 데이터
                  </SelectItem>
                  <SelectItem value="intelligent-tiering">
                    Intelligent-Tiering - 액세스 패턴이 변경되는 데이터
                  </SelectItem>
                  <SelectItem value="standard-ia">
                    Standard-IA - 자주 액세스하지 않는 데이터
                  </SelectItem>
                  <SelectItem value="onezone-ia">
                    One Zone-IA - 자주 액세스하지 않는 중요하지 않은 데이터
                  </SelectItem>
                  <SelectItem value="glacier">
                    Glacier Instant Retrieval - 즉시 액세스가 필요한 아카이브
                    데이터
                  </SelectItem>
                  <SelectItem value="glacier-flexible">
                    Glacier Flexible Retrieval - 즉시 액세스가 필요하지 않은
                    아카이브 데이터
                  </SelectItem>
                  <SelectItem value="deep-archive">
                    Glacier Deep Archive - 장기 아카이브
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-muted-foreground text-sm">
            스토리지 클래스는 객체가 저장되는 방식과 비용에 영향을 줍니다.
          </p>
        </div>
      </div>
    </SectionContainer>
  )
}
