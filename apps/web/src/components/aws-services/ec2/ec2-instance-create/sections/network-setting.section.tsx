import { AlertTriangle } from 'lucide-react'

import { Controller, useWatch } from 'react-hook-form'

import { TooltipBox } from '@/components/aws-services/common/tooltip-box'
import { SectionContainer } from '@/components/section-container'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  EC2_TOOLTIPS,
  FIREWALL_OPTIONS,
  SUBNET_OPTIONS,
  VPC_OPTIONS,
} from '@/constants/aws-services/ec2'
import type { EC2SectionProps } from '@/types/aws-services/ec2/instance-create'
import { useProblemForm } from '@/contexts/problem-form-context'
import { getDefaultVpcs } from '@/lib/get-default-vpcs'
import { getDefaultSubnets } from '@/lib/get-default-subnets'
import { getDefaultSecurityGroups } from '@/lib/get-default-security-groups'

export function NetworkSetting({ control }: EC2SectionProps) {
  const { submitConfig } = useProblemForm()
  const currentVpcs = getDefaultVpcs(submitConfig)
  const currentSubnets = getDefaultSubnets(submitConfig)
  const currentSgs = getDefaultSecurityGroups(submitConfig)

  const selectedSgs = useWatch({
    control,
    name: 'networkSetting.securityGroups',
  })
  const hasSelectedSg = selectedSgs && selectedSgs.length > 0
  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          네트워크 설정
          <TooltipBox content={EC2_TOOLTIPS.networkSetting} />
        </div>
      }
      description="인스턴스의 네트워크 및 보안 설정을 구성하세요"
    >
      <div className="space-y-5">
        {/* VPC 선택 */}
        <div className="space-y-2">
          <Label htmlFor="vpc-select">VPC</Label>
          <Controller
            name="networkSetting.vpcName"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="VPC 선택" />
                </SelectTrigger>
                <SelectContent>
                  {currentVpcs.map((vpc) => (
                    <SelectItem key={vpc.id} value={vpc.id}>
                      {vpc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Subnet 선택 */}
        <div className="space-y-2">
          <Label htmlFor="subnet-select">Subnet</Label>
          <Controller
            name="networkSetting.subnetName"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Subnet 선택" />
                </SelectTrigger>
                <SelectContent>
                  {currentSubnets.map((subnet) => (
                    <SelectItem key={subnet.id} value={subnet.id}>
                      {subnet.name} ({subnet.cidrBlock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* 보안 그룹 선택 */}
        <div className="space-y-2">
          <Label htmlFor="sg-select">보안 그룹</Label>
          <Controller
            name="networkSetting.securityGroups"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.[0] || 'none'}
                onValueChange={(val) => field.onChange(val === 'none' ? [] : [val])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="기존 보안 그룹 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- 선택 안함 --</SelectItem>
                  {currentSgs.map((sg) => (
                    <SelectItem key={sg.id} value={sg.name}>
                      {sg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

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
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium whitespace-nowrap ${field.value ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {field.value ? '활성화' : '비활성화'}
                </span>
                <Switch
                  id="auto-assign-ip"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </div>

        {/* 방화벽(보안 그룹) */}
        {!hasSelectedSg && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>방화벽(보안 그룹)</Label>
              <p className="text-muted-foreground text-sm">
                보안 그룹은 인스턴스에 대한 트래픽을 제어하는 가상 방화벽 규칙
                세트입니다
              </p>
            </div>
            {FIREWALL_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-start gap-3">
                <Controller
                  name={option.name}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={option.id}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <div className="space-y-1">
                  <Label htmlFor={option.id} className="font-medium">
                    {option.label}
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 경고 메시지 */}
        {!hasSelectedSg && (
          <div className="bg-primary/10 border-primary/20 rounded-md border p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-primary text-sm">
                0.0.0.0/0 규칙은 모든 IP 주소에서 인스턴스에 액세스하도록
                허용합니다. 보안 그룹 설정 후 실제 서비스를 접근할 수 있는 IP
                주소로만 제한하는 것이 좋습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  )
}
