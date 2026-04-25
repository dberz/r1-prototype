import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { brandImageAlts, brandImages } from '@/lib/brand-images'

export const metadata: Metadata = {
  title: 'Science — R1',
  description:
    'Why conventional skincare fails women in midlife—and the six pillars of regenerative skincare that actually work.',
}

const problemExpanded = [
  {
    lead: 'Products in pumps or jars are exposed to air and become oxidized and ineffective within a week of opening.',
    detail:
      'Each time you dispense or dip, oxygen and microbes re-enter the formula. Delicate actives—especially vitamin A and many antioxidants—begin degrading immediately. What still feels luxurious on the skin may already be past its therapeutic window.',
  },
  {
    lead: '95% of products sit on the surface of the skin and never penetrate the skin cell.',
    detail:
      'Marketing promises “deep repair,” but the stratum corneum is built to keep things out. Without delivery strategy, even elegant formulas mostly hydrate the surface. Regeneration requires reaching the living layers where cells actually turn over.',
  },
  {
    lead: 'Almost no products use the right combination of vitamin A, peptides, and antioxidants to trigger regeneration.',
    detail:
      'Single “hero” ingredients rarely recreate what skin biology needs in concert. Vitamin A sets renewal in motion; stabilized antioxidants and well-chosen peptides support repair and resilience. Most lines never align all three at meaningful doses.',
  },
  {
    lead: 'Skincare lines ignore estrogen loss and internal inflammation that accelerate aging.',
    detail:
      'Midlife skin changes are not only “dryness” or “fine lines”—they reflect shifting hormones and chronic low-grade inflammation. Routines designed for a younger baseline miss the systemic context that determines how skin responds to any topical.',
  },
] as const

const pillarsDetailed = [
  {
    title: 'High-dose Vitamin A',
    body: [
      'Vitamin A works because skin cells already know how to convert it into the active form that regulates renewal and collagen behavior—the goal is steady signaling, not a daily sting.',
      'R1 protocols prioritize esters and concentrations that convert in the skin with control: you step up over time so you get cellular turnover without the needless irritation that makes people quit before results arrive.',
    ],
  },
  {
    title: 'Antioxidants & Peptides',
    body: [
      'Antioxidants neutralize the oxidative stress that otherwise cancels out repair; peptides add targeted signals for firmness and extracellular matrix support.',
      'Stability matters as much as choice of ingredient—airless delivery, thoughtful pairing, and photoprotection keep formulas active long after opening, not just on day one.',
    ],
  },
  {
    title: 'Dermal Penetration (Microneedling)',
    body: [
      'Microneedling creates controlled micro-channels through the barrier so actives can reach the dermis instead of pooling on top.',
      'Clinical discussions often cite dramatic gains in delivery compared with topical application alone—commonly framed in the ballpark of 70–80% more reaching viable tissue when technique and needle depth are appropriate.',
    ],
  },
  {
    title: 'Topical Estrogen (midlife)',
    body: [
      'Declining estrogen contributes to thinning, dryness, and loss of elasticity. Carefully formulated topical estrogen is intended to act where it is applied—supporting skin structure locally rather than replacing systemic hormone therapy.',
      'Used under medical guidance, it is a localized, non-systemic lever for midlife skin that topicals alone often cannot fully address.',
    ],
  },
  {
    title: 'Inside-out Protocol',
    body: [
      'Skin reflects what is happening internally: inflammation, sleep, stress, nutrition, and metabolic health all change how cells respond to even the best cream.',
      'An inside-out protocol aligns lifestyle and targeted internal support with your topical regimen so you are not fighting your biology on two fronts.',
    ],
  },
  {
    title: 'Personalization Over Time',
    body: [
      'Skin tolerance and hormone context shift month to month, not once a year. A regenerative protocol is built to step up, pause, or pivot—never a static shelf of products.',
      'Personalization means dosing, sequencing, and check-ins evolve as your skin proves it can handle more, and as midlife itself continues to change the goalposts.',
    ],
  },
] as const

const pillarChecklist = [
  'High-dose Vitamin A',
  'Antioxidants & Peptides',
  'Dermal Penetration (Microneedling)',
  'Topical Estrogen (midlife)',
  'Inside-out Protocol',
  'Personalization Over Time',
] as const

