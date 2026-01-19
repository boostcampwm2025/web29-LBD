import type { CloudFrontSettingsSectionProps } from '../types'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function NetworkSection({ control }: CloudFrontSettingsSectionProps) {
  return (
    <SectionContainer title="네트워크" description="IPv6 지원 설정">
      <Controller
        name="ipv6Enabled"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="ipv6-enabled"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <div className="flex-1">
              <Label htmlFor="ipv6-enabled">IPv6 활성화</Label>
              <p className="text-muted-foreground text-sm">
                IPv6을 지원하는 클라이언트가 배포에 연결할 수 있도록 허용합니다
                (권장)
              </p>
            </div>
          </div>
        )}
      />
    </SectionContainer>
  )
}
