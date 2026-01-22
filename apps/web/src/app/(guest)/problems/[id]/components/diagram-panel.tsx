'use client'

import { FeedbackDetailCard } from '../../components/feedback-detail-card'

import { awsNodeTypes } from '@/components/diagram'
import { Button } from '@/components/ui/button'
import { useProblemForm } from '@/contexts/problem-form-context'
import type { S3BucketFormData } from '@/types/aws-services/s3/bucket-create'
import type { DiagramData } from '@/types/diagram'
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
  const { watch, feedback, isSubmitting, submitProblem } =
    useProblemForm<S3BucketFormData>()
  const formData = watch()

  const [nodes, , onNodesChange] = useNodesState(diagramData.nodes)
  const [edges, , onEdgesChange] = useEdgesState(diagramData.edges)

  // formData 변경 시 노드 업데이트 로직 (향후 구현)
  void formData

  return (
    <div className="relative h-full">
      <div className="sticky top-24 space-y-4">
        <Button
          className="ml-auto block"
          onClick={submitProblem}
          disabled={isSubmitting}
        >
          {isSubmitting ? '제출 중...' : '제출하기'}
        </Button>

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

        <FeedbackDetailCard feedback={feedback} />
      </div>
    </div>
  )
}
