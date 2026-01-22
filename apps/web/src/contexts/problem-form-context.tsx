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
  type Control,
  type DefaultValues,
  type FieldValues,
  type FormState,
  type UseFormGetValues,
  type UseFormSetValue,
  type UseFormWatch,
  useForm,
} from 'react-hook-form'

import type { FeedbackDetail } from '@/app/(guest)/problems/components/feedback-detail-card'

interface ProblemFormContextValue<T extends FieldValues = FieldValues> {
  control: Control<T>
  setValue: UseFormSetValue<T>
  watch: UseFormWatch<T>
  getValues: UseFormGetValues<T>
  formState: FormState<T>
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
}: ProblemFormProviderProps<T>) {
  const methods = useForm<T>({ defaultValues })
  const [feedback, setFeedback] = useState<FeedbackDetail[]>(initialFeedback)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitProblem = useCallback(async () => {
    setIsSubmitting(true)

    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`/api/problems/${problemId}/submit`, { ... })
    void problemId // 향후 API 호출 시 사용 예정
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock: 기존 feedback 유지 (실제로는 API 응답으로 교체)
    setFeedback(initialFeedback)

    setIsSubmitting(false)
  }, [problemId, initialFeedback])

  const contextValue = useMemo(
    () => ({
      control: methods.control,
      setValue: methods.setValue,
      watch: methods.watch,
      getValues: methods.getValues,
      formState: methods.formState,
      feedback,
      isSubmitting,
      submitProblem,
    }),
    [
      methods.control,
      methods.setValue,
      methods.watch,
      methods.getValues,
      methods.formState,
      feedback,
      isSubmitting,
      submitProblem,
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
