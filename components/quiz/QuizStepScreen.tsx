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
  if (question.required === false) {
    if (value === undefined) return true
    if (Array.isArray(value)) return true
    return typeof value === 'string'
  }
  if (value === undefined) return false
  if (question.type === 'multi') {
    return Array.isArray(value) && value.length > 0
  }
  return typeof value === 'string' && value.length > 0
}

function diagnosisContent(answers: Record<string, string | string[]>): {
  bullets: string[]
  explanation: string
} {
  const concerns = Array.isArray(answers.primary_concerns_now) ? answers.primary_concerns_now : []
  const stoppedWorking = typeof answers.stopped_working === 'string' ? answers.stopped_working : ''
  const ageRange = typeof answers.age_range === 'string' ? answers.age_range : ''

  const hasIrritation = concerns.includes('sensitivity_irritation')
  const hasDullness = concerns.includes('dullness_loss_glow')
  const hasFirmness = concerns.includes('thinner_less_firm')
  const age40Plus = ['40_45', '45_50', '50_plus'].includes(ageRange)

  const sensitivityBarrierPattern = hasIrritation && stoppedWorking === 'retinol_vitamin_a'
  const lowTurnoverPenetrationPattern = hasDullness && stoppedWorking === 'nothing_worked'
  const collagenHormonalPattern = hasFirmness && age40Plus

  const bullets: string[] = []
  if (sensitivityBarrierPattern) {
    bullets.push('Barrier disruption with increased reactivity to active ingredients')
  }
  if (lowTurnoverPenetrationPattern) {
    bullets.push('Lower cellular turnover limiting visible renewal')
    bullets.push('Reduced ingredient penetration into deeper skin layers')
  }
  if (collagenHormonalPattern) {
    bullets.push('Declining collagen support affecting firmness and structure')
    bullets.push('Hormonal influence consistent with midlife skin change')
  }

  if (!bullets.length) {
    bullets.push(
      'Reduced collagen support',
      'Changing tolerance to active ingredients',
      'Lower cellular turnover',
      age40Plus ? 'Possible hormonal influence' : 'Possible inflammation-driven influence'
    )
  } else {
    if (!bullets.some((b) => b.includes('collagen'))) {
      bullets.push('Reduced collagen support')
    }
    if (!bullets.some((b) => b.includes('turnover'))) {
      bullets.push('Lower cellular turnover')
    }
    if (age40Plus && !bullets.some((b) => b.includes('Hormonal influence'))) {
      bullets.push('Possible hormonal influence')
    }
  }

  const explanation = sensitivityBarrierPattern
    ? 'Your response pattern suggests a skin barrier that has become less resilient over time. In this state, familiar actives can create irritation before they create repair.'
    : lowTurnoverPenetrationPattern
      ? 'When turnover slows and penetration is limited, products can sit on the surface without meaningful change. The skin can look persistently dull even with strong routines.'
      : collagenHormonalPattern
        ? 'For many women 40+, lower collagen signaling and estrogen decline shift how skin repairs itself. Firmness drops first, and previous routines stop producing the same response.'
        : 'In midlife, skin biology changes, especially with shifts in estrogen and inflammation. Most products are not designed for this.'

  return { bullets: bullets.slice(0, 4), explanation }
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
  const isOpening = step === 1
  const isAnalyzing = step === 8
  const isDiagnosis = step === 9
  const isSolution = step === 10
  const isFinalCta = step === 11
  const diagnosis = useMemo(() => diagnosisContent(answers), [answers])
  const canContinue =
    isOpening || isDiagnosis || isSolution
      ? true
      : isAnalyzing || isFinalCta
        ? false
        : question
          ? isStepComplete(question, currentValue)
          : false

  const progress = (Math.min(Math.max(step, 1), totalSteps) / totalSteps) * 100

  const goBack = () => {
    if (step > 1) router.push(`/quiz/${step - 1}`)
  }

  const goNext = () => {
    if (isAnalyzing || submitting) return
    if (isFinalCta) {
      void completeQuiz()
      return
    }
    if (!canContinue) return
    if (step < totalSteps) {
      router.push(`/quiz/${step + 1}`)
      return
    }
  }

  useEffect(() => {
    if (!isAnalyzing) return
    const id = window.setTimeout(() => {
      router.push('/quiz/9')
    }, 2200)
    return () => window.clearTimeout(id)
  }, [isAnalyzing, router])

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

  if (step < 1 || step > totalSteps) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-brand-porcelain px-6">
        <p className="font-sans text-sm text-brand-mushroom">Loading...</p>
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

        {isOpening ? (
          <div className="mt-10">
            <h1 className="font-serif text-[1.85rem] font-light leading-tight tracking-tight text-brand-espresso md:text-[2.25rem]">
              Let&apos;s understand what&apos;s actually happening with your skin.
            </h1>
            <p className="mt-5 font-sans text-base leading-relaxed text-brand-mushroom">
              This takes about 2 minutes.
            </p>
          </div>
        ) : isAnalyzing ? (
          <div className="mt-12">
            <h1 className="font-serif text-[1.75rem] font-light leading-tight tracking-tight text-brand-espresso">
              Analyzing your skin profile...
            </h1>
            <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-brand-mushroom">
              Looking at patterns in skin response, inflammation, and hormonal changes
            </p>
            <div className="mt-8 h-[3px] w-full overflow-hidden bg-brand-putty/70">
              <div className="h-full w-2/5 animate-pulse bg-gradient-to-r from-brand-bronze via-brand-brass to-brand-bronze" />
            </div>
          </div>
        ) : isDiagnosis ? (
          <div className="mt-8 space-y-6">
            <h1 className="font-serif text-[1.8rem] font-light leading-tight tracking-tight text-brand-espresso">
              Here&apos;s what&apos;s likely happening
            </h1>
            <p className="font-sans text-sm leading-relaxed text-brand-mushroom">
              Based on your answers, your skin is showing signs of:
            </p>
            <ul className="space-y-3 border-l border-brand-putty/70 pl-5">
              {diagnosis.bullets.map((line) => (
                <li key={line} className="font-sans text-[0.95rem] leading-snug text-brand-plum">
                  - {line}
                </li>
              ))}
            </ul>
            <h2 className="font-serif text-xl font-light text-brand-espresso">
              This is why products that used to work aren&apos;t anymore.
            </h2>
            <p className="max-w-md font-sans text-sm leading-relaxed text-brand-mushroom">{diagnosis.explanation}</p>
          </div>
        ) : isSolution ? (
          <div className="mt-8 space-y-6">
            <h1 className="font-serif text-[1.8rem] font-light leading-tight tracking-tight text-brand-espresso">
              What actually works
            </h1>
            <p className="max-w-md font-sans text-sm leading-relaxed text-brand-mushroom">
              The R1 system is designed specifically for this stage of skin.
            </p>
            <ul className="space-y-3 border-l border-brand-putty/70 pl-5">
              <li className="font-sans text-[0.95rem] leading-snug text-brand-plum">
                - Cellular regeneration (Vitamin A)
              </li>
              <li className="font-sans text-[0.95rem] leading-snug text-brand-plum">
                - Deep penetration (microneedling)
              </li>
              <li className="font-sans text-[0.95rem] leading-snug text-brand-plum">
                - Internal support (nutrition + inflammation)
              </li>
              <li className="font-sans text-[0.95rem] leading-snug text-brand-plum">
                - Hormonal support (when appropriate)
              </li>
              <li className="font-sans text-[0.95rem] leading-snug text-brand-plum">
                - Personalized progression over time
              </li>
            </ul>
          </div>
        ) : isFinalCta ? (
          <div className="mt-8 space-y-6">
            <h1 className="font-serif text-[1.85rem] font-light leading-tight tracking-tight text-brand-espresso">
              Ready for your next step
            </h1>
            <p className="max-w-md font-sans text-sm leading-relaxed text-brand-mushroom">
              Your profile is ready. We can now generate a personalized protocol based on how your
              skin is changing.
            </p>
            <div className="space-y-4">
              <button
                type="button"
                disabled={submitting}
                onClick={goNext}
                className={cn(
                  'w-full py-4 font-sans text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300',
                  !submitting
                    ? 'bg-brand-espresso text-brand-ivory shadow-brand-card hover:bg-brand-chocolate'
                    : 'cursor-not-allowed bg-brand-putty/60 text-brand-mushroom'
                )}
              >
                {submitting ? 'Building your profile...' : 'Get your personalized protocol'}
              </button>
              <Link
                href="/science"
                className="block text-center font-sans text-sm text-brand-mushroom underline-offset-4 transition-colors hover:text-brand-espresso hover:underline"
              >
                Learn more about the science
              </Link>
            </div>
          </div>
        ) : question ? (
          <>
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
                <p className="font-sans text-sm leading-relaxed text-brand-mushroom">
                  {question.educationNote}
                </p>
              </aside>
            ) : null}

            <div className="mt-8 flex-1">
              {question.type === 'single' && (
                <SingleQuestion
                  question={question}
                  value={answers[question.key]}
                  setAnswer={setAnswer}
                  quiet={question.key === 'age_range'}
                />
              )}
              {question.type === 'multi' && (
                <MultiQuestion question={question} value={answers[question.key]} setAnswer={setAnswer} />
              )}
            </div>
          </>
        ) : null}
      </main>

      <footer
        className={cn(
          'fixed bottom-0 left-0 right-0 z-20 border-t border-brand-putty/60 bg-brand-porcelain/92 px-5 py-4 shadow-brand-soft backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]',
          (isAnalyzing || isFinalCta) && 'hidden'
        )}
      >
        <div className="mx-auto max-w-lg">
          {error ? (
            <p className="mb-3 font-sans text-sm text-brand-oxblood" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={!canContinue || submitting || isAnalyzing}
            onClick={goNext}
            className={cn(
              'w-full py-4 font-sans text-xs font-medium uppercase tracking-[0.22em] transition-all duration-300',
              canContinue && !submitting && !isAnalyzing
                ? 'bg-brand-espresso text-brand-ivory shadow-brand-card hover:bg-brand-chocolate'
                : 'cursor-not-allowed bg-brand-putty/60 text-brand-mushroom'
            )}
          >
            {submitting ? 'Saving...' : isOpening ? 'Start Assessment' : 'Continue'}
          </button>
          {question?.required === false ? (
            <button
              type="button"
              onClick={goNext}
              className="mt-3 w-full font-sans text-[11px] uppercase tracking-[0.16em] text-brand-taupe transition-colors hover:text-brand-mushroom"
            >
              Skip for now
            </button>
          ) : null}
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
  quiet = false,
}: {
  question: QuizQuestion
  value: string | string[] | undefined
  setAnswer: (key: string, v: string | string[]) => void
  quiet?: boolean
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
            quiet
              ? 'border border-brand-putty/70 bg-brand-porcelain/60 px-4 py-3.5 pl-5 shadow-brand-inset transition-all'
              : 'border border-brand-putty/90 bg-white/60 px-4 py-4 pl-5 shadow-brand-inset transition-all',
            'before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-transparent before:transition-colors',
            'data-[state=checked]:border-brand-espresso/90 data-[state=checked]:bg-brand-cream data-[state=checked]:shadow-brand-card data-[state=checked]:before:bg-brand-brass',
            'focus-visible:ring-2 focus-visible:ring-brand-brass/40'
          )}
        >
          <span
            className={cn(
              'block font-sans leading-snug text-brand-espresso',
              quiet ? 'text-[14px] font-normal' : 'text-[15px]'
            )}
          >
            {opt.label}
          </span>
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
