import type { CSSProperties } from 'react';
import HomePage from '@/components/home/HomePage';
// Fonts are bundled (self-hosted) so builds never depend on reaching Google Fonts.
import '@fontsource/syne/600.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';

const fonts = { '--font-display': "'Syne', system-ui, sans-serif" } as CSSProperties;

export default function Page() {
  return (
    <div style={fonts}>
      <HomePage />
    </div>
  );
}
