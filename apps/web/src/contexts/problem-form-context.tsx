'use client'

import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
  useForm,
} from 'react-hook-form'

import { LAYOUT_CONFIG, useAwsDiagramLogic } from '@/hooks/diagram'
import type { FeedbackDetail } from '@/types/feedback.type'
import type {
  GlobalSubmitConfig,
  ServiceConfig,
  ServiceConfigItem,
  ServiceType,
} from '@/types/submitConfig.types'
import type { Edge, Node } from '@xyflow/react'

interface ProblemFormContextValue<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
  feedback: FeedbackDetail[]
  isSubmitting: boolean
  submitProblem: () => Promise<void>

  // 리소스 구성 관련
  submitConfig: GlobalSubmitConfig
  handleAddItem: (type: ServiceType, data: ServiceConfig) => void
  handleRemoveItem: (type: ServiceType, id: string) => void

  // 다이어그램 관련
  nodes: Node[]
  edges: Edge[]
  setNodes: Dispatch<SetStateAction<Node[]>>
  setEdges: Dispatch<SetStateAction<Edge[]>>
}

const ProblemFormContext = createContext<ProblemFormContextValue | null>(null)

interface ProblemFormProviderProps<
  T extends FieldValues,
> extends PropsWithChildren {
  defaultValues: DefaultValues<T>
  problemId: string
  initialFeedback?: FeedbackDetail[]
  initialNodes?: Node[]
  initialEdges?: Edge[]
}

// 기본 aws-cloud 루트 노드
const DEFAULT_ROOT_NODE: Node = {
  id: LAYOUT_CONFIG.ROOT_ID,
  type: 'awsGroup',
  position: { x: 0, y: 0 },
  width: 1000,
  height: 800,
  data: {
    type: 'cloud',
    label: 'AWS Cloud',
    icon: 'awsCloud',
    width: 1000,
    height: 800,
  },
}

export function ProblemFormProvider<T extends FieldValues>({
  children,
  defaultValues,
  problemId,
  initialFeedback = [],
  initialNodes = [DEFAULT_ROOT_NODE],
  initialEdges = [],
}: ProblemFormProviderProps<T>) {
  const methods = useForm<T>({ defaultValues })
  const {
    formState: { isSubmitting },
  } = methods
  const [feedback, setFeedback] = useState<FeedbackDetail[]>(initialFeedback)

  // 리소스 구성 상태
  const [submitConfig, setSubmitConfig] = useState<GlobalSubmitConfig>({})

  // 다이어그램 상태
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  // 다이어그램 로직 훅
  const { addAwsResource } = useAwsDiagramLogic(nodes, setNodes, setEdges)

  // 리소스 추가 핸들러
  const handleAddItem = useCallback(
    (type: ServiceType, data: ServiceConfig) => {
      const id = data.name || `${type}-${Date.now()}`

      // 중복 체크
      const existingItems = submitConfig[type] || []
      if (existingItems.some((item) => item.id === id)) {
        alert(`이미 "${id}" 이름의 리소스가 존재합니다.`)
        return
      }

      const newItem: ServiceConfigItem<ServiceConfig> = {
        id,
        data: { ...data, id },
        isReady: true,
      }

      setSubmitConfig((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), newItem],
      }))

      // 다이어그램에 노드 추가
      addAwsResource({
        ...data,
        type,
        name: id,
        region: data._type === 's3' ? data.region : 'us-east-1',
      })
    },
    [submitConfig, addAwsResource],
  )

  // 리소스 삭제 핸들러
  const handleRemoveItem = useCallback((type: ServiceType, id: string) => {
    setSubmitConfig((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((item) => item.id !== id),
    }))

    // 다이어그램에서 노드 제거
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))
  }, [])

  // 제출 핸들러
  const submitProblem = useCallback(async () => {
    const finalConfig = {
      submitConfig: Object.fromEntries(
        Object.entries(submitConfig).map(([serviceKey, items]) => [
          serviceKey,
          (items || []).map((item: ServiceConfigItem<ServiceConfig>) => {
            const { _type, ...rest } = item.data
            return {
              ...rest,
              id: item.data.name,
            }
          }),
        ]),
      ),
    }

    // TODO: 실제 API 호출로 교체
    console.log('Submitting config:', finalConfig)
    void problemId

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: 기존 feedback 유지 (실제로는 API 응답으로 교체)
    setFeedback(initialFeedback)
  }, [problemId, initialFeedback, submitConfig])

  const contextValue = useMemo(
    () => ({
      form: methods,
      feedback,
      isSubmitting,
      submitProblem,
      submitConfig,
      handleAddItem,
      handleRemoveItem,
      nodes,
      edges,
      setNodes,
      setEdges,
    }),
    [
      methods,
      feedback,
      isSubmitting,
      submitProblem,
      submitConfig,
      handleAddItem,
      handleRemoveItem,
      nodes,
      edges,
    ],
  )

  return (
    <ProblemFormContext.Provider
      value={contextValue as ProblemFormContextValue}
    >
      {children}
    </ProblemFormContext.Provider>
  )
}

export function useProblemForm<T extends FieldValues = FieldValues>() {
  const context = useContext(ProblemFormContext)
  if (!context) {
    throw new Error('useProblemForm must be used within ProblemFormProvider')
  }
  return context as ProblemFormContextValue<T>
}
