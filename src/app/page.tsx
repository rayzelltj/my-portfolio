import type { CSSProperties } from 'react';
import HomePage from '@/components/home/HomePage';
// Fonts are bundled (self-hosted) so builds never depend on reaching Google Fonts.
import '@fontsource-variable/archivo/wdth.css'; // weight + width axes, for the condensed display type
import '@fontsource-variable/figtree';

const fonts = {
  '--font-display': "'Archivo Variable'",
  '--font-body': "'Figtree Variable'",
} as CSSProperties;

export default function Page() {
  return (
    <div style={fonts}>
      <HomePage />
    </div>
  );
}
