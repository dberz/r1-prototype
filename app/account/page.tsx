import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/account')
  }

  return (
    <main className="min-h-screen bg-brand-wash px-6 py-16 md:px-10">
      <div className="mx-auto max-w-lg">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-mushroom">
          Signed in
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-brand-espresso">Account</h1>
        <p className="mt-4 font-sans text-sm text-brand-mushroom">
          {user.email}
        </p>
        <p className="mt-8 font-sans text-sm leading-relaxed text-brand-mushroom">
          Dashboard tasks, protocol history, and reorder prompts will appear here in a later phase.
          Your quiz completions are associated with this account when you&apos;re signed in before
          finishing the quiz.
        </p>
        <ul className="mt-10 space-y-3 font-sans text-sm">
          <li>
            <Link href="/account/protocol" className="text-brand-espresso underline-offset-4 hover:underline">
              Protocol
            </Link>
          </li>
          <li>
            <Link href="/account/routine" className="text-brand-espresso underline-offset-4 hover:underline">
              Routine
            </Link>
          </li>
          <li>
            <Link href="/account/support" className="text-brand-espresso underline-offset-4 hover:underline">
              Support
            </Link>
          </li>
        </ul>
        <form action={signOut} className="mt-12">
          <button
            type="submit"
            className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-brand-mushroom hover:text-brand-oxblood"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
