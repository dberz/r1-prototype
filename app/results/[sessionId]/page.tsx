import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProtocolResults } from '@/components/protocol/ProtocolResults'
import { generateProtocolSuggestion } from '@/features/recommendations/engine'
import { mapStoredAnswersToQuizInputs } from '@/features/recommendations/map-stored-answers'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

type ResultsPageProps = {
  params: Promise<{ sessionId: string }>
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params

  if (!UUID_RE.test(sessionId)) {
    notFound()
  }

  let supabase
  try {
    supabase = createServiceRoleClient()
  } catch {
    return (
      <main className="min-h-screen bg-brand-porcelain px-6 py-16">
        <p className="font-sans text-brand-mushroom">Server configuration error.</p>
      </main>
    )
  }

  const { data: rows, error } = await supabase
    .from('quiz_answers')
    .select('question_key, answer_value')
    .eq('quiz_session_id', sessionId)

  if (error || !rows?.length) {
    notFound()
  }

  const inputs = mapStoredAnswersToQuizInputs(rows)
  if (!inputs) {
    notFound()
  }

  const suggestion = generateProtocolSuggestion(inputs)

  return (
    <main className="min-h-screen bg-brand-wash px-5 py-12 pb-24 md:px-8 md:py-16">
      <ProtocolResults suggestion={suggestion} sessionId={sessionId} />
      <div className="mx-auto mt-12 max-w-2xl text-center">
        <Link
          href="/"
          className="font-sans text-xs tracking-wide text-brand-mushroom underline-offset-4 transition-colors hover:text-brand-espresso hover:underline"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
