import type { CloudFrontSettingsSectionProps } from '../types'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function GeneralConfigSection({
  control,
}: CloudFrontSettingsSectionProps) {
  return (
    <SectionContainer
      title="일반 구성"
      description="배포의 기본 정보를 입력하세요"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dist-name">배포 이름 (선택)</Label>
          <Controller
            name="distributionName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="dist-name"
                placeholder="my-cloudfront-distribution"
                className="max-w-md"
              />
            )}
          />
          <p className="text-muted-foreground text-sm">
            배포를 식별하기 쉬운 이름을 입력하세요
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dist-description">설명 (선택)</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="dist-description"
                placeholder="정적 웹사이트용 CDN 배포"
                className="max-w-md"
              />
            )}
          />
        </div>

        <Controller
          name="enabled"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch
                id="dist-enabled"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="flex-1">
                <Label htmlFor="dist-enabled">배포 생성 후 즉시 활성화</Label>
                <p className="text-muted-foreground text-sm">
                  비활성화 시 배포가 생성되지만 트래픽은 처리되지 않습니다
                </p>
              </div>
            </div>
          )}
        />
      </div>
    </SectionContainer>
  )
}
