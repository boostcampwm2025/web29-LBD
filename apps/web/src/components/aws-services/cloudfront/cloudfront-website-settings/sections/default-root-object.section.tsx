import { AlertCircle, Info } from 'lucide-react'

import { Controller, useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CloudFrontWebsiteSectionProps } from '@/types/aws-services/cloudfront/website-settings'

export function DefaultRootObjectSection({
  control,
}: CloudFrontWebsiteSectionProps) {
  const defaultRootObject =
    useWatch({ control, name: 'defaultRootObject' }) || 'index.html'

  return (
    <SectionContainer
      title={
        <div className="flex items-center gap-2">
          <span>기본 루트 객체</span>
          <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
            필수
          </span>
        </div>
      }
      description="루트 URL 접근 시 CloudFront가 반환할 기본 파일을 지정하세요"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="default-root-object">기본 루트 객체</Label>
          <Controller
            name="defaultRootObject"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="default-root-object"
                placeholder="index.html"
                className="max-w-md"
              />
            )}
          />
          <p className="text-muted-foreground text-sm">
            예: index.html, home.html, default.html
          </p>
        </div>

        {/* 예시 설명 */}
        <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2 text-sm font-semibold text-blue-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>기본 루트 객체의 동작 방식</span>
          </div>
          <div className="space-y-2 text-sm text-blue-900">
            <div className="font-mono">
              <div className="text-muted-foreground">
                사용자가 다음과 같이 접근:
              </div>
              <div>https://d111111abcdef8.cloudfront.net/</div>
            </div>
            <div className="flex items-center gap-2">
              <span>↓</span>
              <span>CloudFront가 자동으로 변환</span>
            </div>
            <div className="font-mono">
              <div>
                https://d111111abcdef8.cloudfront.net/
                <span className="bg-blue-200 px-1">{defaultRootObject}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="flex items-start gap-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">중요:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>지정한 파일이 S3 버킷의 루트에 실제로 존재해야 합니다</li>
              <li>
                하위 디렉토리에는 적용되지 않습니다 (예: /docs/는 별도 설정
                필요)
              </li>
              <li>파일명은 대소문자를 구분합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
