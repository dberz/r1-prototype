import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { getProductByHandle } from '@/lib/shopify/client'
import type { ShopifyVariant } from '@/lib/shopify/types'

function formatPrice(amount: string, currency: string) {
  const n = Number.parseFloat(amount)
  if (Number.isNaN(n)) return amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
}

function pickDefaultVariant(variants: { node: ShopifyVariant }[]): ShopifyVariant | null {
  const nodes = variants.map((e) => e.node).filter((v) => v.availableForSale)
  return nodes[0] ?? null
}

type ProductPageProps = {
  params: Promise<{ handle: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params

  let product
  try {
    product = await getProductByHandle(handle)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const variant = pickDefaultVariant(product.variants?.edges ?? [])
  const img = product.images?.edges?.[0]?.node

  return (
    <main className="bg-brand-wash px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-brand-putty/40 bg-brand-cream/30 shadow-brand-card">
          {img?.url ? (
            <Image
              src={img.url}
              alt={img.altText || product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-sans text-brand-stone">
              No image
            </div>
          )}
        </div>

        <div>
          <Link
            href="/shop"
            className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-mushroom hover:text-brand-espresso"
          >
            ← Shop
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-light text-brand-espresso md:text-4xl">
            {product.title}
          </h1>
          {variant ? (
            <p className="mt-4 font-sans text-lg tabular-nums text-brand-plum">
              {formatPrice(variant.price.amount, variant.price.currencyCode)}
              {variant.title !== 'Default Title' ? (
                <span className="ml-2 text-sm font-normal text-brand-mushroom">· {variant.title}</span>
              ) : null}
            </p>
          ) : null}

          {product.descriptionHtml ? (
            <div
              className="mt-8 font-sans text-sm leading-relaxed text-brand-mushroom [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="mt-8 whitespace-pre-wrap font-sans text-sm leading-relaxed text-brand-mushroom">
              {product.description}
            </p>
          ) : null}

          <div className="mt-10">
            <AddToCartButton variantId={variant?.id ?? null} disabled={!variant} />
          </div>
        </div>
      </div>
    </main>
  )
}
