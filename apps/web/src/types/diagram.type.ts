import type {
  AwsGroupNodeData,
  AwsResourceNodeData,
  AwsServiceNodeData,
} from '@/components/diagram'
import type { Edge, Node } from '@xyflow/react'

export type AwsNodeData =
  | AwsServiceNodeData
  | AwsResourceNodeData
  | AwsGroupNodeData

export type AwsNode = Node<AwsNodeData>

export interface DiagramData {
  nodes: AwsNode[]
  edges: Edge[]
}
