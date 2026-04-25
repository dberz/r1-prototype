import Image from 'next/image'
import Link from 'next/link'
import type { ProtocolSuggestion } from '@/features/recommendations/engine'
import { ProtocolCheckoutButton } from '@/components/protocol/ProtocolCheckoutButton'
import { brandImageAlts, brandImages } from '@/lib/brand-images'

function levelLabel(level: ProtocolSuggestion['protocolLevel']): string {
  switch (level) {
    case 'L1':
      return 'Level 1 — Foundation'
    case 'L2':
      return 'Level 2 — Acceleration'
    case 'L3':
      return 'Level 3 — Advanced'
    default:
      return level
  }
}

export function ProtocolResults({
  suggestion,
  sessionId,
}: {
  suggestion: ProtocolSuggestion
  sessionId: string
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-bronze">
        Your personalized protocol
      </p>

      <figure className="relative mt-8 aspect-[16/10] w-full overflow-hidden border border-brand-putty/50 shadow-brand-card">
        <Image
          src={brandImages.protocolReveal}
          alt={brandImageAlts.protocolReveal}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 42rem"
          className="h-full w-full max-w-none object-cover object-center"
          priority
        />
      </figure>

      <h1 className="mt-10 font-serif text-4xl font-light leading-[1.12] tracking-tight text-brand-espresso md:text-5xl">
        Here’s where we begin.
      </h1>
      <p className="mt-6 font-sans text-base leading-relaxed text-brand-mushroom">
        Based on your quiz, we’ve mapped a starting protocol designed for your skin biology—not a
        one-size routine off the shelf.
      </p>

      <div className="mt-12 border border-brand-putty/80 bg-white/50 p-8 shadow-brand-card">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-brand-mushroom">
          Starting point
        </p>
        <p className="mt-4 font-serif text-3xl font-light text-brand-espresso md:text-4xl">
          {levelLabel(suggestion.protocolLevel)}
        </p>
        <p className="mt-2 font-sans text-sm text-brand-mushroom">
          Age track:{' '}
          <span className="font-medium text-brand-plum">
            {suggestion.ageTrack === 'over_40' ? '40+' : 'Under 40'}
          </span>
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-xl font-light text-brand-espresso">Why this protocol</h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-brand-mushroom">{suggestion.rationale}</p>
      </section>

      {suggestion.cautionFlags.length > 0 ? (
        <aside className="mt-10 border-l-[3px] border-brand-mauve/90 bg-brand-cream/60 py-5 pl-6 pr-4 shadow-brand-inset">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-brand-mushroom">
            Notes for your routine
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 font-sans text-sm leading-relaxed text-brand-plum">
            {suggestion.cautionFlags.map((f) => (
              <li key={f} className="marker:text-brand-bronze">
                {humanizeFlag(f)}
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <dl className="mt-12 grid gap-8 border-t border-brand-putty/60 pt-12 font-sans text-sm">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-mushroom">
            Education focus
          </dt>
          <dd className="mt-2 text-brand-plum">{humanizeTrack(suggestion.educationTrack)}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-mushroom">
            Step-up milestone
          </dt>
          <dd className="mt-2 leading-relaxed text-brand-plum">
            Revisit and adjust around {suggestion.stepUpMilestoneDays} days—your skin’s pace, not a
            calendar rush.
          </dd>
        </div>
        {suggestion.estrogenFutureCandidate ? (
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-mushroom">
              Midlife skin
            </dt>
            <dd className="mt-2 leading-relaxed text-brand-plum">
              Your profile may benefit from protocols that account for hormonal shifts—we’ll factor
              that into how you progress.
            </dd>
          </div>
        ) : null}
        {suggestion.consultRequired ? (
          <div className="border border-brand-brass/35 bg-brand-porcelain/80 p-6 shadow-brand-inset">
            <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-bronze">
              Consultation recommended
            </dt>
            <dd className="mt-3 leading-relaxed text-brand-plum">
              Given your answers, a brief clinical review may be advised before certain actives. We’ll
              align this with how R1 ships in your path.
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-14 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <Link
            href="/shop"
            className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center bg-brand-espresso px-10 font-sans text-xs font-medium uppercase tracking-[0.22em] text-brand-ivory shadow-brand-card transition-colors duration-300 hover:bg-brand-chocolate"
          >
            Browse shop
          </Link>
          <Link
            href="/quiz"
            className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center border border-brand-putty/90 px-10 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-espresso transition-colors hover:border-brand-espresso hover:bg-brand-cream/60"
          >
            Retake quiz
          </Link>
        </div>
        <ProtocolCheckoutButton protocolLevel={suggestion.protocolLevel} />
      </div>

      <p className="mt-16 font-mono text-[10px] text-brand-stone">
        Reference · {sessionId}
      </p>
    </div>
  )
}

function humanizeFlag(flag: string): string {
  const map: Record<string, string> = {
    pregnancy_vitamin_a_restriction: 'Vitamin A–based steps may be restricted for your current stage.',
    high_sensitivity_slow_start: 'A gradual introduction helps avoid irritation.',
  }
  return map[flag] ?? flag.replace(/_/g, ' ')
}

function humanizeTrack(track: string): string {
  const map: Record<string, string> = {
    'pregnancy-safe': 'Safety-first guidance for pregnancy or nursing.',
    'midlife-hormonal': 'Hormonal skin changes and how your protocol adapts.',
    'beginner-protocol': 'Clear foundations and how to layer over time.',
    'intermediate-protocol': 'Building on experience—structured step-up.',
  }
  return map[track] ?? track.replace(/-/g, ' ')
}
