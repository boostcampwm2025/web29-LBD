import { ProblemFormContent } from './problem-form-content'
import { ProblemHeader } from './problem-header'

import { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'

interface ProblemLeftSectionProps {
  type: string
  title: string
  description: string
  tags: string[]
  problemData: IServiceMapper[]
}

export const ProblemLeftSection = ({
  type,
  title,
  description,
  tags,
  problemData,
}: ProblemLeftSectionProps) => {
  return (
    <section className="space-y-6 overflow-y-auto">
      <ProblemHeader
        type={type}
        title={title}
        description={description}
        tags={tags}
      />
      <ProblemFormContent problemData={problemData} />
    </section>
  )
}
