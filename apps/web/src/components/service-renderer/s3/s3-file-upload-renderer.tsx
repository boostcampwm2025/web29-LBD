'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import S3FileUpload from '@/components/aws-services/s3/s3-file-upload/s3-file-upload'
import type {
  S3FileUploadConfig,
  S3UploadFormData,
} from '@/types/aws-services/s3/file-upload'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface S3FileUploadRendererProps {
  config: Record<string, boolean>
}

const defaultValues: S3UploadFormData = {
  files: [],
  bucketName: '',
  permission: 'private',
  storageClass: 'standard',
}

const initialNodes: AwsNode[] = [
  {
    id: 's3-bucket',
    type: 'awsService',
    position: { x: 100, y: 100 },
    data: { label: 'S3 Bucket', icon: 's3' },
  },
]

const initialEdges: Edge[] = []

export function S3FileUploadRenderer({ config }: S3FileUploadRendererProps) {
  const { control, setValue } = useForm<S3UploadFormData>({ defaultValues })
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  const handlePrev = () => {
    // Navigation handled by parent or router
  }

  const handleNext = () => {
    // Navigation/submission handled by parent or router
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <S3FileUpload
          control={control}
          config={config as S3FileUploadConfig}
          setValue={setValue}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
