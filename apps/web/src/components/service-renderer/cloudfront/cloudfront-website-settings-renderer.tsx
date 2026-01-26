'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import CloudFrontWebsiteSettings from '@/components/aws-services/cloudfront/cloudfront-website-settings/cloudfront-website-settings'
import type {
  CloudFrontWebsiteFormData,
  CloudFrontWebsiteSettingsConfig,
} from '@/types/aws-services/cloudfront/website-settings'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface CloudFrontWebsiteSettingsRendererProps {
  config: Record<string, boolean>
}

const defaultValues: CloudFrontWebsiteFormData = {
  defaultRootObject: 'index.html',
  errorResponses: [],
  loggingEnabled: false,
  loggingBucket: '',
  logPrefix: '',
  wafEnabled: false,
  webAclId: '',
}

const initialNodes: AwsNode[] = [
  {
    id: 'cloudfront',
    type: 'awsService',
    position: { x: 100, y: 100 },
    data: { label: 'CloudFront Website', icon: 'cloudfront' },
  },
]

const initialEdges: Edge[] = []

export function CloudFrontWebsiteSettingsRenderer({
  config,
}: CloudFrontWebsiteSettingsRendererProps) {
  const { control, setValue } = useForm<CloudFrontWebsiteFormData>({
    defaultValues,
  })
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <CloudFrontWebsiteSettings
          control={control}
          config={config as CloudFrontWebsiteSettingsConfig}
          setValue={setValue}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
