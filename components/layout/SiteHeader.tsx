'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { mainNavLinks } from '@/components/layout/nav-config'
import { cn } from '@/lib/utils'

export function SiteHeader({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-brand-putty/40 bg-brand-porcelain/90 shadow-brand-inset backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/"
          className="font-serif text-xl font-light tracking-tight text-brand-espresso transition-colors hover:text-brand-chocolate"
        >
          R1
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {mainNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'font-sans text-[11px] font-medium uppercase tracking-[0.18em] transition-colors',
                pathname === item.href
                  ? 'text-brand-espresso'
                  : 'text-brand-mushroom hover:text-brand-espresso'
              )}
            >
              {item.label}
            </Link>
          ))}
          {userEmail ? (
            <form action={signOut}>
              <button
                type="submit"
                className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-brand-mushroom transition-colors hover:text-brand-espresso"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-brand-mushroom transition-colors hover:text-brand-espresso"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/quiz"
            className="inline-flex min-h-9 items-center justify-center bg-brand-espresso px-5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand-ivory transition-colors hover:bg-brand-chocolate"
          >
            Protocol
          </Link>
        </nav>

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
                <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile main">
                  {mainNavLinks.map((item) => (
                    <Dialog.Close key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="border-b border-brand-putty/30 py-3 font-sans text-sm text-brand-plum hover:text-brand-espresso"
                      >
                        {item.label}
                      </Link>
                    </Dialog.Close>
                  ))}
                  {userEmail ? (
                    <>
                      <p className="border-b border-brand-putty/30 py-3 font-sans text-xs text-brand-taupe">
                        {userEmail}
                      </p>
                      <form action={signOut} className="py-3">
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
                  ) : (
                    <Dialog.Close asChild>
                      <Link
                        href="/login"
                        className="block border-b border-brand-putty/30 py-3 font-sans text-sm text-brand-plum hover:text-brand-espresso"
                      >
                        Sign in
                      </Link>
                    </Dialog.Close>
                  )}
                  <Dialog.Close asChild>
                    <Link
                      href="/"
                      className="mt-4 border-t border-brand-putty/40 pt-4 font-sans text-sm text-brand-mushroom"
                    >
                      Home
                    </Link>
                  </Dialog.Close>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}
