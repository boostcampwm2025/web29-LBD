'use client'

import { AlertCircle, Info } from 'lucide-react'

import React from 'react'

import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

function GeneralConfiguration() {
  return (
    <SectionContainer
      title="일반 구성"
      description="버킷에 고유한 이름을 선택하고 AWS 리전을 선택하세요"
    >
      <div className="space-y-6">
        {/* Bucket Name */}
        <div className="space-y-2">
          <Label htmlFor="bucket-name">버킷 이름</Label>
          <Input
            id="bucket-name"
            placeholder="my-unique-bucket-name"
            className="max-w-md"
          />
          <div className="text-muted-foreground flex items-start gap-2 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="">
              버킷은 DNS를 통해 배포되기 때문에 버킷 이름은 전역적으로 고유해야
              하며 DNS 규격을 준수해야 합니다. 소문자, 숫자, 하이픈 및 마침표만
              사용할 수 있습니다.
            </p>
          </div>
        </div>

        {/* AWS Region */}
        <div className="space-y-2">
          <Label htmlFor="region">AWS 리전</Label>
          <Select defaultValue="ap-northeast-2">
            <SelectTrigger id="region" className="max-w-md">
              <SelectValue placeholder="리전 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us-east-1">
                미국 동부(버지니아 북부) us-east-1
              </SelectItem>
              <SelectItem value="us-east-2">
                미국 동부(오하이오) us-east-2
              </SelectItem>
              <SelectItem value="us-west-1">
                미국 서부(캘리포니아 북부) us-west-1
              </SelectItem>
              <SelectItem value="us-west-2">
                미국 서부(오레곤) us-west-2
              </SelectItem>
              <SelectItem value="ap-northeast-2">
                아시아 태평양(서울) ap-northeast-2
              </SelectItem>
              <SelectItem value="ap-northeast-1">
                아시아 태평양(도쿄) ap-northeast-1
              </SelectItem>
              <SelectItem value="eu-west-1">
                유럽(아일랜드) eu-west-1
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SectionContainer>
  )
}

