import { recalculateTree } from './nodesBuilding'
import {
  GLOBAL_SERVICE_TYPES,
  LAYOUT_CONFIG,
  REGION_CHILDS_TYPES,
  getIcons,
  getNodeConfig,
} from './types'

import { useCallback } from 'react'

import type { ServiceConfig } from '@/types/submitConfig.types'
import type { Edge, Node } from '@xyflow/react'

// TODO: ServiceConfig, ServiceType에 vpc, subnet 등도 추가 필요. 지금 타입 경고
export function useAwsDiagramLogic(
  _nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  _setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
) {
  const nodeExists = useCallback((id: string, currentNodes: Node[]) => {
    return currentNodes.some((n) => n.id === id)
  }, [])

  const ensureHierarchy = useCallback(
    (
      payload: ServiceConfig,
      currentNodes: Node[],
    ): { nodes: Node[]; parentId: string | undefined } => {
      const newNodes = [...currentNodes]
      let parentId: string | undefined = undefined

      // Global Service
      // 만약 글로벌 서비스면 만약에 글로벌 네트워크가 아직 생성이 안되었다면 생성
      if (GLOBAL_SERVICE_TYPES.includes(payload._type)) {
        if (!nodeExists(LAYOUT_CONFIG.GLOBAL_ID, newNodes)) {
          newNodes.push({
            id: LAYOUT_CONFIG.GLOBAL_ID,
            type: 'awsGroup',
            parentId: LAYOUT_CONFIG.ROOT_ID,
            extent: 'parent',
            width: 800,
            height: 600,
            position: { x: 50, y: 50 },
            measured: { width: 800, height: 600 },
            data: {
              type: 'global',
              label: 'Global Services',
              icon: 'global',
              width: 800,
              height: 600,
              border: '2px dashed #ccc',
            },
          })
        }
        parentId = LAYOUT_CONFIG.GLOBAL_ID
      }
      // Regional / VPC / Subnet
      else {
        // region은 나중에 전역 상태로 관리해서 리전을 따로 받지 않는 그런 타입에 관해서는 현재 리전을 바로 적용해도 될듯.
        const region = 'region' in payload ? payload.region : 'us-east-1'
        const regionId = `region-${region}`

        // 1. Region Node 자동 생성
        // 만약 추가된 서비스가 region의 바로 아래 붙는 타입이라면 region 노드가 있는지 확인하고, 없으면 생성
        if (
          !nodeExists(regionId, newNodes) &&
          REGION_CHILDS_TYPES.includes(payload._type)
        ) {
          newNodes.push({
            id: regionId,
            type: 'awsGroup',
            parentId: LAYOUT_CONFIG.ROOT_ID,
            extent: 'parent',
            width: 800,
            height: 600,
            measured: { width: 800, height: 600 },
            position: { x: 300, y: 50 },
            data: {
              type: 'region',
              label: region,
              icon: 'region',
              width: 800,
              height: 600,
              borderColor: 'gray',
              bgColor: 'blue',
            },
          })
        }

        // 2. 부모 결정 로직
        if (payload._type === 'vpc') {
          parentId = regionId
        } else if (payload._type === 's3' || payload._type === 'rds') {
          // S3 등은 리전 바로 아래
          parentId = regionId
        } else if (payload._type === 'subnet') {
          // Subnet은 VPC 아래 (VPC ID 체크)
          if (!('vpcId' in payload)) {
            throw new Error('Subnet payload must include vpcId.')
          }
          if (!payload.vpcId || !nodeExists(payload.vpcId, newNodes)) {
            throw new Error(`VPC '${payload.vpcId}' not found for Subnet.`)
          }
          parentId = payload.vpcId
        } else {
          // EC2, ASG 등은 Subnet 아래 (Subnet ID 체크)
          // (타입 가드 덕분에 payload.subnetId 접근 안전)
          if ('subnetId' in payload && typeof payload.subnetId === 'string') {
            if (!payload.subnetId || !nodeExists(payload.subnetId, newNodes)) {
              throw new Error(`Subnet '${payload.subnetId}' not found.`)
            }
            parentId = payload.subnetId
          }
        }
      }

      return { nodes: newNodes, parentId }
    },
    [nodeExists],
  )

  const handleChildStealing = useCallback(
    (
      targetNode: Node,
      payload: ServiceConfig,
      currentNodes: Node[],
    ): Node[] => {
      let updatedNodes = [...currentNodes]

      if ('groupId' in payload && payload.groupId) {
        if (nodeExists(payload.groupId as string, updatedNodes)) {
          targetNode.parentId = payload.groupId as string
          targetNode.extent = 'parent'
          targetNode.position = { x: 20, y: 20 }
        } else {
          console.warn(
            `Group ID ${payload.groupId} not found. Staying in Subnet.`,
          )
        }
      }

      // 일단 타겟 노드 추가
      updatedNodes.push(targetNode)

      if (
        'memberIds' in payload &&
        payload.memberIds &&
        (payload.memberIds as string[]).length > 0
      ) {
        updatedNodes = updatedNodes.map((n) => {
          if ((payload.memberIds as string[])?.includes(n.id)) {
            return {
              ...n,
              parentId: targetNode.id,
              extent: 'parent',
              position: { x: 20, y: 20 + Math.random() * 20 }, // 겹치지 않게 살짝 랜덤
            }
          }
          return n
        })
      }

      return updatedNodes
    },
    [nodeExists],
  )

  const addAwsResource = useCallback(
    (payload: ServiceConfig) => {
      setNodes((prevNodes) => {
        try {
          // 1. 부모 계층 확인 및 생성
          const { nodes: nodesWithHierarchy, parentId } = ensureHierarchy(
            payload,
            prevNodes,
          )

          // 다이어그램에 필요없는 것들은 넘어감.
          if (payload._type === 'routeTable') {
            return prevNodes
          }
          if (payload._type === 'internetGateway' && !payload.vpcId) {
            return prevNodes
          }

          // 2. 새 노드 생성
          const nodeConfig = getNodeConfig(payload._type)

          const newNode: Node = {
            id: payload.name,
            type: nodeConfig.nodeType,
            parentId: parentId,
            extent: 'parent',
            position: { x: LAYOUT_CONFIG.PADDING, y: LAYOUT_CONFIG.PADDING },
            data: {
              type: payload._type,
              label: payload.name,
              icon: getIcons(payload._type),
              width: nodeConfig.width,
              height: nodeConfig.height,
              ...(nodeConfig.borderColor && {
                borderColor: nodeConfig.borderColor,
              }),
              ...(nodeConfig.bgColor && { bgColor: nodeConfig.bgColor }),
            },
          }

          // 3. 자식 뺏기 실행 + 노드 추가
          const finalNodes = handleChildStealing(
            newNode,
            payload,
            nodesWithHierarchy,
          )

          return recalculateTree(finalNodes)
        } catch (error) {
          console.error('Failed to add resource:', error)
          alert(error instanceof Error ? error.message : '리소스 추가 실패')
          return prevNodes
        }
      })
    },
    [ensureHierarchy, handleChildStealing, setNodes],
  )

  return { addAwsResource }
}
