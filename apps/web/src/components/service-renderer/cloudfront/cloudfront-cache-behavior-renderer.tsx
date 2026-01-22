'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import CloudFrontCacheBehavior from '@/components/aws-services/cloudfront/cloudfront-cache-behavior/cloudfront-cache-behavior'
import type {
  CloudFrontCacheBehaviorConfig,
  CloudFrontCacheFormData,
} from '@/types/aws-services/cloudfront/cache-behavior'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface CloudFrontCacheBehaviorRendererProps {
  config: Record<string, boolean>
}

const defaultValues: CloudFrontCacheFormData = {
  viewerProtocolPolicy: 'redirect-to-https',
  allowedMethods: 'GET_HEAD',
  cachePolicy: 'managed',
  managedPolicyName: 'CachingOptimized',
  customTTL: {
    min: '0',
    default: '86400',
    max: '31536000',
  },
  compressionEnabled: true,
  viewerRequestFunction: '',
  viewerResponseFunction: '',
}

const initialNodes: AwsNode[] = [
  {
    id: 'cloudfront',
    type: 'awsService',
    position: { x: 100, y: 100 },
    data: { label: 'CloudFront Cache', icon: 'cloudfront' },
  },
]

const initialEdges: Edge[] = []

export function CloudFrontCacheBehaviorRenderer({
  config,
}: CloudFrontCacheBehaviorRendererProps) {
  const { control, setValue } = useForm<CloudFrontCacheFormData>({
    defaultValues,
  })
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <CloudFrontCacheBehavior
          control={control}
          config={config as CloudFrontCacheBehaviorConfig}
          setValue={setValue}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
