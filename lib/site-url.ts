/**
 * Canonical app origin for server-side redirects (auth magic links, etc.).
 * - Prefer NEXT_PUBLIC_SITE_URL when set (local + production).
 * - On Vercel, fall back to VERCEL_URL so Preview deployments work without per-URL env.
 */
export function getAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (explicit) return explicit
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
