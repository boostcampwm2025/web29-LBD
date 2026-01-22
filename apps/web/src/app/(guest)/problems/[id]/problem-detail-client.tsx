'use client'

import {
  type IRendererMapper,
  rendererMapper,
} from '@/components/service-renderer'

interface ProblemDetailClientProps {
  problemData: IRendererMapper[]
}

export default function ProblemDetailClient({
  problemData,
}: ProblemDetailClientProps) {
  return (
    <div>
      {problemData.map((mapper, index) => {
        const { Renderer, config } = rendererMapper(mapper)
        return <Renderer key={index} config={config} />
      })}
    </div>
  )
}
