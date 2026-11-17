import type { Metadata } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import Signal from './Signal';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display' });
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = { title: 'Signal | Design lab' };

export default function Page() {
  return (
    <div className={`lab-root ${serif.variable} ${sans.variable}`}>
      <Signal />
    </div>
  );
}
