'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import CloudFrontDistributionList from '@/components/aws-services/cloudfront/cloudfront-distribution-list/cloudfront-distribution-list'
import type {
  CloudFrontDistributionListConfig,
  CloudFrontListFormData,
} from '@/types/aws-services/cloudfront/distribution-list'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface CloudFrontDistributionListRendererProps {
  config: Record<string, boolean>
}

const defaultValues: CloudFrontListFormData = {
  searchQuery: '',
  selectedDistributions: [],
}

const initialNodes: AwsNode[] = [
  {
    id: 'cloudfront',
    type: 'awsService',
    position: { x: 100, y: 100 },
    data: { label: 'CloudFront', icon: 'cloudfront' },
  },
]

const initialEdges: Edge[] = []

export function CloudFrontDistributionListRenderer({
  config,
}: CloudFrontDistributionListRendererProps) {
  const { control, setValue } = useForm<CloudFrontListFormData>({
    defaultValues,
  })
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  const handleNext = () => {
    // Navigation handled by parent or router
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <CloudFrontDistributionList
          control={control}
          config={config as CloudFrontDistributionListConfig}
          setValue={setValue}
          onNext={handleNext}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
