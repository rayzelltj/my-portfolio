import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Design explorations: available locally and on preview deploys, never in production.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === 'production') notFound();
  return children;
}
