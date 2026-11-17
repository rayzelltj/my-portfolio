import type { Metadata } from 'next';

// Design explorations: reachable by link, kept out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
