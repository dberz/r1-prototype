import Image from 'next/image'
import Link from 'next/link'
import { brandImageAlts, brandImages } from '@/lib/brand-images'

/** Header is `h-14` (3.5rem); hero fills the first screen below it. */
const heroMinHeight = 'min-h-[calc(100dvh-3.5rem)]'

const midlifeGapPoints = [
  'Products in pumps or jars are exposed to air and become oxidized and ineffective within a week of opening.',
  '95% of products sit on the surface of the skin and never penetrate the skin cell.',
  'Almost no products use the right combination of vitamin A, peptides, and antioxidants to trigger regeneration.',
  'Skincare lines ignore estrogen loss and internal inflammation that accelerate aging.',
] as const

const regenerativePillars = [
  {
    num: '01',
    title: 'High-dose Vitamin A',
    line: 'Drives cell turnover and collagen signaling at levels most routines never reach.',
  },
  {
    num: '02',
    title: 'Antioxidants & Peptides',
    line: 'Defends against oxidative stress while supporting firmness, bounce, and repair.',
  },
  {
    num: '03',
    title: 'Dermal Penetration (Microneedling)',
    line: 'Controlled micro-channels carry actives into living tissue—not just the surface.',
  },
  {
    num: '04',
    title: 'Topical Estrogen (midlife)',
    line: 'Targets thinning, dryness, and elasticity shifts tied to declining estrogen.',
  },
  {
    num: '05',
    title: 'Inside-out Protocol',
    line: 'Pairs precision topicals with internal support for inflammation and hormone context.',
  },
  {
    num: '06',
    title: 'Personalization Over Time',
    line: 'Your protocol steps up as tolerance builds—and adapts as your biology changes.',
  },
] as const

export default function HomePage() {
  return (
    <main className="relative w-full">
      {/* `isolate` + CSS background: Next/Image `fill` was winning the paint order and covering text + header */}
      <section
        className={`relative isolate w-full overflow-hidden ${heroMinHeight}`}
        style={{ minHeight: 'calc(100dvh - 3.5rem)' }}
        aria-labelledby="hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${brandImages.heroHomepage})`,
              backgroundPosition: 'center 28%',
            }}
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-brand-porcelain/95 via-brand-ivory/70 to-brand-ivory/20 sm:from-brand-porcelain/90 sm:via-brand-ivory/55 sm:to-transparent" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-brand-porcelain/50 via-transparent to-brand-cream/55" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-transparent via-transparent to-brand-espresso/[0.07]" />
        </div>

        <div
          className={`relative z-20 mx-auto flex w-full max-w-none ${heroMinHeight} items-center px-5 py-12 sm:px-8 md:px-12 lg:px-16`}
        >
          <div className="w-full max-w-[640px] text-left">
            <h1
              id="hero-heading"
              className="font-serif font-light tracking-[-0.02em] text-brand-espresso"
            >
              <span className="block text-[clamp(2.125rem,5.2vw,3.25rem)] leading-[1.02]">
                Clear from the inside out.
                <br />
                Glow from the outside in.
              </span>
              <span className="mt-3 block text-[clamp(1.5rem,3.4vw,2.125rem)] leading-[1.1] tracking-[-0.015em]">
                Regenerative skincare that works with your biology.
              </span>
            </h1>

            <p className="mt-8 max-w-[36rem] font-sans text-[0.9375rem] font-normal leading-snug tracking-tight text-brand-plum/90 sm:text-base">
              Doctor-developed. Personally guided. Proven to work.
            </p>

            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
              <Link
                href="/quiz"
                className="inline-flex min-h-[3.25rem] min-w-[12.5rem] items-center justify-center bg-brand-espresso px-10 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-ivory shadow-brand-card transition-colors duration-300 hover:bg-brand-chocolate"
              >
                Take the Quiz
              </Link>
              <Link
                href="/science"
                className="font-sans text-sm font-medium text-brand-espresso underline decoration-brand-stone/60 underline-offset-[6px] transition-colors hover:text-brand-chocolate hover:decoration-brand-bronze/80"
              >
                Explore the Science
              </Link>
            </div>

            <p className="mt-14 font-sans text-[11px] tracking-wide text-brand-mushroom">
              Developed by <span className="text-brand-taupe">Dr. Robin Berzin, MD</span>
            </p>
          </div>
        </div>
      </section>

      <section
        className="border-t border-brand-putty/35 bg-brand-porcelain/40 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16"
        aria-labelledby="midlife-gap-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="midlife-gap-heading"
            className="mx-auto max-w-3xl text-center font-serif text-[clamp(1.5rem,3.5vw,2.125rem)] font-light leading-snug tracking-[-0.02em] text-brand-espresso"
          >
            Why today&apos;s top skincare lines don&apos;t work for women in midlife
          </h2>

          <figure className="relative mx-auto mt-12 aspect-[3/4] w-full max-w-md overflow-hidden shadow-brand-soft md:mt-16">
            <Image
              src={brandImages.midlifeCloseUp}
              alt={brandImageAlts.midlifeCloseUp}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 28rem"
              className="h-full w-full max-w-none object-cover object-[center_22%]"
            />
          </figure>

          <ul className="mt-16 grid list-disc grid-cols-1 gap-x-14 gap-y-12 pl-5 marker:text-brand-stone md:mt-20 md:grid-cols-2 md:gap-x-16 md:gap-y-14 md:pl-6">
            {midlifeGapPoints.map((text, i) => (
              <li
                key={i}
                className="font-sans text-[0.9375rem] font-normal leading-relaxed text-brand-mushroom sm:text-base"
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-t border-brand-putty/35 bg-brand-ivory px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16"
        aria-labelledby="pillars-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2
              id="pillars-heading"
              className="font-serif text-[clamp(1.625rem,3.8vw,2.375rem)] font-light leading-snug tracking-[-0.02em] text-brand-espresso"
            >
              What Actually Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-medium uppercase tracking-[0.2em] text-brand-mushroom sm:text-[0.8125rem]">
              The 6 pillars of regenerative skincare
            </p>
          </div>

          <figure className="relative mx-auto mt-12 aspect-[16/10] w-full max-w-4xl overflow-hidden shadow-brand-soft md:mt-14">
            <Image
              src={brandImages.homepageSupport}
              alt={brandImageAlts.homepageSupport}
              fill
              unoptimized
              sizes="(max-width: 896px) 100vw, 56rem"
              className="h-full w-full max-w-none object-cover object-center"
            />
          </figure>

          <ol className="mt-16 grid list-none grid-cols-1 gap-x-10 gap-y-14 pl-0 sm:gap-y-16 md:mt-20 md:grid-cols-3 md:gap-x-12 md:gap-y-16">
            {regenerativePillars.map((item) => (
              <li key={item.num}>
                <span className="block font-serif text-[clamp(2.75rem,6vw,3.75rem)] font-light leading-none tracking-[-0.04em] text-brand-stone/90">
                  {item.num}
                </span>
                <h3 className="mt-4 font-serif text-lg font-normal leading-snug tracking-tight text-brand-espresso sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-[0.9375rem] font-normal leading-relaxed text-brand-mushroom">
                  {item.line}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-16 text-center md:mt-20">
            <Link
              href="/science"
              className="inline-flex items-center gap-1 font-sans text-sm font-medium text-brand-espresso underline decoration-brand-stone/60 underline-offset-[6px] transition-colors hover:text-brand-chocolate hover:decoration-brand-bronze/80"
            >
              Learn more about the science
              <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
