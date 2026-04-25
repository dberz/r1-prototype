/** Core site navigation — routes that support the main experience (see CLAUDE.md). */
export const primaryNavLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/science', label: 'Science' },
  { href: '/shop', label: 'Shop' },
  { href: '/future-estrogen', label: "What's next" },
] as const

/** One secondary nav control: “Sign in” when logged out, “Account” when logged in. */
export const authNav = {
  signedIn: { href: '/account', label: 'Account' },
  signedOut: { href: '/login', label: 'Sign in' },
} as const
