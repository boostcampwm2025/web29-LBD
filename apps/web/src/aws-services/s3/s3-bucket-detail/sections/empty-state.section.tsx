import { Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateSectionProps {
  onUpload: () => void
}

export const EmptyStateSection = ({ onUpload }: EmptyStateSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-muted-foreground mb-6 text-center">
        <h3 className="mb-2 text-lg font-semibold">객체가 없습니다</h3>
        <p className="text-sm">파일을 업로드하여 시작하세요.</p>
      </div>
      <Button onClick={onUpload}>
        <Upload className="mr-2 h-4 w-4" />
        업로드
      </Button>
    </div>
  )
}
