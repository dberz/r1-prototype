import { SiteChrome } from '@/components/layout/SiteChrome'

export default async function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
