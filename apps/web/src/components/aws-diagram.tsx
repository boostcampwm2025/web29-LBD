'use client'

import type {
  AwsGroupNodeData,
  AwsResourceNodeData,
  AwsServiceNodeData,
} from './diagram'

import { awsNodeTypes } from '@/types/node.type'
import {
  Background,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export type AwsNode = Node<
  AwsServiceNodeData | AwsResourceNodeData | AwsGroupNodeData
>

interface AwsDiagramProps {
  nodes?: AwsNode[] | Node[]
  edges?: Edge[]
}

export default function AwsDiagram({
  nodes = [],
  edges = [],
}: AwsDiagramProps) {
  return (
    <div className="relative h-full w-full rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={awsNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        zoomOnScroll={true}
        panOnDrag={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={12} size={1} />
        <Controls position="bottom-left" />
      </ReactFlow>
    </div>
  )
}
