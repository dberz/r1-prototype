import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

export async function SiteChrome({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader userEmail={user?.email ?? null} />
      {/* `min-h-0` + `relative` keeps main content in normal flex flow so hero layers can’t cover chrome */}
      <div className="relative z-0 min-h-0 flex-1">{children}</div>
      <SiteFooter userEmail={user?.email ?? null} />
    </div>
  )
}
