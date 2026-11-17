import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Signal from './Signal';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/instrument-sans';

export const metadata: Metadata = { title: 'Signal | Design lab' };

const fonts = {
  '--font-display': "'Instrument Serif', Georgia, serif",
  '--font-body': "'Instrument Sans Variable', system-ui, sans-serif",
} as CSSProperties;

export default function Page() {
  return (
    <div className="lab-root" style={fonts}>
      <Signal />
    </div>
  );
}
