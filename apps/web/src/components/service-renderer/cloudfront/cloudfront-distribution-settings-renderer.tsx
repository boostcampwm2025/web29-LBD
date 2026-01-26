'use client'

import { useForm } from 'react-hook-form'

import AwsDiagram, { type AwsNode } from '@/components/aws-diagram'
import CloudFrontDistributionSettings from '@/components/aws-services/cloudfront/cloudfront-distribution-settings/cloudfront-distribution-settings'
import type {
  CloudFrontDistributionSettingsConfig,
  CloudFrontDistributionSettingsFormData,
} from '@/types/aws-services/cloudfront/distribution-settings'
import { type Edge, useEdgesState, useNodesState } from '@xyflow/react'

interface CloudFrontDistributionSettingsRendererProps {
  config: Record<string, boolean>
}

const defaultValues: CloudFrontDistributionSettingsFormData = {
  distributionName: '',
  description: '',
  enabled: true,
  priceClass: 'all',
  cnames: [],
  sslCertificate: 'cloudfront',
  acmCertificateArn: '',
  minTlsVersion: 'TLSv1.2_2021',
  ipv6Enabled: true,
}

const initialNodes: AwsNode[] = [
  {
    id: 'cloudfront',
    type: 'awsService',
    position: { x: 100, y: 100 },
    data: { label: 'CloudFront Distribution', icon: 'cloudfront' },
  },
]

const initialEdges: Edge[] = []

export function CloudFrontDistributionSettingsRenderer({
  config,
}: CloudFrontDistributionSettingsRendererProps) {
  const { control, setValue } = useForm<CloudFrontDistributionSettingsFormData>(
    {
      defaultValues,
    },
  )
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <CloudFrontDistributionSettings
          control={control}
          config={config as CloudFrontDistributionSettingsConfig}
          setValue={setValue}
        />
      </div>
      <div className="w-1/3">
        <AwsDiagram nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}
