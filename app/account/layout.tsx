import { SiteChrome } from '@/components/layout/SiteChrome'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
