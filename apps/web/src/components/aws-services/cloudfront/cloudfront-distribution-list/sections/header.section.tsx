import { Info } from 'lucide-react'

export function HeaderSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">배포 생성 완료</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            배포가 생성되었습니다. 배포를 선택하여 Default Root Object를
            설정하세요.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <Info className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">다음 단계:</p>
          <p>
            배포를 선택하여 Default Root Object(예: index.html)를 설정하세요. 이
            설정은 루트 URL 접근 시 반환될 파일을 지정합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
