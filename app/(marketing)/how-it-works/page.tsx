import Image from 'next/image'
import Link from 'next/link'
import { brandImageAlts, brandImages } from '@/lib/brand-images'

const steps = [
  {
    title: 'Your protocol intake',
    body:
      'A guided quiz maps your biology—hormonal context, sensitivity, vitamin A experience, and goals. One question at a time, no clinical coldness.',
  },
  {
    title: 'Your starting level',
    body:
      'Our rule-based engine suggests a protocol level and education track you can understand—not a black box score. Adjustments account for pregnancy, sensitivity, and pace.',
  },
  {
    title: 'Shop & guidance',
    body:
      'When the catalog is connected, you’ll check out with a cart aligned to your protocol. The dashboard (coming soon) carries step-up reminders and support.',
  },
] as const

export default function HowItWorksPage() {
  return (
    <main className="bg-brand-wash px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-mushroom">
          The experience
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-brand-espresso md:text-5xl">
          How it works
        </h1>
        <p className="mt-6 font-sans text-base leading-relaxed text-brand-mushroom">
          R1 is built around a coherent protocol—not a random shelf of products. Here’s the flow we’re
          prototyping now.
        </p>

        <figure className="relative mt-10 aspect-[16/10] w-full overflow-hidden border border-brand-putty/40 shadow-brand-soft">
          <Image
            src={brandImages.homepageSupport}
            alt={brandImageAlts.homepageSupport}
            fill
            unoptimized
            sizes="(max-width: 42rem) 100vw, 42rem"
            className="h-full w-full max-w-none object-cover object-center"
          />
        </figure>

        <ol className="mt-14 space-y-12 border-t border-brand-putty/50 pt-12">
          {steps.map((step, i) => (
            <li key={step.title}>
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-brand-bronze">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-light text-brand-espresso">{step.title}</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-brand-mushroom md:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 border border-brand-putty/40 bg-white/40 p-8 shadow-brand-inset">
          <p className="font-sans text-sm leading-relaxed text-brand-plum">
            <span className="font-medium text-brand-espresso">Environ path:</span> when consultations
            are enabled, a trained specialist reviews your profile before final protocol
            confirmation—framed as a premium brand moment, not a wait state.
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/quiz"
            className="inline-flex min-h-[3rem] items-center justify-center bg-brand-espresso px-8 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-ivory transition-colors hover:bg-brand-chocolate"
          >
            Start the protocol quiz
          </Link>
        </div>
      </div>
    </main>
  )
}
