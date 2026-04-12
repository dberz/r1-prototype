'use server'

import { createClient } from '@/lib/supabase/server'
import { getAppOrigin } from '@/lib/site-url'
import { redirect } from 'next/navigation'

export async function signInWithOtp(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const next = formData.get('next')?.toString() || '/account'
  const safeNext = next.startsWith('/') ? next : '/account'

  if (!email) {
    redirect('/login?error=missing_email')
  }

  const supabase = await createClient()
  const origin = getAppOrigin()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?check_email=1')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
