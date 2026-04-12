import { SiteChrome } from '@/components/layout/SiteChrome'

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
