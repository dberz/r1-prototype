'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { QuizAnswers } from '@/features/quiz/types'

type QuizFlowContextValue = {
  answers: QuizAnswers
  setAnswer: (key: string, value: string | string[]) => void
  totalSteps: number
}

const QuizFlowContext = createContext<QuizFlowContextValue | null>(null)

export function QuizFlowProvider({
  children,
  totalSteps,
}: {
  children: ReactNode
  totalSteps: number
}) {
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const setAnswer = useCallback((key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }, [])

  const value = useMemo(
    () => ({ answers, setAnswer, totalSteps }),
    [answers, setAnswer, totalSteps]
  )

  return <QuizFlowContext.Provider value={value}>{children}</QuizFlowContext.Provider>
}

export function useQuizFlow() {
  const ctx = useContext(QuizFlowContext)
  if (!ctx) {
    throw new Error('useQuizFlow must be used within QuizFlowProvider')
  }
  return ctx
}
