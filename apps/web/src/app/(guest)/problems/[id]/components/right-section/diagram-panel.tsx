'use client'

import { useCallback } from 'react'

import { useProblemForm } from '@/contexts/problem-form-context'
import { awsNodeTypes } from '@/types/node.type'
import {
  Background,
  type NodeChange,
  ReactFlow,
  applyNodeChanges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export function DiagramPanel() {
  const { nodes, edges, setNodes } = useProblemForm()

  // 노드 변경 핸들러 (드래그, 선택 등)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes],
  )

  return (
    <div className="h-[400px] rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={awsNodeTypes}
        onNodesChange={onNodesChange}
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
        <Background />
      </ReactFlow>
    </div>
  )
}
