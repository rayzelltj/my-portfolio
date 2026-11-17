import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import Glacier from './Glacier';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-display',
});

export const metadata: Metadata = { title: 'Glacier | Design lab' };

export default function Page() {
  return (
    <div className={`lab-root ${bricolage.variable}`}>
      <Glacier />
    </div>
  );
}
