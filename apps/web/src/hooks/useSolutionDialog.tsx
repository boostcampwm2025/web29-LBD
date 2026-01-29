import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { TProblemType } from '@/types/problem.type'

export type TSolutionStatus = 'IDLE' | 'PASS' | 'FAIL'

export default function useSolutionDialog() {
  const [status, setStatus] = useState<TSolutionStatus>('IDLE')
  const router = useRouter()
  const openModal = (isSuccess: Exclude<TSolutionStatus, 'IDLE'>) => {
    setStatus(isSuccess)
  }
  const closeModal = () => setStatus('IDLE')
  const handleNavigation = (problemType: TProblemType, dest: string) => {
    closeModal()
    if (problemType === 'unit') {
      router.push(`/problems?type=unit`)
    } else if (problemType === 'cookbook') {
      if (dest) {
        router.push(`/problems/cookbook/${dest}`)
      } else {
        router.push(`/problems?type=cookbook`)
      }
    }
  }
  return {
    status,
    openModal,
    closeModal,
    handleNavigation,
    isModalOpen: status !== 'IDLE',
  }
}
