import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { CloudFrontWebsiteSectionProps } from '@/types/aws-services/cloudfront/website-settings'

export function WafSection({ control }: CloudFrontWebsiteSectionProps) {
  const wafEnabled = useWatch({ control, name: 'wafEnabled' })

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="waf" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          <div className="text-left">
            <div className="font-semibold">AWS WAF 웹 ACL</div>
            <div className="text-muted-foreground text-sm">
              DDoS 방지 및 보안 규칙 적용
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <SectionContainer title="" className="mt-4">
            <div className="space-y-4">
              <Controller
                name="wafEnabled"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch
                      id="waf-enabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="flex-1">
                      <Label htmlFor="waf-enabled">WAF 활성화</Label>
                      <p className="text-muted-foreground text-sm">
                        웹 애플리케이션 방화벽으로 배포 보호
                      </p>
                    </div>
                  </div>
                )}
              />

              {wafEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="web-acl-id">웹 ACL ID</Label>
                  <Controller
                    name="webAclId"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="web-acl-id"
                        placeholder="arn:aws:wafv2:us-east-1:123456789012:global/webacl/..."
                      />
                    )}
                  />
                  <p className="text-muted-foreground text-sm">
                    CloudFront용 WAF ACL은 us-east-1 리전에 생성되어야 합니다
                  </p>
                </div>
              )}
            </div>
          </SectionContainer>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
