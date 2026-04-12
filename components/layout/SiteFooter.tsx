import Link from 'next/link'
import { mainNavLinks } from '@/components/layout/nav-config'

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-putty/40 bg-brand-cream/40">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-lg text-brand-espresso">R1</p>
            <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-brand-mushroom">
              Premium clinical beauty built around your biology—doctor-developed, personally guided.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer">
            <Link
              href="/quiz"
              className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-brand-mushroom hover:text-brand-espresso"
            >
              Start protocol
            </Link>
            {mainNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-brand-mushroom hover:text-brand-espresso"
              >
                {item.label}
            </Link>
            ))}
          </nav>
        </div>
        <p className="mt-10 font-sans text-[11px] text-brand-stone">
          Prototype experience · Not medical advice. Consult a physician for clinical decisions.
        </p>
      </div>
    </footer>
  )
}
