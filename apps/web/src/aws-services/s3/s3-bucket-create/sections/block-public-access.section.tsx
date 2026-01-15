import type { S3WithSetValuesSectionProps } from '../types'
import { AlertCircle } from 'lucide-react'

import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export const BlockPublicAccess = ({
  control,
  setValue,
}: S3WithSetValuesSectionProps) => {
  const blockAll = useWatch({ control, name: 'blockPublicAccess.blockAll' })

  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          <AlertCircle className="text-destructive h-5 w-5" />이 버킷의 퍼블릭
          액세스 차단 설정
        </div>
      }
      description="S3 퍼블릭 액세스 차단은 S3 버킷 내 데이터에 대한 퍼블릭 액세스를 허용하는 모든 설정의 적용을 방지합니다. 모든 설정을 활성화 상태로 유지하는 것이 좋습니다."
    >
      <div className="space-y-4">
        {/* Master Toggle */}
        <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-4">
          <Controller
            name="blockPublicAccess.blockAll"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="block-all-public"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  // When blockAll is true, auto-set all individual fields
                  if (checked) {
                    setValue('blockPublicAccess.blockPublicAcls', true)
                    setValue('blockPublicAccess.ignorePublicAcls', true)
                    setValue('blockPublicAccess.blockPublicPolicy', true)
                    setValue('blockPublicAccess.restrictPublicBuckets', true)
                  }
                }}
              />
            )}
          />
          <div className="space-y-1">
            <Label htmlFor="block-all-public" className="font-semibold">
              모든 퍼블릭 액세스 차단
            </Label>
            <p className="text-muted-foreground text-sm">
              이 설정을 활성화하면 아래의 네 가지 설정이 모두 활성화됩니다.
            </p>
          </div>
        </div>

        {/* Individual Settings */}
        <div className={`space-y-3 ${blockAll ? 'opacity-50' : ''}`}>
          <div className="ml-6 flex items-start gap-3">
            <Controller
              name="blockPublicAccess.blockPublicAcls"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="block-acls"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={blockAll}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="block-acls" className="font-medium">
                새 ACL(액세스 제어 목록)을 통해 부여된 버킷 및 객체에 대한
                퍼블릭 액세스 차단
              </Label>
              <p className="text-muted-foreground text-sm">
                S3는 새로 추가된 버킷 또는 객체에 적용된 퍼블릭 액세스 권한을
                차단하고 기존 버킷 및 객체에 대한 새로운 퍼블릭 액세스 ACL
                생성을 방지합니다.
              </p>
            </div>
          </div>

          <div className="ml-6 flex items-start gap-3">
            <Controller
              name="blockPublicAccess.ignorePublicAcls"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="block-existing-acls"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={blockAll}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="block-existing-acls" className="font-medium">
                모든 ACL(액세스 제어 목록)을 통해 부여된 버킷 및 객체에 대한
                퍼블릭 액세스 차단
              </Label>
              <p className="text-muted-foreground text-sm">
                S3는 버킷 및 객체에 대한 퍼블릭 액세스를 부여하는 모든 ACL을
                무시합니다.
              </p>
            </div>
          </div>

          <div className="ml-6 flex items-start gap-3">
            <Controller
              name="blockPublicAccess.blockPublicPolicy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="block-bucket-policies"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={blockAll}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="block-bucket-policies" className="font-medium">
                새 퍼블릭 버킷 또는 액세스 포인트 정책을 통해 부여된 버킷 및
                객체에 대한 퍼블릭 액세스 차단
              </Label>
              <p className="text-muted-foreground text-sm">
                S3는 버킷 및 객체에 대한 퍼블릭 액세스를 부여하는 새 버킷 및
                액세스 포인트 정책을 차단합니다.
              </p>
            </div>
          </div>

          <div className="ml-6 flex items-start gap-3">
            <Controller
              name="blockPublicAccess.restrictPublicBuckets"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="restrict-buckets"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={blockAll}
                />
              )}
            />
            <div className="space-y-1">
              <Label htmlFor="restrict-buckets" className="font-medium">
                퍼블릭 버킷 또는 액세스 포인트 정책을 통한 버킷 및 객체에 대한
                퍼블릭 및 교차 계정 액세스 차단
              </Label>
              <p className="text-muted-foreground text-sm">
                S3는 버킷 및 객체에 대한 퍼블릭 액세스를 부여하는 정책이 있는
                버킷 또는 액세스 포인트에 대한 퍼블릭 및 교차 계정 액세스를
                무시합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
