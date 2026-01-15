import type { CloudFrontWebsiteSectionProps } from '../types'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'

export function ReviewSummarySection({
  control,
}: CloudFrontWebsiteSectionProps) {
  const defaultRootObject =
    useWatch({ control, name: 'defaultRootObject' }) || 'index.html'
  const errorResponses = useWatch({ control, name: 'errorResponses' }) || []
  const loggingEnabled = useWatch({ control, name: 'loggingEnabled' })
  const wafEnabled = useWatch({ control, name: 'wafEnabled' })

  return (
    <SectionContainer
      title="설정 검토"
      description="모든 단계의 설정을 확인하세요"
    >
      <div className="space-y-4">
        {/* Step 1 Summary */}
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-semibold">Origin 설정</span>
            </div>
          </div>
          <div className="text-muted-foreground space-y-1 text-sm">
            <div>• Origin Type: S3 버킷</div>
            <div>• Access Control: OAC (권장)</div>
          </div>
        </div>

        {/* Step 2 Summary */}
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-semibold">배포 설정</span>
            </div>
          </div>
          <div className="text-muted-foreground space-y-1 text-sm">
            <div>• Price Class: 북미, 유럽, 아시아</div>
            <div>• SSL/TLS: CloudFront 기본 인증서</div>
            <div>• IPv6: 활성화</div>
          </div>
        </div>

        {/* Step 3 Summary */}
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-semibold">캐시 및 동작</span>
            </div>
          </div>
          <div className="text-muted-foreground space-y-1 text-sm">
            <div>• Viewer Protocol: HTTPS 리디렉션</div>
            <div>• HTTP Methods: GET, HEAD (읽기 전용)</div>
            <div>• Cache Policy: CachingOptimized</div>
            <div>• Compression: 활성화</div>
          </div>
        </div>

        {/* Step 4 Summary */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="text-primary h-5 w-5" />
            <span className="font-semibold">웹사이트 설정</span>
          </div>
          <div className="space-y-1 text-sm text-blue-900">
            <div className="font-semibold">
              • Default Root Object: {defaultRootObject}
            </div>
            <div>• 커스텀 오류 페이지: {errorResponses.length}개</div>
            <div>• 로깅: {loggingEnabled ? '활성화' : '비활성화'}</div>
            <div>• WAF: {wafEnabled ? '활성화' : '비활성화'}</div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-2 font-semibold text-orange-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>배포 후 추가 작업</span>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-orange-900">
            <li>S3 버킷 정책을 업데이트하여 OAC 액세스 허용</li>
            <li>
              배포 상태가 &quot;Deployed&quot;로 변경될 때까지 대기 (약 10-15분
              소요)
            </li>
            <li>CloudFront 도메인 또는 CNAME으로 웹사이트 접근 테스트</li>
            <li>캐시 무효화(Invalidation)로 업데이트 즉시 반영 가능</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  )
}
