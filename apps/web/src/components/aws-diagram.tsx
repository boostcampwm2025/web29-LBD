'use client'

import { awsNodeTypes } from './diagram'
import type {
  AwsGroupNodeData,
  AwsResourceNodeData,
  AwsServiceNodeData,
} from './diagram'

import {
  Background,
  type Edge,
  type Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

type AwsNode = Node<AwsServiceNodeData | AwsResourceNodeData | AwsGroupNodeData>

const initialNodes: AwsNode[] = [
  {
    id: 'vpc',
    type: 'awsGroup',
    position: { x: 0, y: 100 },
    data: {
      label: 'VPC (10.0.0.0/16)',
      icon: 'vpcGroup',
      borderColor: 'blue',
      bgColor: 'blue',
      width: 400,
      height: 200,
    },
  },
  {
    id: 'internet',
    type: 'awsResource',
    position: { x: 140, y: 0 },
    data: {
      label: 'Internet',
      icon: 'internet',
    },
  },
  {
    id: 'ec2',
    type: 'awsService',
    position: { x: 120, y: 70 },
    data: {
      label: 'EC2 Instance',
      icon: 'ec2',
      description: 'Web Server',
    },
    parentId: 'vpc',
    extent: 'parent' as const,
  },
]

const initialEdges: Edge[] = [
  {
    id: 'internet-ec2',
    source: 'internet',
    target: 'ec2',
    type: 'default',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    label: 'HTTP/HTTPS',
    labelStyle: { fill: '#10b981', fontWeight: 700, fontSize: 12 },
    markerEnd: {
      type: 'arrowclosed',
      color: '#10b981',
      width: 20,
      height: 20,
    },
  },
]

export default function AwsDiagram() {
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  return (
    <div className="h-[500px] w-full rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={awsNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnDrag={false}
      >
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
