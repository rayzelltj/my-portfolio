import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import DeepWater from './DeepWater';
import '@fontsource/syne/600.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';

export const metadata: Metadata = { title: 'Deep Water | Design lab' };

const fonts = { '--font-display': "'Syne', system-ui, sans-serif" } as CSSProperties;

export default function Page() {
  return (
    <div className="lab-root" style={fonts}>
      <DeepWater />
    </div>
  );
}
