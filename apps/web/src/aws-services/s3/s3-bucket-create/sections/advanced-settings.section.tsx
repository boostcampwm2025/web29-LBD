import type { S3SectionProps } from '../types'
import { AlertCircle } from 'lucide-react'

import { Controller } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export const AdvancedSettings = ({ control }: S3SectionProps) => {
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
                <Controller
                  name="advancedSettings.objectLockEnabled"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="object-lock"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
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
