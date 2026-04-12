import Image from 'next/image'
import { brandImageAlts, brandImages } from '@/lib/brand-images'

export default function SciencePage() {
  return (
    <main className="min-h-screen bg-brand-wash px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-mushroom">
            Evidence &amp; biology
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-brand-espresso md:text-5xl">
            Science
          </h1>
          <p className="mt-8 font-sans text-base leading-relaxed text-brand-mushroom">
            Placeholder — Dr. Berzin&apos;s editorial perspective and the regenerative framework will
            live here. Skin longevity, cellular renewal, and how your protocol steps up over time.
          </p>
        </div>
        <figure className="relative aspect-[4/5] w-full overflow-hidden shadow-brand-soft lg:sticky lg:top-24">
          <Image
            src={brandImages.lifestyle}
            alt={brandImageAlts.lifestyle}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center"
          />
        </figure>
      </div>
    </main>
  )
}
