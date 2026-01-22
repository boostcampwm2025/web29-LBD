'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import S3BucketCreate from '@/components/aws-services/s3/s3-bucket-create/s3-bucket-create'
import type {
  S3BucketCreateConfig,
  S3BucketFormData,
} from '@/types/aws-services/s3/bucket-create'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface S3BucketCreateRendererProps {
  config: Record<string, boolean>
  children: React.ReactNode
}

const defaultValues: S3BucketFormData = {
  general: { bucketName: '', region: 'ap-northeast-2' },
  ownership: { aclEnabled: 'disabled' },
  blockPublicAccess: {
    blockAll: true,
    blockPublicAcls: true,
    ignorePublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
  },
  versioning: { enabled: false },
  encryption: { type: 'sse-s3' },
  advancedSettings: { objectLockEnabled: false },
  tags: [],
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

export function S3BucketCreateRenderer({
  config,
  children,
}: S3BucketCreateRendererProps) {
  const { control, setValue, watch } = useForm<S3BucketFormData>({
    defaultValues,
  })
  const [nodes, setNodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  // Form → Diagram 동기화
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'general.bucketName') {
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === 's3-bucket'
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    label: value.general?.bucketName || 'S3 Bucket',
                  },
                }
              : node,
          ),
        )
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setNodes])

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <S3BucketCreate
          control={control}
          config={config as S3BucketCreateConfig}
          setValue={setValue}
        />
      </div>
      <div className="w-1/3">
        {children}
        {/* <AwsDiagram nodes={nodes} edges={edges} /> */}
      </div>
    </div>
  )
}
