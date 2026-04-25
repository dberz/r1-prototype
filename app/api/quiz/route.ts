import { NextResponse } from 'next/server'
import { QUIZ_QUESTIONS } from '@/features/quiz/questions'
import type { QuizAnswers } from '@/features/quiz/types'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

type QuizPostBody = {
  answers: QuizAnswers
  quiz_version?: string
  traffic_source?: string | null
}

function formatAnswerRow(
  questionKey: string,
  raw: string | string[] | undefined
): { answer_value: string; answer_label: string | null } | null {
  const q = QUIZ_QUESTIONS.find((x) => x.key === questionKey)
  if (!q || raw === undefined) return null

  if (q.type === 'multi') {
    const values = Array.isArray(raw) ? raw : []
    if (values.length === 0) return null
    const labels = values.map((v) => q.options.find((o) => o.value === v)?.label ?? v)
    return {
      answer_value: values.join(','),
      answer_label: labels.join(' · '),
    }
  }

  if (typeof raw !== 'string' || raw === '') return null
  const opt = q.options.find((o) => o.value === raw)
  return { answer_value: raw, answer_label: opt?.label ?? null }
}

function validateAnswers(body: QuizPostBody): string | null {
  for (const q of QUIZ_QUESTIONS) {
    const v = body.answers[q.key]
    if (q.required === false && (v === undefined || v === '')) continue
    if (q.type === 'multi') {
      if (!Array.isArray(v) || v.length === 0) {
        return `Missing or invalid answer for: ${q.key}`
      }
      continue
    }
    if (typeof v !== 'string' || v === '') {
      return `Missing or invalid answer for: ${q.key}`
    }
  }
  return null
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Quiz API — use POST to submit answers.' })
}

export async function POST(request: Request) {
  let body: QuizPostBody
  try {
    body = (await request.json()) as QuizPostBody
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!body.answers || typeof body.answers !== 'object') {
    return NextResponse.json({ ok: false, message: 'Missing answers object.' }, { status: 400 })
  }

  const validationError = validateAnswers(body)
  if (validationError) {
    return NextResponse.json({ ok: false, message: validationError }, { status: 400 })
  }

  const authClient = await createClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  let supabase
  try {
    supabase = createServiceRoleClient()
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        message:
          e instanceof Error
            ? e.message
            : 'Server misconfiguration: Supabase service role not available.',
      },
      { status: 500 }
    )
  }

  const quizVersion = body.quiz_version ?? 'v1'
  const trafficSource = body.traffic_source ?? null

  const { data: sessionRow, error: sessionError } = await supabase
    .from('quiz_sessions')
    .insert({
      user_id: user?.id ?? null,
      completed_at: new Date().toISOString(),
      traffic_source: trafficSource,
      quiz_version: quizVersion,
      completion_status: 'completed',
      abandoned_at_step: null,
    })
    .select('id')
    .single()

  if (sessionError || !sessionRow) {
    return NextResponse.json(
      {
        ok: false,
        message: sessionError?.message ?? 'Could not create quiz session.',
      },
      { status: 500 }
    )
  }

  const sessionId = sessionRow.id as string

  const rows = QUIZ_QUESTIONS.map((q) => {
    const formatted = formatAnswerRow(q.key, body.answers[q.key])
    if (!formatted) return null
    return {
      quiz_session_id: sessionId,
      question_key: q.key,
      answer_value: formatted.answer_value,
      answer_label: formatted.answer_label,
    }
  }).filter((r): r is NonNullable<typeof r> => r !== null)

  const { error: answersError } = await supabase.from('quiz_answers').insert(rows)

  if (answersError) {
    return NextResponse.json(
      { ok: false, message: answersError.message ?? 'Could not save answers.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, sessionId })
}
