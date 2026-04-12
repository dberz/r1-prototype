import type { ProtocolSuggestion } from '@/features/recommendations/engine'

/** Comma-separated Shopify variant GIDs, e.g. gid://shopify/ProductVariant/123 */
export function getProtocolCartLines(
  level: ProtocolSuggestion['protocolLevel']
): { variantId: string; quantity: number }[] {
  const key = `PROTOCOL_VARIANT_IDS_${level}` as const
  const raw = process.env[key] ?? ''
  const ids = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return ids.map((variantId) => ({ variantId, quantity: 1 }))
}
