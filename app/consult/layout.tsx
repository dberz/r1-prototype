import { SiteChrome } from '@/components/layout/SiteChrome'

export default async function ConsultLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
