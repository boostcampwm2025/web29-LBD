'use client'

import { AWS_SERVICE_ICONS, type AwsServiceIconKey } from '../aws-icons'

import Image from 'next/image'

import { Handle, Position } from '@xyflow/react'

export interface AwsServiceNodeData {
  label: string
  icon: AwsServiceIconKey
  description?: string
  [key: string]: unknown
}

interface AwsServiceNodeProps {
  data: AwsServiceNodeData
}

export function AwsServiceNode({ data }: AwsServiceNodeProps) {
  const iconPath = AWS_SERVICE_ICONS[data.icon]

  return (
    <div className="flex items-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <Image
        src={iconPath}
        alt={data.label}
        width={48}
        height={48}
        className="h-12 w-12"
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800">
          {data.label}
        </span>
        {data.description && (
          <span className="text-xs text-gray-500">{data.description}</span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
    </div>
  )
}
