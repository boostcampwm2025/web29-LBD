import { ProblemListSection } from './components/problem-list.section'
import { ProblemTabSection } from './components/problem-tab.section'

export default function ProblemsPage() {
  return (
    <div className="w-full py-2">
      <ProblemTabSection />
      <ProblemListSection />
    </div>
  )
}
