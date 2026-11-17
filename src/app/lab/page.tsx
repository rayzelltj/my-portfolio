import type { Metadata } from 'next';
import Link from 'next/link';
import s from './lab.module.css';

export const metadata: Metadata = { title: 'Design lab' };

const directions = [
  {
    href: '/lab/deep',
    name: 'Deep Water',
    mood: 'Calm on the surface, a lot going on underneath. Your rows of work settle out of chaos, a review pass sweeps through them, and the water answers your cursor.',
    palette: ['#040B1C', '#0A1A3A', '#2450FF', '#5B8CFF', '#E3ECFF'],
    tech: 'three.js particles, GSAP, Lenis',
  },
  {
    href: '/lab/glacier',
    name: 'Glacier',
    mood: 'Light, editorial and sure of itself. The type is the hero: letters thicken under your cursor, and one pinned scene squeezes hours into minutes.',
    palette: ['#F3F6FA', '#DCE5F0', '#56657A', '#0A1F44', '#1746D8'],
    tech: 'Variable font, GSAP ScrollTrigger, Lenis',
  },
  {
    href: '/lab/signal',
    name: 'Signal',
    mood: 'Cinematic, like a launch film. Flowing blue silk lit by your cursor, a statement that brightens as you read, and work that slides past sideways.',
    palette: ['#03081A', '#0A1E7A', '#1F3BFF', '#3D7BFF', '#D6E4FF'],
    tech: 'GLSL shader, GSAP SplitText, horizontal scroll',
  },
];

export default function Lab() {
  return (
    <div className={`lab-root ${s.page}`}>
      <h1 className={s.title}>Three blue directions for your portfolio</h1>
      <p className={s.lede}>Same content, three moods. Open each one, move your mouse around and scroll all the way down.</p>
      <div className={s.grid}>
        {directions.map((d) => (
          <Link key={d.href} href={d.href} className={s.card}>
            <div className={s.swatches}>
              {d.palette.map((c) => (
                <span key={c} style={{ background: c }} title={c} />
              ))}
            </div>
            <h2 className={s.name}>{d.name}</h2>
            <p className={s.mood}>{d.mood}</p>
            <p className={s.tech}>{d.tech}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
