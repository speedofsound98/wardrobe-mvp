import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Saved outfits' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
