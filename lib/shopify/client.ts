import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import type { ShopifyProductNode } from '@/lib/shopify/types'

function getClient() {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
  if (!storeDomain || !token) {
    throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN')
  }
  return createStorefrontApiClient({
    storeDomain,
    apiVersion: '2026-01',
    publicAccessToken: token,
  })
}

const productFields = `
  id
  title
  handle
  description
  descriptionHtml
  priceRange {
    minVariantPrice { amount currencyCode }
  }
  images(first: 6) {
    edges { node { url altText } }
  }
  variants(first: 25) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
      }
    }
  }
`

export async function getProductsByCollection(collectionHandle: string): Promise<ShopifyProductNode[]> {
  const shopifyClient = getClient()
  const query = `
    query GetProducts($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 24) {
          edges { node { ${productFields} } }
        }
      }
    }
  `
  const { data } = await shopifyClient.request(query, { variables: { handle: collectionHandle } })
  const edges = data?.collectionByHandle?.products?.edges
  return (edges?.map((e: { node: ShopifyProductNode }) => e.node) ?? []) as ShopifyProductNode[]
}

export async function getProductsCatalog(first = 24): Promise<ShopifyProductNode[]> {
  const shopifyClient = getClient()
  const query = `
    query Catalog($first: Int!) {
      products(first: $first) {
        edges { node { ${productFields} } }
      }
    }
  `
  const { data } = await shopifyClient.request(query, { variables: { first } })
  const edges = data?.products?.edges
  return (edges?.map((e: { node: ShopifyProductNode }) => e.node) ?? []) as ShopifyProductNode[]
}

/** Prefer collection handle from env; fall back to all products. */
export async function getCatalogProducts(): Promise<ShopifyProductNode[]> {
  const handle = process.env.NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE?.trim()
  if (handle) {
    const fromCollection = await getProductsByCollection(handle)
    if (fromCollection.length > 0) return fromCollection
  }
  return getProductsCatalog(24)
}

export async function getProductByHandle(handle: string): Promise<ShopifyProductNode | null> {
  const shopifyClient = getClient()
  const query = `
    query Product($handle: String!) {
      product(handle: $handle) {
        ${productFields}
      }
    }
  `
  const { data } = await shopifyClient.request(query, { variables: { handle } })
  return (data?.product as ShopifyProductNode) ?? null
}

export async function createCartWithItems(items: { variantId: string; quantity: number }[]) {
  const shopifyClient = getClient()
  const mutation = `
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost { totalAmount { amount currencyCode } }
        }
        userErrors { field message }
      }
    }
  `
  const { data } = await shopifyClient.request(mutation, {
    variables: {
      lines: items.map((item) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      })),
    },
  })
  const cart = data?.cartCreate?.cart
  const errors = data?.cartCreate?.userErrors
  if (errors?.length) {
    throw new Error(errors.map((e: { message: string }) => e.message).join('; '))
  }
  return cart
}
