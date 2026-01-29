'use client'

import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

import React from 'react'

import { TSolutionStatus } from '@/hooks/useSolutionDialog'

interface ResultDialogProps {
  isOpen: boolean
  status: TSolutionStatus
  onClose: () => void
  onConfirm: () => void
}

export default function ResultDialog({
  isOpen,
  status,
  onClose,
  onConfirm,
}: ResultDialogProps) {
  const isSuccess = status === 'PASS'
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSuccess ? '문제를 잘 풀었습니다!' : '잘못 설정한 값이 있습니다.'}
          </DialogTitle>
          <DialogDescription>
            {isSuccess
              ? '완벽하게 해결하셨네요! 다음 단계로 넘어갈까요?'
              : '피드백을 확인하면 도움이 될 거예요.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {isSuccess ? (
            <Button onClick={onConfirm}>다음으로 이동</Button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
