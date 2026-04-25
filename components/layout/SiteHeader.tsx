'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { authNav, primaryNavLinks } from '@/components/layout/nav-config'
import { brandImages } from '@/lib/brand-images'
import { cn } from '@/lib/utils'

const navLinkClass = (active: boolean) =>
  cn(
    'font-sans text-[11px] font-medium uppercase tracking-[0.18em] transition-colors',
    active ? 'text-brand-espresso' : 'text-brand-mushroom hover:text-brand-espresso'
  )

const secondaryNavClass = (active: boolean) =>
  cn(
    'font-sans text-[10px] font-normal uppercase tracking-[0.14em] transition-colors',
    active ? 'text-brand-mushroom' : 'text-brand-taupe hover:text-brand-mushroom'
  )

export function SiteHeader({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname()
  const auth = userEmail ? authNav.signedIn : authNav.signedOut
  const authActive = userEmail
    ? pathname === auth.href || pathname.startsWith('/account')
    : pathname === '/login' || pathname === '/auth/callback'

  return (
    <header className="relative sticky top-0 z-50 h-14 min-h-14 overflow-hidden border-b border-brand-putty/40 shadow-brand-inset backdrop-blur-md">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.22]"
        style={{ backgroundImage: `url(${brandImages.headerBar})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-brand-porcelain/92" aria-hidden />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-5 md:gap-4 md:px-8">
        <Link
          href="/"
          className="shrink-0 font-serif text-xl font-light tracking-tight text-brand-espresso transition-colors hover:text-brand-chocolate"
        >
          R1
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 md:flex md:gap-4">
          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 lg:gap-x-6" aria-label="Main">
            {primaryNavLinks.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(pathname === item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            className="flex shrink-0 items-center border-l border-brand-putty/50 pl-4 lg:pl-5"
            aria-label="Account"
          >
            <Link href={auth.href} className={secondaryNavClass(authActive)}>
              {auth.label}
            </Link>
          </div>

          <Link
            href="/quiz"
            className="inline-flex min-h-9 shrink-0 items-center justify-center bg-brand-espresso px-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand-ivory transition-colors hover:bg-brand-chocolate lg:px-5"
          >
            Protocol
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/quiz"
            className="inline-flex min-h-9 items-center justify-center bg-brand-espresso px-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand-ivory"
          >
            Protocol
          </Link>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-brand-espresso hover:bg-brand-cream/80"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[100] bg-brand-plum/25 backdrop-blur-sm" />
              <Dialog.Content className="fixed right-0 top-0 z-[101] flex h-full w-[min(100vw,20rem)] flex-col border-l border-brand-putty/50 bg-brand-porcelain p-6 shadow-brand-soft outline-none">
                <Dialog.Title className="font-serif text-lg text-brand-espresso">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile main">
                  {primaryNavLinks.map((item) => (
                    <Dialog.Close key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="border-b border-brand-putty/30 py-3 font-sans text-sm text-brand-plum hover:text-brand-espresso"
                      >
                        {item.label}
                      </Link>
                    </Dialog.Close>
                  ))}
                </nav>
                <div className="mt-6 border-t border-brand-putty/40 pt-5">
                  <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand-taupe">
                    Account
                  </p>
                  <nav className="mt-3 flex flex-col gap-1" aria-label="Account">
                    <Dialog.Close asChild>
                      <Link
                        href={auth.href}
                        className="py-2 font-sans text-sm text-brand-mushroom hover:text-brand-espresso"
                      >
                        {auth.label}
                      </Link>
                    </Dialog.Close>
                    {userEmail ? (
                      <>
                        <p className="py-1 font-sans text-xs text-brand-taupe">{userEmail}</p>
                        <form action={signOut} className="py-2">
                          <Dialog.Close asChild>
                            <button
                              type="submit"
                              className="font-sans text-sm text-brand-mushroom hover:text-brand-espresso"
                            >
                              Sign out
                            </button>
                          </Dialog.Close>
                        </form>
                      </>
                    ) : null}
                  </nav>
                </div>
                <Dialog.Close asChild>
                  <Link
                    href="/"
                    className="mt-auto border-t border-brand-putty/40 pt-4 font-sans text-sm text-brand-mushroom"
                  >
                    Home
                  </Link>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}
