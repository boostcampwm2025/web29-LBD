import { AlertCircle } from 'lucide-react'

import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { S3SectionProps } from '@/types/aws-services/s3/bucket-create'

export const ObjectOwnership = ({ control }: S3SectionProps) => {
  const aclEnabled = useWatch({ control, name: 'ownership.aclEnabled' })

  return (
    <SectionContainer
      title="객체 소유권"
      description="다른 AWS 계정에서 이 버킷에 기록된 객체의 소유권 제어"
    >
      <div className="space-y-4">
        <Controller
          name="ownership.aclEnabled"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value)
              }}
            >
              {/* ACLs disabled (recommended) */}
              <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-4">
                <RadioGroupItem value="disabled" id="acl-disabled" />
                <div className="flex-1 space-y-1">
                  <Label htmlFor="acl-disabled" className="font-semibold">
                    ACL 비활성화(권장)
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    이 버킷의 모든 객체는 이 계정이 소유합니다. 이 버킷 및 해당
                    객체에 대한 액세스는 정책만 사용하여 지정됩니다.
                  </p>
                </div>
              </div>

              {/* ACLs enabled */}
              <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-4">
                <RadioGroupItem value="enabled" id="acl-enabled" />
                <div className="flex-1 space-y-3">
                  <Label htmlFor="acl-enabled" className="font-semibold">
                    ACL 활성화
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    이 버킷의 객체는 다른 AWS 계정이 소유할 수 있습니다. 이 버킷
                    및 해당 객체에 대한 액세스는 ACL을 사용하여 지정할 수
                    있습니다.
                  </p>

                  {aclEnabled === 'enabled' && (
                    <div className="bg-destructive/10 border-destructive/20 flex gap-2 rounded-md border p-3">
                      <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
                      <p className="text-destructive text-sm">
                        대부분의 사용 사례에서는 ACL을 활성화하는 것이 권장되지
                        않습니다.
                      </p>
                    </div>
                  )}

                  {aclEnabled === 'enabled' && (
                    <Controller
                      name="ownership.ownershipModel"
                      control={control}
                      render={({ field: nestedField }) => (
                        <RadioGroup
                          value={nestedField.value || 'bucket-owner-preferred'}
                          onValueChange={nestedField.onChange}
                          className="mt-3 ml-6"
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem
                              value="bucket-owner-preferred"
                              id="preferred"
                            />
                            <div className="space-y-1">
                              <Label
                                htmlFor="preferred"
                                className="font-medium"
                              >
                                버킷 소유자 선호
                              </Label>
                              <p className="text-muted-foreground text-sm">
                                이 버킷에 기록된 새 객체가
                                bucket-owner-full-control 고정 ACL을 지정하는
                                경우 해당 객체는 버킷 소유자가 소유합니다.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <RadioGroupItem
                              value="object-writer"
                              id="object-writer"
                            />
                            <div className="space-y-1">
                              <Label
                                htmlFor="object-writer"
                                className="font-medium"
                              >
                                객체 작성자
                              </Label>
                              <p className="text-muted-foreground text-sm">
                                객체를 업로드하는 AWS 계정이 해당 객체를
                                소유합니다.
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  )}
                </div>
              </div>
            </RadioGroup>
          )}
        />
      </div>
    </SectionContainer>
  )
}
