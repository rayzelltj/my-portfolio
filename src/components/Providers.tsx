'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Wraps the app so all Framer Motion animations automatically respect the
 * user's `prefers-reduced-motion` setting (transforms are dropped, opacity
 * kept). CSS-based motion is handled separately in globals.css.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
