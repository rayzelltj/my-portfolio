import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Glacier from './Glacier';
import '@fontsource-variable/bricolage-grotesque/standard.css'; // weight, width and optical-size axes

export const metadata: Metadata = { title: 'Glacier | Design lab' };

const fonts = { '--font-display': "'Bricolage Grotesque Variable', system-ui, sans-serif" } as CSSProperties;

export default function Page() {
  return (
    <div className="lab-root" style={fonts}>
      <Glacier />
    </div>
  );
}
