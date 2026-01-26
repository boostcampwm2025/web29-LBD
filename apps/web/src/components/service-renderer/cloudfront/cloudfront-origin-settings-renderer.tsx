'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import CloudFrontOriginSettings from '@/components/aws-services/cloudfront/cloudfront-origin-settings/cloudfront-origin-settings'
import type {
  CloudFrontOriginFormData,
  CloudFrontOriginSettingsConfig,
} from '@/types/aws-services/cloudfront/origin-settings'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface CloudFrontOriginSettingsRendererProps {
  config: Record<string, boolean>
}

const defaultValues: CloudFrontOriginFormData = {
  originType: 's3',
  selectedBucket: '',
  customDomain: '',
  originPath: '',
  accessControl: 'oac',
  oacName: '',
  customHeaders: [],
}

const initialNodes: AwsNode[] = [
  {
    id: 'cloudfront',
    type: 'awsService',
    position: { x: 200, y: 100 },
    data: { label: 'CloudFront', icon: 'cloudfront' },
  },
  {
    id: 's3-origin',
    type: 'awsService',
    position: { x: 100, y: 200 },
    data: { label: 'S3 Origin', icon: 's3' },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'cloudfront-s3',
    source: 'cloudfront',
    target: 's3-origin',
    type: 'default',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
  },
]

export function CloudFrontOriginSettingsRenderer({
  config,
}: CloudFrontOriginSettingsRendererProps) {
  const { control, setValue } = useForm<CloudFrontOriginFormData>({
    defaultValues,
  })
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <CloudFrontOriginSettings
          control={control}
          config={config as CloudFrontOriginSettingsConfig}
          setValue={setValue}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
