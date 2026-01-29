'use client'

import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
  useForm,
} from 'react-hook-form'

import ResultDialog from '@/components/result-dialog'
import { LAYOUT_CONFIG, useAwsDiagramLogic } from '@/hooks/diagram'
import useSolutionDialog from '@/hooks/useSolutionDialog'
import { useBuildDefaultNodes } from '@/lib/build-initial-nodes'
import { submitProblemSolution } from '@/lib/problem/submit-problem'
import type { FeedbackDetail } from '@/types/feedback.type'
import type { TProblemType } from '@/types/problem.type'
import type {
  FinalSubmitConfig,
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
  setSubmitConfig: Dispatch<SetStateAction<GlobalSubmitConfig>>
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
  unitId: string
  cookbookId?: string
  problemType: TProblemType
  nextUnitId?: string
  initialNodes?: Node[]
  initialEdges?: Edge[]
  initialFeedback?: FeedbackDetail[]
  defaultConfigs?: GlobalSubmitConfig
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
  unitId,
  cookbookId,
  problemType,
  nextUnitId,
  initialNodes = [DEFAULT_ROOT_NODE],
  initialFeedback = [],
  initialEdges = [],
  defaultConfigs = {},
}: ProblemFormProviderProps<T>) {
  const methods = useForm<T>({ defaultValues })
  const {
    formState: { isSubmitting },
  } = methods
  const [feedback, setFeedback] = useState<FeedbackDetail[]>(initialFeedback)
  const { status, openModal, closeModal, handleNavigation, isModalOpen } =
    useSolutionDialog()

  // 리소스 구성 상태
  const [submitConfig, setSubmitConfig] =
    useState<GlobalSubmitConfig>(defaultConfigs)

  // 다이어그램 상태
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  // 노드 초기화
  const { buildInitialNodes } = useBuildDefaultNodes(
    nodes,
    defaultConfigs,
    setNodes,
    setEdges,
  )

  const isInitialized = useRef(false)

  useEffect(() => {
    // 이미 초기화되었거나 defaultConfigs가 없으면 실행하지 않음
    if (isInitialized.current || !defaultConfigs) return

    // 초기 노드 빌드 실행
    buildInitialNodes(defaultConfigs)

    // 초기화 완료 표시
    isInitialized.current = true
  }, [])

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
        name: id,
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
    const finalConfig: FinalSubmitConfig = {
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

    try {
      const result = await submitProblemSolution(String(unitId), finalConfig)

      setFeedback(result.feedback || [])
      openModal(result.result)
    } catch (error) {
      console.error('Failed to submit problem:', error)
    }
  }, [submitConfig, openModal, unitId])
  // Navigation 핸들러 - problemType에 따라 분기
  const onNavigationConfirm = useCallback(() => {
    if (problemType === 'unit') {
      handleNavigation('unit', '')
    } else if (problemType === 'cookbook') {
      // cookbook인 경우 nextUnitId가 있으면 같은 cookbook의 다음 unit으로, 없으면 목록으로
      handleNavigation('cookbook', `${cookbookId}?unitId=${nextUnitId}`)
    }
  }, [problemType, nextUnitId, cookbookId, handleNavigation])

  const contextValue = useMemo(
    () => ({
      form: methods,
      feedback,
      isSubmitting,
      submitProblem,
      submitConfig,
      setSubmitConfig,
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
      setSubmitConfig,
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
      <ResultDialog
        isOpen={isModalOpen}
        status={status}
        onClose={closeModal}
        onConfirm={onNavigationConfirm}
      />
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
