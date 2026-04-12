import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true, message: 'AI API placeholder (server-side only)' })
}

export async function POST() {
  return NextResponse.json({ ok: true, message: 'AI API placeholder (server-side only)' })
}
