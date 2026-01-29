import type { SecurityGroupFormData } from './sg-form-data.types'

import type { UseFormReturn } from 'react-hook-form'

export interface SGSectionProps {
  config: Record<string, boolean>
}

export interface SGWithFormSectionProps extends SGSectionProps {
  form: UseFormReturn<SecurityGroupFormData>
}

// VPC 옵션 (드롭다운용)
export interface VPCOption {
  id: string
  name: string
}
