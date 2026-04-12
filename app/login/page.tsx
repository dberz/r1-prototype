import Link from 'next/link'
import { signInWithOtp } from '@/app/login/actions'

type LoginPageProps = {
  searchParams: Promise<{ check_email?: string; error?: string; next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const next = params.next?.startsWith('/') ? params.next : '/account'

  return (
    <main className="min-h-[60vh] bg-brand-wash px-6 py-20 md:px-10">
      <div className="mx-auto max-w-md">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-mushroom">
          Account
        </p>
        <h1 className="mt-4 font-serif text-3xl font-light text-brand-espresso md:text-4xl">
          Sign in
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-brand-mushroom">
          We&apos;ll email you a secure link—no password to remember.
        </p>

        {params.check_email ? (
          <p className="mt-8 rounded border border-brand-brass/40 bg-brand-cream/50 p-4 font-sans text-sm text-brand-plum">
            Check your inbox for a sign-in link. It may take a minute to arrive.
          </p>
        ) : null}

        {params.error ? (
          <p className="mt-8 font-sans text-sm text-brand-oxblood" role="alert">
            {params.error === 'missing_email'
              ? 'Please enter your email address.'
              : decodeURIComponent(params.error)}
          </p>
        ) : null}

        {!params.check_email ? (
          <form action={signInWithOtp} className="mt-10 space-y-6">
            <input type="hidden" name="next" value={next} />
            <div>
              <label htmlFor="email" className="block font-sans text-[11px] uppercase tracking-[0.16em] text-brand-mushroom">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="mt-2 w-full border border-brand-putty/80 bg-white/80 px-4 py-3 font-sans text-sm text-brand-plum outline-none ring-brand-brass/30 placeholder:text-brand-stone focus:ring-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-espresso py-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-ivory transition-colors hover:bg-brand-chocolate"
            >
              Email me a link
            </button>
          </form>
        ) : null}

        <p className="mt-10 text-center font-sans text-xs text-brand-mushroom">
          <Link href="/" className="underline-offset-4 hover:text-brand-espresso hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}
