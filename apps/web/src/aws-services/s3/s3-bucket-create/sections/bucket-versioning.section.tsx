import type { S3SectionProps } from '../types'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export const BucketVersioning = ({ control }: S3SectionProps) => {
  return (
    <SectionContainer
      title="버킷 버전 관리"
      description="동일한 버킷에 여러 버전의 객체를 유지하여 버킷에 저장된 모든 객체의 모든 버전을 보존, 검색 및 복원할 수 있습니다."
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="versioning" className="font-medium">
            버킷 버전 관리
          </Label>
          <p className="text-muted-foreground text-sm">
            여러 버전의 객체를 유지하려면 버전 관리를 활성화하세요
          </p>
        </div>
        <Controller
          name="versioning.enabled"
          control={control}
          render={({ field }) => (
            <Switch
              id="versioning"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </SectionContainer>
  )
}
