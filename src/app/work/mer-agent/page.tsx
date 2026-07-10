import type { Metadata } from 'next';
import CaseStudy from './CaseStudy';

export const metadata: Metadata = {
  title: 'MER Review Agent — Case Study | Rayzell Tjandra',
  description:
    'A production AI agent that automates month-end balance-sheet review for a 270+-client accounting firm — cutting per-client review ~90% (hours to minutes). Built solo during an 8-month co-op.',
};

export default function Page() {
  return <CaseStudy />;
}
