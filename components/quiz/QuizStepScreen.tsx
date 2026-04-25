'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Check, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { QUIZ_QUESTIONS, type QuizQuestion } from '@/features/quiz/questions'
import { brandImages } from '@/lib/brand-images'
import { cn } from '@/lib/utils'
import { useQuizFlow } from './QuizFlowProvider'

function getQuestion(step: number): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((q) => q.step === step)
}

function isStepComplete(question: QuizQuestion, value: string | string[] | undefined): boolean {
  if (value === undefined) return false
  if (question.type === 'multi') {
    return Array.isArray(value) && value.length > 0
  }
  return typeof value === 'string' && value.length > 0
}

export function QuizStepScreen() {
  const params = useParams()
  const router = useRouter()
  const { answers, setAnswer, totalSteps } = useQuizFlow()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stepParam = params.step
  const step = useMemo(() => {
    const n = Number(Array.isArray(stepParam) ? stepParam[0] : stepParam)
    return Number.isFinite(n) ? Math.floor(n) : NaN
  }, [stepParam])

  const question = step >= 1 && step <= totalSteps ? getQuestion(step) : undefined

  useEffect(() => {
    if (!Number.isFinite(step) || step < 1 || step > totalSteps) {
      router.replace('/quiz/1')
    }
  }, [step, totalSteps, router])

  const currentValue = question ? answers[question.key] : undefined
  const canContinue = question ? isStepComplete(question, currentValue) : false

  const progress = (Math.min(Math.max(step, 1), totalSteps) / totalSteps) * 100

  const goBack = () => {
    if (step > 1) router.push(`/quiz/${step - 1}`)
  }

  const goNext = () => {
    if (!canContinue || !question) return
    if (step < totalSteps) {
      router.push(`/quiz/${step + 1}`)
      return
    }
    void completeQuiz()
  }

  const completeQuiz = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          quiz_version: 'v1',
        }),
      })
      const data = (await res.json()) as { sessionId?: string; message?: string }
      if (!res.ok) {
        throw new Error(data.message || 'Could not save your responses.')
      }
      if (!data.sessionId) {
        throw new Error('Invalid response from server.')
      }
      router.push(`/results/${data.sessionId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!question || step < 1 || step > totalSteps) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-brand-porcelain px-6">
        <p className="font-sans text-sm text-brand-mushroom">Loading…</p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src={brandImages.quizIllustration}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="h-full w-full max-w-none object-cover object-center opacity-[0.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-porcelain/93 via-brand-ivory/90 to-brand-cream/92" />
      </div>

      <header className="sticky top-0 z-20 border-b border-brand-putty/60 bg-brand-porcelain/88 shadow-brand-inset backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-brand-mushroom transition-colors hover:bg-brand-cream/80 hover:text-brand-plum"
              aria-label="Previous question"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
          ) : (
            <div className="w-10 shrink-0" aria-hidden />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-brand-mushroom">
              Protocol intake
            </p>
            <div className="mt-2 h-px w-full overflow-hidden bg-brand-putty/80">
              <div
                className="h-full bg-gradient-to-r from-brand-brass to-brand-bronze transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 font-sans text-xs tabular-nums tracking-tight text-brand-taupe">
            {step}/{totalSteps}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-36 pt-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-bronze">
          Step {step} of {totalSteps}
        </p>
        <h1 className="mt-5 font-serif text-[1.65rem] font-light leading-snug tracking-tight text-brand-espresso md:text-3xl">
          {question.question}
        </h1>
        {question.subtitle ? (
          <p className="mt-3 font-sans text-sm leading-relaxed text-brand-mushroom">{question.subtitle}</p>
        ) : null}
        {question.educationNote ? (
          <aside
            className="mt-6 border-l-[3px] border-brand-brass/80 bg-brand-cream/70 py-3.5 pl-5 pr-4 shadow-brand-inset"
            role="note"
          >
            <p className="font-sans text-sm leading-relaxed text-brand-mushroom">{question.educationNote}</p>
          </aside>
        ) : null}

        <div className="mt-8 flex-1">
          {question.type === 'single' && (
            <SingleQuestion question={question} value={answers[question.key]} setAnswer={setAnswer} />
          )}
          {question.type === 'multi' && (
            <MultiQuestion question={question} value={answers[question.key]} setAnswer={setAnswer} />
          )}
          {question.type === 'scale' && (
            <p className="font-sans text-sm text-brand-mushroom">
              This question type is not used in the current quiz.
            </p>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-brand-putty/60 bg-brand-porcelain/92 px-5 py-4 shadow-brand-soft backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg">
          {error ? (
            <p className="mb-3 font-sans text-sm text-brand-oxblood" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={!canContinue || submitting}
            onClick={goNext}
            className={cn(
              'w-full py-4 font-sans text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300',
              canContinue && !submitting
                ? 'bg-brand-espresso text-brand-ivory shadow-brand-card hover:bg-brand-chocolate'
                : 'cursor-not-allowed bg-brand-putty/60 text-brand-mushroom'
            )}
          >
            {submitting
              ? 'Saving…'
              : step === totalSteps
                ? 'See my protocol'
                : 'Continue'}
          </button>
          <Link
            href="/"
            className="mt-4 block text-center font-sans text-xs tracking-wide text-brand-mushroom underline-offset-4 transition-colors hover:text-brand-espresso hover:underline"
          >
            Exit quiz
          </Link>
        </div>
      </footer>
    </div>
  )
}

function SingleQuestion({
  question,
  value,
  setAnswer,
}: {
  question: QuizQuestion
  value: string | string[] | undefined
  setAnswer: (key: string, v: string | string[]) => void
}) {
  const str = typeof value === 'string' ? value : ''

  return (
    <RadioGroup.Root
      className="flex flex-col gap-3"
      value={str}
      onValueChange={(v) => setAnswer(question.key, v)}
    >
      {question.options.map((opt) => (
        <RadioGroup.Item
          key={opt.value}
          value={opt.value}
          className={cn(
            'group relative w-full text-left outline-none',
            'border border-brand-putty/90 bg-white/60 px-4 py-4 pl-5 shadow-brand-inset transition-all',
            'before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-transparent before:transition-colors',
            'data-[state=checked]:border-brand-espresso/90 data-[state=checked]:bg-brand-cream data-[state=checked]:shadow-brand-card data-[state=checked]:before:bg-brand-brass',
            'focus-visible:ring-2 focus-visible:ring-brand-brass/40'
          )}
        >
          <span className="block font-sans text-[15px] leading-snug text-brand-espresso">{opt.label}</span>
          {opt.description ? (
            <span className="mt-1.5 block font-sans text-sm font-normal leading-relaxed text-brand-mushroom">
              {opt.description}
            </span>
          ) : null}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

function MultiQuestion({
  question,
  value,
  setAnswer,
}: {
  question: QuizQuestion
  value: string | string[] | undefined
  setAnswer: (key: string, v: string | string[]) => void
}) {
  const selected = Array.isArray(value) ? value : []

  const toggle = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue]
    setAnswer(question.key, next)
  }

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((opt) => {
        const checked = selected.includes(opt.value)
        return (
          <label
            key={opt.value}
            className={cn(
              'flex cursor-pointer items-start gap-3 border border-brand-putty/90 bg-white/60 px-4 py-4 shadow-brand-inset transition-all',
              checked && 'border-brand-espresso/90 bg-brand-cream shadow-brand-card'
            )}
          >
            <Checkbox.Root
              checked={checked}
              onCheckedChange={() => toggle(opt.value)}
              className={cn(
                'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-brand-stone bg-white',
                'data-[state=checked]:border-brand-espresso data-[state=checked]:bg-brand-espresso',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brass/40'
              )}
            >
              <Checkbox.Indicator>
                <Check className="h-3 w-3 text-brand-ivory" strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="min-w-0 flex-1 font-sans text-[15px] leading-snug text-brand-espresso">
              {opt.label}
              {opt.description ? (
                <span className="mt-1 block text-sm font-normal text-brand-mushroom">{opt.description}</span>
              ) : null}
            </span>
          </label>
        )
      })}
    </div>
  )
}
