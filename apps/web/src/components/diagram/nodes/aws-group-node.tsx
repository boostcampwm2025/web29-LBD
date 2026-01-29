'use client'

import { AWS_GROUP_ICONS, type AwsGroupIconKey } from '../aws-icons'

import Image from 'next/image'

import { Handle, Position } from '@xyflow/react'

export interface AwsGroupNodeData {
  label: string
  icon: AwsGroupIconKey
  borderColor?: string
  bgColor?: string
  width?: number
  height?: number
  [key: string]: unknown
}

interface AwsGroupNodeProps {
  data: AwsGroupNodeData
}

const borderColorMap: Record<string, string> = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  orange: 'border-orange-500',
  purple: 'border-purple-500',
  gray: 'border-gray-500',
  red: 'border-red-500',
}

const bgColorMap: Record<string, string> = {
  blue: 'bg-blue-50/50',
  green: 'bg-green-50/50',
  orange: 'bg-orange-50/50',
  purple: 'bg-purple-50/50',
  gray: 'bg-gray-50/50',
  red: 'bg-red-50/30',
}

export function AwsGroupNode({ data }: AwsGroupNodeProps) {
  const iconPath = AWS_GROUP_ICONS[data.icon]
  const borderColor =
    borderColorMap[data.borderColor ?? 'blue'] ?? 'border-blue-500'
  const bgColor = bgColorMap[data.bgColor ?? 'blue'] ?? 'bg-blue-50/50'
  const width = data.width ?? 400
  const height = data.height ?? 200

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`rounded-lg border-2 border-dashed ${borderColor} ${bgColor} p-4`}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="flex items-center gap-2">
        {iconPath && (
          <Image
            src={iconPath}
            alt={data.label}
            width={24}
            height={24}
            className="h-6 w-6"
          />
        )}
        <span className="text-sm font-semibold text-gray-700">
          {data.label}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
    </div>
  )
}
