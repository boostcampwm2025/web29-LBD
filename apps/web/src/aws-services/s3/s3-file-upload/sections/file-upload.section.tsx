import type { S3UploadWithSetValueSectionProps, UploadFile } from '../types'
import { File, X } from 'lucide-react'

import { useWatch } from 'react-hook-form'

import { SectionContainer } from '@/components/section-container'
import { Button } from '@/components/ui/button'

export const FileUploadSection = ({
  control,
  config,
  setValue,
}: S3UploadWithSetValueSectionProps) => {
  const files = useWatch({ control, name: 'files' })

  if (!config.fileUpload) return null

  const handleRemoveFile = (fileId: string) => {
    setValue(
      'files',
      files.filter((file: UploadFile) => file.id !== fileId),
    )
  }

  return (
    <SectionContainer
      title="파일 및 폴더"
      description="업로드할 파일과 폴더를 추가하세요"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">선택된 파일 ({files.length})</p>
          <div className="space-y-2">
            {files.map((file: UploadFile) => (
              <div
                key={file.id}
                className="bg-muted/50 flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <File className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-muted-foreground text-xs">{file.size}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
