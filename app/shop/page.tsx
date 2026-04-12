import { ProductCard } from '@/components/product/ProductCard'
import { getCatalogProducts } from '@/lib/shopify/client'

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof getCatalogProducts>> = []
  let error: string | null = null

  try {
    products = await getCatalogProducts()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load products.'
  }

  return (
    <main className="bg-brand-wash px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-brand-mushroom">
          Catalog
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-brand-espresso md:text-5xl">
          Shop
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-brand-mushroom">
          Headless Shopify — products from your storefront. Set{' '}
          <code className="rounded bg-brand-cream/80 px-1 font-mono text-xs">
            NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE
          </code>{' '}
          to feature a collection, or we list the first products in the catalog.
        </p>

        {error ? (
          <p className="mt-10 font-sans text-sm text-brand-oxblood" role="alert">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="mt-10 font-sans text-sm text-brand-mushroom">
            No products returned. Add products in Shopify and confirm the Storefront API token has
            access to them.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
