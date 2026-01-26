'use client'

import { useProblemForm } from '@/contexts/problem-form-context'
import type { S3BucketFormData } from '@/types/aws-services/s3/bucket-create'
import type { DiagramData } from '@/types/diagram.type'
import { awsNodeTypes } from '@/types/node.type'
import {
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

interface DiagramPanelProps {
  diagramData: DiagramData
}

export function DiagramPanel({ diagramData }: DiagramPanelProps) {
  const { form } = useProblemForm<S3BucketFormData>()
  const formData = form.watch()

  const [nodes, , onNodesChange] = useNodesState(diagramData.nodes)
  const [edges, , onEdgesChange] = useEdgesState(diagramData.edges)

  // formData 변경 시 노드 업데이트 로직 (향후 구현)
  void formData

  return (
    <div className="h-[400px] rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={awsNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
      </ReactFlow>
    </div>
  )
}
