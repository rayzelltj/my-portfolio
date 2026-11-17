import type { Metadata } from 'next';
import { Syne } from 'next/font/google';
import DeepWater from './DeepWater';

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });

export const metadata: Metadata = { title: 'Deep Water | Design lab' };

export default function Page() {
  return (
    <div className={`lab-root ${syne.variable}`}>
      <DeepWater />
    </div>
  );
}
