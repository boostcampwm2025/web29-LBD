import { useWatch } from 'react-hook-form'

import type { S3UploadSectionProps } from '@/types/aws-services/s3/file-upload'

export const HeaderSection = ({ control, config }: S3UploadSectionProps) => {
  const bucketName = useWatch({ control, name: 'bucketName' })

  if (!config.header) return null

  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold">업로드</h2>
      <p className="text-muted-foreground">
        파일 및 폴더를 {bucketName}에 업로드하세요
      </p>
    </div>
  )
}
