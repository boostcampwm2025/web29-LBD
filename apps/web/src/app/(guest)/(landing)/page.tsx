import {
  HeroSection,
  HowItWorksSection,
  ValuePropositionSection,
} from './components/sections'

export default function LandingPage() {
  return (
    <main className="flex w-full flex-col gap-24">
      <HeroSection />
      <ValuePropositionSection />
      <HowItWorksSection />
    </main>
  )
}
