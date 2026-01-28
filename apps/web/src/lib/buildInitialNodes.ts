import type { GlobalSubmitConfig } from '../types/submitConfig.types'

import { useCallback } from 'react'

import { useAwsDiagramLogic } from '@/hooks/diagram/useDiagramLogic'
import type { Edge, Node } from '@xyflow/react'

export function useBuildDefaultNodes(
  nodes: Node[],
  defaultConfigs: GlobalSubmitConfig,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  _setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
) {
  const { addAwsResource } = useAwsDiagramLogic(nodes, setNodes, _setEdges)

  // useCallback으로 감싸서 함수 재생성 방지
  const buildInitialNodes = useCallback(
    (configs: GlobalSubmitConfig) => {
      if (configs) {
        // 리전이 부모인 노드 생성
        if (configs.cloudFront) {
          for (const item of configs.cloudFront) {
            addAwsResource(item.data)
          }
        }
        if (configs.s3) {
          for (const item of configs.s3) {
            addAwsResource(item.data)
          }
        }
        // VPC가 부모인 노드 생성
        // 서브넷이 부모인 노드 생성
      }
    },
    [addAwsResource],
  )
  return { buildInitialNodes }
}
