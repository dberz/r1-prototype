import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProductNode } from '@/lib/shopify/types'

function formatPrice(amount: string, currency: string) {
  const n = Number.parseFloat(amount)
  if (Number.isNaN(n)) return amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
}

export function ProductCard({ product }: { product: ShopifyProductNode }) {
  const img = product.images?.edges?.[0]?.node
  const min = product.priceRange?.minVariantPrice
  const href = `/shop/${product.handle}`

  return (
    <Link
      href={href}
      className="group flex flex-col border border-brand-putty/50 bg-white/40 shadow-brand-inset transition-shadow hover:shadow-brand-card"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-cream/40">
        {img?.url ? (
          <Image
            src={img.url}
            alt={img.altText || product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-sans text-xs text-brand-stone">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-serif text-lg font-light leading-snug text-brand-espresso group-hover:text-brand-chocolate">
          {product.title}
        </h2>
        {min ? (
          <p className="mt-2 font-sans text-sm tabular-nums text-brand-mushroom">
            From {formatPrice(min.amount, min.currencyCode)}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
