import { SiteChrome } from '@/components/layout/SiteChrome'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
