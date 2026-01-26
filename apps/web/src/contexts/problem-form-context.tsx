'use client'

import {
  type PropsWithChildren,
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

import { FeedbackDetail } from '@/types/feedback.type'

interface ProblemFormContextValue<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
  feedback: FeedbackDetail[]
  isSubmitting: boolean
  submitProblem: () => Promise<void>
}

const ProblemFormContext = createContext<ProblemFormContextValue | null>(null)

interface ProblemFormProviderProps<
  T extends FieldValues,
> extends PropsWithChildren {
  defaultValues: DefaultValues<T>
  problemId: string
  initialFeedback?: FeedbackDetail[]
}

export function ProblemFormProvider<T extends FieldValues>({
  children,
  defaultValues,
  problemId,
  initialFeedback = [],
  // initialSubmitConfigs = [] -> 서비스 구성 정보를 관리하려면 이것도 추가해야하지 않을까요?
  // initialNodes = [] -> 노드도 관리하려면 이것도 추가해야할 것 같읍니다.
}: ProblemFormProviderProps<T>) {
  const methods = useForm<T>({ defaultValues })
  const {
    formState: { isSubmitting },
  } = methods
  const [feedback, setFeedback] = useState<FeedbackDetail[]>(initialFeedback)

  const submitProblem = useCallback(async () => {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`/api/problems/${problemId}/submit`, { ... })
    void problemId // 향후 API 호출 시 사용 예정
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // TODO: 기존 feedback 유지 (실제로는 API 응답으로 교체)
    setFeedback(initialFeedback)
  }, [problemId, initialFeedback])

  const contextValue = useMemo(
    () => ({
      form: methods,
      feedback,
      isSubmitting,
      submitProblem,
    }),
    [methods, feedback, isSubmitting, submitProblem],
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
