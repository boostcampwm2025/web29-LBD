import { Info } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { EC2_TOOLTIPS } from '@/constants/aws-services/ec2/ec2-tooltips.constants'
import type { EC2SectionProps } from '@/types/aws-services/ec2/ec2-instance-create'

export function NetworkSetting({ control }: EC2SectionProps) {
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          네트워크 설정
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-center">
                <p>{EC2_TOOLTIPS.networkSetting}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      }
      description="인스턴스의 네트워크 및 보안 설정을 구성하세요"
    >
      <div className="space-y-6">
        {/* 퍼블릭 IP 자동 할당 */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="auto-assign-ip">퍼블릭 IP 자동 할당</Label>
            <p className="text-muted-foreground text-sm">
              인터넷에서 인스턴스에 접근할 수 있도록 퍼블릭 IP를 할당합니다
            </p>
          </div>
          <Controller
            name="networkSetting.autoAssignPublicIp"
            control={control}
            render={({ field }) => (
              <Switch
                id="auto-assign-ip"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* 방화벽(보안 그룹) */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>방화벽(보안 그룹)</Label>
            <p className="text-muted-foreground text-sm">
              보안 그룹은 인스턴스에 대한 트래픽을 제어하는 가상 방화벽 규칙
              세트입니다
            </p>
          </div>

          {/* SSH 트래픽 */}
          <div className="flex items-start gap-3">
            <Controller
              name="networkSetting.allowSSH"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="allow-ssh"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="allow-ssh" className="font-medium">
                인터넷에서 SSH 트래픽 허용
              </Label>
              <p className="text-muted-foreground text-sm">
                포트 22 • 원격으로 인스턴스에 접속할 수 있습니다
              </p>
            </div>
          </div>

          {/* HTTPS 트래픽 */}
          <div className="flex items-start gap-3">
            <Controller
              name="networkSetting.allowHTTPS"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="allow-https"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="allow-https" className="font-medium">
                인터넷에서 HTTPS 트래픽 허용
              </Label>
              <p className="text-muted-foreground text-sm">
                포트 443 • 보안 웹 서버를 운영할 수 있습니다
              </p>
            </div>
          </div>

          {/* HTTP 트래픽 */}
          <div className="flex items-start gap-3">
            <Controller
              name="networkSetting.allowHTTP"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="allow-http"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="allow-http" className="font-medium">
                인터넷에서 HTTP 트래픽 허용
              </Label>
              <p className="text-muted-foreground text-sm">
                포트 80 • 웹 서버를 운영할 수 있습니다
              </p>
            </div>
          </div>
        </div>

        {/* 경고 메시지 */}
        <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">
          <p className="text-destructive text-sm">
            ⚠️ 0.0.0.0/0 규칙은 모든 IP 주소에서 인스턴스에 액세스하도록
            허용합니다. 보안 그룹 설정 후 실제 서비스를 접근할 수 있는 IP
            주소로만 제한하는 것이 좋습니다.
          </p>
        </div>
      </div>
    </SectionContainer>
  )
}
