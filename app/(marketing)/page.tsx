import Image from 'next/image'
import Link from 'next/link'
import { brandImageAlts, brandImages } from '@/lib/brand-images'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(40vh,22rem)] bg-gradient-to-b from-brand-porcelain/80 via-transparent to-transparent"
        aria-hidden
      />

      <section className="relative mx-auto grid max-w-6xl min-h-screen items-center gap-12 px-6 py-16 md:gap-16 md:px-10 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 flex flex-col justify-center lg:order-1">
          <p className="text-center font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-mushroom lg:text-left">
            Precision skincare · Regenerative science
          </p>
          <h1 className="mt-8 text-center font-serif text-display font-light text-brand-espresso lg:text-left">
            Regenerative skincare that works with your biology.
          </h1>
          <p className="mx-auto mt-8 max-w-md text-center font-sans text-base font-normal leading-relaxed tracking-tight text-brand-mushroom md:text-[1.05rem] lg:mx-0 lg:text-left">
            Doctor-developed. Personally guided. Actually works.
          </p>
          <p className="mx-auto mt-6 max-w-lg text-center font-sans text-sm leading-relaxed text-brand-taupe lg:mx-0 lg:text-left">
            Premium clinical beauty with a science framework—for women who want a protocol that
            matches how skin changes, not a shelf of unrelated products.
          </p>
          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start lg:gap-6">
            <Link
              href="/quiz"
              className="inline-flex min-h-[3.25rem] min-w-[14rem] items-center justify-center bg-brand-espresso px-10 font-sans text-xs font-medium uppercase tracking-[0.22em] text-brand-ivory shadow-brand-card transition-colors duration-300 hover:bg-brand-chocolate"
            >
              Find your protocol
            </Link>
            <Link
              href="/science"
              className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-brand-mushroom underline-offset-[5px] transition-colors hover:text-brand-espresso hover:underline"
            >
              The science
            </Link>
          </div>
          <p className="mt-14 text-center font-sans text-[11px] tracking-wide text-brand-stone lg:text-left">
            Developed by <span className="text-brand-taupe">Dr. Robin Berzin, MD</span>
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <figure className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden shadow-brand-soft lg:max-w-none lg:translate-y-4">
            <Image
              src={brandImages.heroHomepage}
              alt={brandImageAlts.heroHomepage}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_20%]"
            />
          </figure>
        </div>
      </section>
    </main>
  )
}
