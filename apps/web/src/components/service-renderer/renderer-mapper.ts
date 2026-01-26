import { RENDERER_REGISTRY } from './registry'

export interface IRendererMapper {
  inputSections: string[]
  serviceName: keyof typeof RENDERER_REGISTRY
  serviceTask: string
}

export const rendererMapper = ({
  serviceName,
  serviceTask,
  inputSections,
}: IRendererMapper) => {
  const service = RENDERER_REGISTRY[serviceName]
  if (!service) {
    throw new Error(`Renderer for service "${serviceName}" not found`)
  }

  const page = service[serviceTask]
  if (!page) {
    throw new Error(
      `Renderer for task "${serviceTask}" not found in "${serviceName}"`,
    )
  }

  // config 생성 - 각 섹션이 inputSections에 포함되어 있는지 확인
  const inputSet = new Set(inputSections)
  const config = page.sections.reduce<Record<string, boolean>>(
    (acc, section) => {
      acc[section] = inputSet.has(section)
      return acc
    },
    {},
  )

  return {
    Renderer: page.renderer,
    config,
  }
}
