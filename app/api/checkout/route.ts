import { NextResponse } from 'next/server'
import { createCartWithItems } from '@/lib/shopify/client'

type Body = {
  lines: { variantId: string; quantity: number }[]
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON.' }, { status: 400 })
  }

  if (!body.lines?.length) {
    return NextResponse.json({ ok: false, message: 'No line items.' }, { status: 400 })
  }

  try {
    const cart = await createCartWithItems(body.lines)
    if (!cart?.checkoutUrl) {
      return NextResponse.json({ ok: false, message: 'Could not create checkout.' }, { status: 502 })
    }
    return NextResponse.json({
      ok: true,
      checkoutUrl: cart.checkoutUrl,
      cartId: cart.id,
      totalQuantity: cart.totalQuantity,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Checkout failed.'
    return NextResponse.json({ ok: false, message }, { status: 502 })
  }
}
