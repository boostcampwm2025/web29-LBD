import type { ComponentType } from 'react'
import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { S3BucketFormData } from '@/types/aws-services/s3/bucket-create/s3-form-data.types'
import type { Edge, Node } from '@xyflow/react'

export type FormData = S3BucketFormData

/**
 * Base props that all Renderer components receive
 */
export interface BaseRendererProps<TConfig extends Record<string, boolean>> {
  config: TConfig
}

/**
 * Props for form-based Renderer components
 */
export interface FormRendererProps<
  TFormData extends Record<string, unknown>,
  TConfig extends Record<string, boolean>,
> extends BaseRendererProps<TConfig> {
  control: Control<TFormData>
  setValue: UseFormSetValue<TFormData>
  watch: UseFormWatch<TFormData>
}

/**
 * Renderer page definition in registry
 */
export interface RendererPage {
  renderer: ComponentType<{ config: Record<string, boolean> }>
  sections: readonly string[]
}

/**
 * Interface for diagram state management
 */
export interface DiagramState {
  nodes: Node[]
  edges: Edge[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
}
