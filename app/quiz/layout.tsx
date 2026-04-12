import { QuizFlowProvider } from '@/components/quiz/QuizFlowProvider'
import { QUIZ_QUESTIONS } from '@/features/quiz/questions'

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuizFlowProvider totalSteps={QUIZ_QUESTIONS.length}>{children}</QuizFlowProvider>
  )
}
