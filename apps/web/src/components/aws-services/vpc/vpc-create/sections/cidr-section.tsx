'use client'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { VpcSectionProps } from '@/types/aws-services/vpc/vpc-config.types'

export function CidrBlock({ control }: VpcSectionProps) {
  return (
    <div className="space-y-6">
      {/* IPv4 설정 */}
      <SectionContainer title="IPv4 CIDR 블록">
        <div className="space-y-4">
          <Controller
            name="cidr.cidrBlock"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="ipv4-manual" />
                  <Label htmlFor="ipv4-manual">IPv4 CIDR 수동 입력</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ipam" id="ipv4-ipam" disabled />
                  <Label htmlFor="ipv4-ipam" className="text-muted-foreground">
                    IPAM 할당 IPv4 CIDR 블록
                  </Label>
                </div>
              </RadioGroup>
            )}
          />

          <div className="space-y-2">
            <Label className="text-sm font-semibold">IPv4 CIDR</Label>
            <Controller
              name="cidr.cidrBlock"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="10.0.0.0/16"
                  className="max-w-2xl"
                />
              )}
            />
            <p className="text-muted-foreground text-xs">
              CIDR 블록 크기는 /16에서 /28 사이여야 합니다.
            </p>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
