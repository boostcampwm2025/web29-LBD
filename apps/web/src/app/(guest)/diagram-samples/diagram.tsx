'use client'

import type {
  AwsGroupNodeData,
  AwsResourceNodeData,
  AwsServiceNodeData,
} from '@/components/diagram'
import { awsNodeTypes } from '@/types/node.type'
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
  // AWS Cloud Group
  {
    id: 'aws-cloud',
    type: 'awsGroup',
    position: { x: 0, y: 0 },
    data: {
      label: 'AWS Cloud',
      icon: 'awsCloud',
      borderColor: 'gray',
      bgColor: 'gray',
      width: 700,
      height: 350,
    },
  },
  // Region Group (nested inside AWS Cloud)
  {
    id: 'region',
    type: 'awsGroup',
    position: { x: 20, y: 50 },
    data: {
      label: 'ap-northeast-2 (Seoul)',
      icon: 'region',
      borderColor: 'blue',
      bgColor: 'blue',
      width: 660,
      height: 280,
    },
    parentId: 'aws-cloud',
    extent: 'parent' as const,
  },
  // Users (outside AWS Cloud)
  {
    id: 'users',
    type: 'awsResource',
    position: { x: 300, y: 420 },
    data: {
      label: 'Users',
      icon: 'users',
    },
  },
  // Route53
  {
    id: 'route53',
    type: 'awsService',
    position: { x: 30, y: 100 },
    data: {
      label: 'Route 53',
      icon: 'route53',
      description: 'DNS',
    },
    parentId: 'region',
    extent: 'parent' as const,
  },
  // ACM
  {
    id: 'acm',
    type: 'awsService',
    position: { x: 30, y: 200 },
    data: {
      label: 'ACM',
      icon: 'acm',
      description: 'SSL/TLS',
    },
    parentId: 'region',
    extent: 'parent' as const,
  },
  // CloudFront
  {
    id: 'cloudfront',
    type: 'awsService',
    position: { x: 250, y: 100 },
    data: {
      label: 'CloudFront',
      icon: 'cloudfront',
      description: 'CDN',
    },
    parentId: 'region',
    extent: 'parent' as const,
  },
  // WAF
  {
    id: 'waf',
    type: 'awsService',
    position: { x: 250, y: 200 },
    data: {
      label: 'WAF',
      icon: 'waf',
      description: 'Firewall',
    },
    parentId: 'region',
    extent: 'parent' as const,
  },
  // S3
  {
    id: 's3',
    type: 'awsService',
    position: { x: 470, y: 50 },
    data: {
      label: 'S3',
      icon: 's3',
      description: 'Storage',
    },
    parentId: 'region',
    extent: 'parent' as const,
  },
  // S3 Bucket
  {
    id: 's3-bucket',
    type: 'awsResource',
    position: { x: 470, y: 180 },
    data: {
      label: 'Static Assets',
      icon: 's3Bucket',
    },
    parentId: 'region',
    extent: 'parent' as const,
  },
]

const initialEdges: Edge[] = [
  // Users -> Route53
  {
    id: 'users-route53',
    source: 'users',
    target: 'route53',
    type: 'default',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: 'DNS Query',
    labelStyle: { fill: '#10b981', fontWeight: 600, fontSize: 11 },
    markerEnd: {
      type: 'arrowclosed',
      color: '#10b981',
      width: 16,
      height: 16,
    },
  },
  // Route53 -> CloudFront
  {
    id: 'route53-cloudfront',
    source: 'route53',
    target: 'cloudfront',
    type: 'default',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: {
      type: 'arrowclosed',
      color: '#10b981',
      width: 16,
      height: 16,
    },
  },
  // CloudFront -> S3
  {
    id: 'cloudfront-s3',
    source: 'cloudfront',
    target: 's3',
    type: 'default',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: 'Origin Fetch',
    labelStyle: { fill: '#10b981', fontWeight: 600, fontSize: 11 },
    markerEnd: {
      type: 'arrowclosed',
      color: '#10b981',
      width: 16,
      height: 16,
    },
  },
  // S3 -> S3 Bucket (dashed - configuration)
  {
    id: 's3-bucket-link',
    source: 's3',
    target: 's3-bucket',
    type: 'default',
    style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5,5' },
  },
  // ACM -> Route53 (dashed - certificate validation)
  {
    id: 'acm-route53',
    source: 'acm',
    target: 'route53',
    type: 'default',
    style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5,5' },
    label: 'DNS Validation',
    labelStyle: { fill: '#6b7280', fontWeight: 500, fontSize: 10 },
  },
  // ACM -> CloudFront (dashed - certificate)
  {
    id: 'acm-cloudfront',
    source: 'acm',
    target: 'cloudfront',
    type: 'default',
    style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5,5' },
    label: 'SSL Cert',
    labelStyle: { fill: '#6b7280', fontWeight: 500, fontSize: 10 },
  },
  // WAF -> CloudFront (dashed - protection)
  {
    id: 'waf-cloudfront',
    source: 'waf',
    target: 'cloudfront',
    type: 'default',
    style: { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '5,5' },
    label: 'Protection',
    labelStyle: { fill: '#6b7280', fontWeight: 500, fontSize: 10 },
  },
]

export default function S3CloudFrontDiagram() {
  const [nodes] = useNodesState<AwsNode>(initialNodes)
  const [edges] = useEdgesState<Edge>(initialEdges)

  return (
    <div className="h-[600px] w-full rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={awsNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
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
