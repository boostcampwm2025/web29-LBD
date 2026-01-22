'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import S3BucketDetail from '@/components/aws-services/s3/s3-bucket-detail/s3-bucket-detail'
import type {
  S3BucketDetailConfig,
  S3DetailFormData,
} from '@/types/aws-services/s3/bucket-detail'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface S3BucketDetailRendererProps {
  config: Record<string, boolean>
}

const defaultValues: S3DetailFormData = {
  searchQuery: '',
  selectedObjects: [],
  currentPath: '/',
  objects: [],
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

export function S3BucketDetailRenderer({
  config,
}: S3BucketDetailRendererProps) {
  const { control, setValue } = useForm<S3DetailFormData>({ defaultValues })
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  const handleUpload = () => {
    // Upload navigation handled by parent or router
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <S3BucketDetail
          control={control}
          config={config as S3BucketDetailConfig}
          setValue={setValue}
          onUpload={handleUpload}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
