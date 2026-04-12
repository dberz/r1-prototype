import Link from 'next/link'
import { SiteChrome } from '@/components/layout/SiteChrome'

export default async function NotFound() {
  return (
    <SiteChrome>
      <main className="flex min-h-[50vh] flex-col items-center justify-center bg-brand-wash px-6 py-24 text-center">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-mushroom">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl font-light text-brand-espresso md:text-4xl">
          This page isn&apos;t here yet
        </h1>
        <p className="mt-4 max-w-md font-sans text-sm text-brand-mushroom">
          The route may not exist in this prototype, or the link may be wrong.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-11 items-center justify-center bg-brand-espresso px-8 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-ivory hover:bg-brand-chocolate"
        >
          Back home
        </Link>
      </main>
    </SiteChrome>
  )
}
