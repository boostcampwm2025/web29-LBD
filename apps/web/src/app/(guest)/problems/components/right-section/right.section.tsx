import { DiagramPanel } from './diagram-panel'
import { FeedbackPanel } from './feedback-panel'
import { CreatedResourcePanel } from './resource-list'
import { SubmitButton } from './submit-button'

export const ProblemRightSection = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <DiagramPanel />
        <CreatedResourcePanel />
        <SubmitButton />
        <FeedbackPanel />
      </div>
    </section>
  )
}
