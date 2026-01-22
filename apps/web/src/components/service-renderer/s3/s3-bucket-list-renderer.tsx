'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import S3BucketList from '@/components/aws-services/s3/s3-bucket-list/s3-bucket-list'
import type {
  S3BucketListConfig,
  S3ListFormData,
} from '@/types/aws-services/s3/bucket-list'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface S3BucketListRendererProps {
  config: Record<string, boolean>
}

const defaultValues: S3ListFormData = {
  searchQuery: '',
  selectedBuckets: [],
  buckets: [],
}

const initialNodes: AwsNode[] = [
  {
    id: 's3-service',
    type: 'awsService',
    position: { x: 100, y: 100 },
    data: { label: 'Amazon S3', icon: 's3' },
  },
]

const initialEdges: Edge[] = []

export function S3BucketListRenderer({ config }: S3BucketListRendererProps) {
  const { control, setValue } = useForm<S3ListFormData>({ defaultValues })
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  const handleCreateBucket = () => {
    // Navigation handled by parent or router
  }

  const handleBucketClick = (_bucketName: string) => {
    // Navigation handled by parent or router
  }

  const handleRefresh = () => {
    // Refresh logic
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <S3BucketList
          control={control}
          config={config as S3BucketListConfig}
          setValue={setValue}
          onCreateBucket={handleCreateBucket}
          onBucketClick={handleBucketClick}
          onRefresh={handleRefresh}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
