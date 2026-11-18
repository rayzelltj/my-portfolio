import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import CaseStudy from './CaseStudy';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/figtree';

const description =
  'How I built MERvin, an AI agent that cut month-end accounting reviews from 3–4 hours to 20–30 minutes for 46 accountants. Built solo during an eight-month co-op.';

export const metadata: Metadata = {
  title: 'MERvin case study | Rayzell Tjandra',
  description,
  openGraph: { type: 'article', title: 'MERvin case study', description },
};

const fonts = { '--font-display': "'Archivo Variable'", '--font-body': "'Figtree Variable'" } as CSSProperties;

export default function Page() {
  return (
    <div style={fonts}>
      <CaseStudy />
    </div>
  );
}
