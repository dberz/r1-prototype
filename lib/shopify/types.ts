export type ShopifyMoney = { amount: string; currencyCode: string }

export type ShopifyVariant = {
  id: string
  title: string
  price: ShopifyMoney
  availableForSale: boolean
}

export type ShopifyProductNode = {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  priceRange: { minVariantPrice: ShopifyMoney }
  images: { edges: { node: { url: string; altText: string | null } }[] }
  variants: { edges: { node: ShopifyVariant }[] }
}