export default function SciencePage() {
  return (
    <main className="bg-brand-ivory text-brand-plum">
      <article className="mx-auto max-w-[40rem] px-5 py-20 sm:px-8 sm:py-24 md:py-28 lg:px-10">
        <header className="border-b border-brand-putty/40 pb-16 md:pb-20">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.26em] text-brand-mushroom">
            Science
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2rem,4.5vw,2.875rem)] font-light leading-[1.08] tracking-[-0.02em] text-brand-espresso">
            What actually works—and why most skincare doesn&apos;t.
          </h1>
          <p className="mt-8 font-sans text-base leading-relaxed text-brand-mushroom">
            A doctor-developed framework for regenerative skincare: the problem with conventional lines,
            the six pillars that match midlife biology, and how R1 builds your protocol around both.
          </p>
        </header>

        <figure className="relative mt-14 aspect-[16/10] w-full overflow-hidden border border-brand-putty/40 shadow-brand-soft md:mt-16">
          <Image
            src={brandImages.insideOutVisual}
            alt={brandImageAlts.insideOutVisual}
            fill
            unoptimized
            sizes="(max-width: 40rem) 100vw, 40rem"
            className="h-full w-full max-w-none object-cover object-center"
          />
        </figure>

        {/* SECTION A — The Problem */}
        <section className="pt-16 md:pt-20" aria-labelledby="science-problem-heading">
          <h2
            id="science-problem-heading"
            className="font-serif text-2xl font-light tracking-tight text-brand-espresso sm:text-[1.75rem]"
          >
            The problem
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-brand-mushroom">
            Why today&apos;s top skincare lines often fail women in midlife—four realities the industry
            rarely acknowledges on the label.
          </p>

          <ol className="mt-12 list-none space-y-12 pl-0 md:mt-14 md:space-y-14">
            {problemExpanded.map((item, i) => (
              <li key={i}>
                <span className="font-serif text-sm font-normal tabular-nums text-brand-stone">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 font-sans text-[0.9375rem] font-medium leading-snug text-brand-espresso sm:text-base">
                  {item.lead}
                </p>
                <p className="mt-3 font-sans text-[0.9375rem] font-normal leading-relaxed text-brand-mushroom sm:text-base">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* SECTION B — The 6 Pillars */}
        <section className="pt-20 md:pt-28" aria-labelledby="science-pillars-heading">
          <h2
            id="science-pillars-heading"
            className="font-serif text-2xl font-light tracking-tight text-brand-espresso sm:text-[1.75rem]"
          >
            What actually works
          </h2>
          <p className="mt-3 font-sans text-sm font-medium uppercase tracking-[0.18em] text-brand-mushroom">
            The 6 pillars of regenerative skincare
          </p>

          <div className="mt-14 space-y-20 md:mt-16 md:space-y-24">
            {pillarsDetailed.map((pillar, i) => (
              <div
                key={pillar.title}
                className="border-t border-brand-putty/35 pt-16 first:border-t-0 first:pt-0 md:pt-20 md:first:pt-0"
              >
                <h3 className="font-serif text-xl font-normal leading-snug tracking-tight text-brand-espresso sm:text-[1.375rem]">
                  <span className="mr-3 font-light tabular-nums text-brand-stone">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {pillar.title}
                </h3>
                <div className="mt-6 space-y-4 font-sans text-[0.9375rem] leading-relaxed text-brand-mushroom sm:text-base">
                  {pillar.body.map((para, j) => (
                    <p key={`${pillar.title}-${j}`}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final summary + checklist */}
        <section
          className="mt-20 border-t border-brand-putty/50 pt-16 md:mt-28 md:pt-20"
          aria-labelledby="r1-summary-statement"
        >
          <p
            id="r1-summary-statement"
            className="font-serif text-[clamp(1.25rem,2.8vw,1.5rem)] font-light leading-snug tracking-[-0.015em] text-brand-espresso"
          >
            R1 is the first personalized, inside-out skincare protocol with products proven to work
            for women in midlife.
          </p>

          <p className="mt-10 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-taupe">
            The six pillars
          </p>
          <ul className="mt-6 space-y-3 font-sans text-[0.9375rem] leading-relaxed text-brand-mushroom sm:text-base">
            {pillarChecklist.map((label) => (
              <li key={label} className="flex gap-3">
                <span
                  className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-bronze/65"
                  aria-hidden
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <p className="mt-14 font-sans text-sm text-brand-mushroom">
            <Link
              href="/quiz"
              className="font-medium text-brand-espresso underline decoration-brand-stone/50 underline-offset-[5px] transition-colors hover:text-brand-chocolate hover:decoration-brand-bronze/70"
            >
              Take the quiz
            </Link>
            <span className="text-brand-stone"> · </span>
            <Link
              href="/"
              className="font-medium text-brand-espresso underline decoration-brand-stone/50 underline-offset-[5px] transition-colors hover:text-brand-chocolate hover:decoration-brand-bronze/70"
            >
              Back to home
            </Link>
          </p>
        </section>
      </article>
    </main>
  )
}
