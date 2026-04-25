import Link from 'next/link'
import { authNav, primaryNavLinks } from '@/components/layout/nav-config'

export function SiteFooter({ userEmail }: { userEmail: string | null }) {
  const auth = userEmail ? authNav.signedIn : authNav.signedOut

  return (
    <footer className="border-t border-brand-putty/40 bg-brand-cream/40">
      <div className="mx-auto max-w-6xl px-5 py-12 text-center md:px-8">
        <p className="font-serif text-lg text-brand-espresso">R1</p>

        <p className="mx-auto mt-4 max-w-md font-serif text-base font-light leading-snug tracking-tight text-brand-espresso">
          Clear from the inside out.
          <br />
          Glow from the outside in.
        </p>

        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          aria-label="Footer"
        >
          <Link
            href="/quiz"
            className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-brand-mushroom hover:text-brand-espresso"
          >
            Start protocol
          </Link>
          {primaryNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-brand-mushroom hover:text-brand-espresso"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.16em] text-brand-taupe">
          <Link href={auth.href} className="transition-colors hover:text-brand-mushroom">
            {auth.label}
          </Link>
        </p>

        <p className="mx-auto mt-10 max-w-xl font-sans text-[11px] leading-relaxed text-brand-stone">
          Prototype experience · Not medical advice. Consult a physician for clinical decisions.
        </p>
      </div>
    </footer>
  )
}
