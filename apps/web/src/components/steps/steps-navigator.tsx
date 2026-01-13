'use client'

import type { StepRenderProps, StepsNavigatorProps } from './types'

import { useCallback, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Steps } from '@/components/ui/steps'
import {
  Background,
  Controls,
  Node,
  ReactFlow,
  useNodesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export function StepsNavigator({
  steps,
  defaultStep = 0,
  queryParamName = 'step',
  onComplete,
  className,
}: StepsNavigatorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 현재 단계 읽기
  const urlStep = Number(searchParams.get(queryParamName) ?? defaultStep)
  const [currentStep, setCurrentStep] = useState(urlStep)

  // URL 업데이트
  const updateUrl = useCallback(
    (step: number) => {
      const params = new URLSearchParams(searchParams)
      params.set(queryParamName, step.toString())
      router.push(`?${params.toString()}`)
    },
    [searchParams, queryParamName, router],
  )

  // Navigation handlers
  const onNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateUrl(nextStep)
    } else {
      onComplete?.()
    }
  }, [currentStep, steps.length, updateUrl, onComplete])

  const onPrev = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      updateUrl(prevStep)
    }
  }, [currentStep, updateUrl])

  // Render props 전달
  const renderProps: StepRenderProps = {
    onNext,
    onPrev,
    canGoPrev: currentStep > 0,
    canGoNext: currentStep < steps.length - 1,
    currentStep,
    totalSteps: steps.length,
  }

  return (
    <div className={className}>
      <Steps steps={steps} currentStep={currentStep + 1} />

      <div className="mt-6 grid grid-cols-2 gap-2">
        <div>{steps[currentStep]?.render(renderProps)}</div>

        <div className="m-6 h-[400px] rounded-lg border bg-white">
          {currentStep ? <S3BucketDiagram /> : null}
        </div>
      </div>
    </div>
  )
}

const initialNodes: Node[] = [
  {
    id: 'region-ap-northeast-2',
    position: { x: 0, y: 100 },
    data: { label: 'Region (ap-northeast-2)' },
    style: {
      width: 300,
      height: 200,
      backgroundColor: 'rgba(207, 182, 255, 0.4)',
      border: '1px solid #9E86ED',
      borderRadius: 10,
      fontSize: 12,
      textAlign: 'center',
    },
  },
  {
    id: 's3-bucket-1',
    position: { x: 120, y: 80 },
    data: { label: 'S3 Bucket\nbucket-name' },
    parentId: 'region-ap-northeast-2',
    extent: 'parent',
    style: {
      width: 160,
      padding: 10,
      backgroundColor: 'rgba(255, 0, 255, 0.2)',
      borderRadius: 8,
      border: '1px solid #FFFFFF',
      fontSize: 12,
      textAlign: 'center',
    },
  },
]

const S3BucketDiagram = () => {
  const [nodes] = useNodesState<Node>(initialNodes)
  return (
    <ReactFlow nodes={nodes} fitView fitViewOptions={{ padding: 0.2 }}>
      <Background />
      <Controls />
    </ReactFlow>
  )
}
