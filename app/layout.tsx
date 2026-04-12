import type { Metadata } from 'next'
import { Cormorant_Garamond, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'R1 — Regenerative Skincare',
  description:
    'The first skincare experience built around your biology. Doctor-developed, personally guided, designed to regenerate — not just maintain.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans text-brand-plum antialiased">{children}</body>
    </html>
  )
}
