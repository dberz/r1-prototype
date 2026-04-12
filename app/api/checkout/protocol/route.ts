import { NextResponse } from 'next/server'
import { createCartWithItems } from '@/lib/shopify/client'
import { getProtocolCartLines } from '@/lib/protocol-checkout'

type Body = {
  protocolLevel: 'L1' | 'L2' | 'L3'
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON.' }, { status: 400 })
  }

  if (!body.protocolLevel || !['L1', 'L2', 'L3'].includes(body.protocolLevel)) {
    return NextResponse.json({ ok: false, message: 'Invalid protocol level.' }, { status: 400 })
  }

  const lines = getProtocolCartLines(body.protocolLevel)
  if (lines.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Protocol starter SKUs are not configured. Set PROTOCOL_VARIANT_IDS_L1, _L2, _L3 in .env (comma-separated Shopify variant GIDs).',
      },
      { status: 503 }
    )
  }

  try {
    const cart = await createCartWithItems(lines)
    if (!cart?.checkoutUrl) {
      return NextResponse.json({ ok: false, message: 'Could not create checkout.' }, { status: 502 })
    }
    return NextResponse.json({ ok: true, checkoutUrl: cart.checkoutUrl, cartId: cart.id })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Checkout failed.'
    return NextResponse.json({ ok: false, message }, { status: 502 })
  }
}
