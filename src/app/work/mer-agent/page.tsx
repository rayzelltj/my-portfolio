import type { Metadata } from 'next';
import CaseStudy from './CaseStudy';

export const metadata: Metadata = {
  title: 'MERvin — Case Study | Rayzell Tjandra',
  description:
    'MERvin, a production AI agent that automates month-end balance-sheet review for an accounting firm with 270+ client companies, cutting each review from 3–4 hours to 20–30 minutes for 46 accountants. Built solo during an 8-month co-op.',
};

export default function Page() {
  return <CaseStudy />;
}
