import HomePage from '@/components/home/HomePage';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });

export default function Page() {
  return (
    <div className={syne.variable}>
      <HomePage />
    </div>
  );
}
