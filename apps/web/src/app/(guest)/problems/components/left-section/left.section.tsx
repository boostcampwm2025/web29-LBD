import { ProblemFormContent } from './form-content/problem-form-content'

import { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'

interface ProblemLeftSectionProps {
  children: React.ReactNode
  problemData: IServiceMapper[]
}

export const ProblemLeftSection = ({
  children,
  problemData,
}: ProblemLeftSectionProps) => {
  return (
    <section className="space-y-6 overflow-y-auto">
      {children}
      <ProblemFormContent problemData={problemData} />
    </section>
  )
}
