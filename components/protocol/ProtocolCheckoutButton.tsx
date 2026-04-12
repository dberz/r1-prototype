'use client'

import { useState } from 'react'
import type { ProtocolSuggestion } from '@/features/recommendations/engine'
import { cn } from '@/lib/utils'

export function ProtocolCheckoutButton({
  protocolLevel,
}: {
  protocolLevel: ProtocolSuggestion['protocolLevel']
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClick = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protocolLevel }),
      })
      const data = (await res.json()) as { checkoutUrl?: string; message?: string }
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.message || 'Could not create checkout.')
      }
      window.location.href = data.checkoutUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full sm:flex-1">
      {error ? (
        <p className="mb-3 font-sans text-sm text-brand-oxblood" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className={cn(
          'inline-flex min-h-[3.25rem] w-full items-center justify-center border border-brand-brass/50 bg-brand-cream/60 px-6 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-espresso transition-colors hover:border-brand-espresso hover:bg-brand-cream',
          loading && 'cursor-wait opacity-80'
        )}
      >
        {loading ? 'Opening checkout…' : 'Checkout protocol starter'}
      </button>
      <p className="mt-2 font-sans text-[10px] leading-relaxed text-brand-taupe">
        Uses Shopify variant IDs from your server env. Configure{' '}
        <code className="font-mono text-[10px]">PROTOCOL_VARIANT_IDS_{protocolLevel}</code> to
        match your store.
      </p>
    </div>
  )
}
