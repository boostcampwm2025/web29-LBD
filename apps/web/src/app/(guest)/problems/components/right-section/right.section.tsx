import { DiagramPanel } from './diagram-panel'
import { FeedbackPanel } from './feedback-panel'
import { SubmitButton } from './submit-button'

export const ProblemRightSection = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        <DiagramPanel />
        <SubmitButton />
        <FeedbackPanel />
      </div>
    </section>
  )
}
