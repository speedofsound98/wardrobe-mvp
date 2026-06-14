import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Pick an outfit' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
