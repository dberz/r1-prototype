import { SiteChrome } from '@/components/layout/SiteChrome'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
