'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function AddToCartButton({
  variantId,
  disabled,
}: {
  variantId: string | null
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClick = async () => {
    if (!variantId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: [{ variantId, quantity: 1 }],
        }),
      })
      const data = (await res.json()) as { checkoutUrl?: string; message?: string }
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.message || 'Could not start checkout.')
      }
      window.location.href = data.checkoutUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error ? (
        <p className="mb-3 font-sans text-sm text-brand-oxblood" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={!variantId || disabled || loading}
        onClick={onClick}
        className={cn(
          'w-full max-w-sm bg-brand-espresso py-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-ivory transition-colors',
          variantId && !loading ? 'hover:bg-brand-chocolate' : 'cursor-not-allowed opacity-60'
        )}
      >
        {loading ? 'Redirecting…' : 'Buy now'}
      </button>
    </div>
  )
}
