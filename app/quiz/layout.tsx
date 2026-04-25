import { QuizFlowProvider } from '@/components/quiz/QuizFlowProvider'
import { QUIZ_TOTAL_STEPS } from '@/features/quiz/questions'

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <QuizFlowProvider totalSteps={QUIZ_TOTAL_STEPS}>{children}</QuizFlowProvider>
}