function ObjectOwnership() {
  const [aclEnabled, setAclEnabled] = React.useState('disabled')

  return (
    <SectionContainer
      title="객체 소유권"
      description="다른 AWS 계정에서 이 버킷에 기록된 객체의 소유권 제어"
    >
      <div className="space-y-4">
        <RadioGroup value={aclEnabled} onValueChange={setAclEnabled}>
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
                이 버킷의 객체는 다른 AWS 계정이 소유할 수 있습니다. 이 버킷 및
                해당 객체에 대한 액세스는 ACL을 사용하여 지정할 수 있습니다.
              </p>

              {aclEnabled === 'enabled' && (
                <>
                  <div className="bg-destructive/10 border-destructive/20 flex gap-2 rounded-md border p-3">
                    <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
                    <p className="text-destructive text-sm">
                      대부분의 사용 사례에서는 ACL을 활성화하는 것이 권장되지
                      않습니다.
                    </p>
                  </div>

                  <RadioGroup
                    defaultValue="bucket-owner-preferred"
                    className="mt-3 ml-6"
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="bucket-owner-preferred"
                        id="preferred"
                      />
                      <div className="space-y-1">
                        <Label htmlFor="preferred" className="font-medium">
                          버킷 소유자 선호
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          이 버킷에 기록된 새 객체가 bucket-owner-full-control
                          고정 ACL을 지정하는 경우 해당 객체는 버킷 소유자가
                          소유합니다.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value="object-writer"
                        id="object-writer"
                      />
                      <div className="space-y-1">
                        <Label htmlFor="object-writer" className="font-medium">
                          객체 작성자
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          객체를 업로드하는 AWS 계정이 해당 객체를 소유합니다.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>
    </SectionContainer>
  )
}

function BlockPublicAccess() {
  const [blockAll, setBlockAll] = React.useState(true)

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
          <Checkbox
            id="block-all-public"
            checked={blockAll}
            onCheckedChange={(checked) => setBlockAll(checked === true)}
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
            <Checkbox id="block-acls" disabled={blockAll} defaultChecked />
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
            <Checkbox
              id="block-existing-acls"
              disabled={blockAll}
              defaultChecked
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
            <Checkbox
              id="block-bucket-policies"
              disabled={blockAll}
              defaultChecked
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
            <Checkbox
              id="restrict-buckets"
              disabled={blockAll}
              defaultChecked
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

function BucketVersioning() {
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
        <Switch id="versioning" />
      </div>
    </SectionContainer>
  )
}

function Tags() {
  return (
    <SectionContainer
      title="태그 - 선택 사항"
      description="버킷을 구성하고 분류하기 위해 태그를 추가하세요"
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="tags" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            태그 추가 (0)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-key">키</Label>
                  <Input id="tag-key" placeholder="Environment" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag-value">값</Label>
                  <Input id="tag-value" placeholder="Production" />
                </div>
              </div>
              <Button variant="outline" size="sm">
                태그 추가
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SectionContainer>
  )
}

function DefaultEncryption() {
  return (
    <SectionContainer
      title="기본 암호화"
      description="서버 측 암호화는 디스크에 기록될 때 데이터를 자동으로 암호화하고 액세스 시 복호화합니다."
    >
      <div className="space-y-4">
        <div className="bg-primary/10 border-primary/20 flex gap-2 rounded-md border p-3">
          <Info className="text-primary h-5 w-5 shrink-0" />
          <p className="text-primary text-sm">
            Amazon S3 관리형 키를 사용한 서버 측 암호화(SSE-S3)는 모든 새 버킷에
            대해 기본적으로 활성화됩니다.
          </p>
        </div>

        <RadioGroup defaultValue="sse-s3">
          <div className="flex items-start gap-3">
            <RadioGroupItem value="sse-s3" id="sse-s3" />
            <div className="space-y-1">
              <Label htmlFor="sse-s3" className="font-medium">
                Amazon S3 관리형 키를 사용한 서버 측 암호화(SSE-S3)
              </Label>
              <p className="text-muted-foreground text-sm">
                저장 시 암호화를 위해 Amazon S3에서 관리하는 키를 사용합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RadioGroupItem value="sse-kms" id="sse-kms" />
            <div className="space-y-1">
              <Label htmlFor="sse-kms" className="font-medium">
                AWS Key Management Service 키를 사용한 서버 측 암호화(SSE-KMS)
              </Label>
              <p className="text-muted-foreground text-sm">
                저장 시 암호화를 위해 AWS KMS에 저장된 키를 사용합니다.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </SectionContainer>
  )
}

function AdvancedSettings() {
  return (
    <SectionContainer
      title="고급 설정 - 선택 사항"
      description="고급 버킷 기능을 구성하세요"
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            객체 잠금
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="bg-muted/50 flex items-start gap-3 rounded-lg border p-4">
                <Checkbox id="object-lock" />
                <div className="space-y-2">
                  <Label htmlFor="object-lock" className="font-medium">
                    객체 잠금 활성화
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    이 버킷의 객체를 영구적으로 잠글 수 있습니다. 버킷을 생성한
                    후 기본 객체 잠금 설정을 구성할 수 있습니다. 객체 잠금을
                    사용하려면 버전 관리를 활성화해야 합니다.
                  </p>
                  <div className="bg-destructive/10 border-destructive/20 flex gap-2 rounded-md border p-3">
                    <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
                    <p className="text-destructive text-sm">
                      버킷을 생성한 후에는 객체 잠금을 비활성화할 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SectionContainer>
  )
}

interface S3BucketCreateProps {
  onNext: () => void
  onPrev: () => void
  canGoPrev: boolean
}

export default function S3BucketCreate({
  onNext,
  onPrev,
  canGoPrev,
}: S3BucketCreateProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">버킷 생성</h2>
        <p className="text-muted-foreground">S3 버킷 설정을 구성하세요</p>
      </div>

      {/* Section 1: General Configuration */}
      <GeneralConfiguration />

      <Separator />

      {/* Section 2: Object Ownership */}
      <ObjectOwnership />

      <Separator />

      {/* Section 3: Block Public Access */}
      <BlockPublicAccess />

      <Separator />

      {/* Section 4: Bucket Versioning */}
      <BucketVersioning />

      <Separator />

      {/* Section 5: Tags (Optional) */}
      <Tags />

      <Separator />

      {/* Section 6: Default Encryption */}
      <DefaultEncryption />

      <Separator />

      {/* Section 7: Advanced Settings */}
      <AdvancedSettings />

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={onPrev} disabled={!canGoPrev}>
          취소
        </Button>
        <div className="flex gap-3">
          <Button onClick={onNext}>다음 단계</Button>
        </div>
      </div>
    </div>
  )
}
