'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SmoothScroll, { prefersReducedMotion } from '../_shared/SmoothScroll';
import { about, mer, person, projects, tagline } from '../_shared/content';
import { fieldState } from './state';
import { portraitState } from '@/components/home/state';

const PHOTO_COLOR = [
  { name: 'Blue', value: 0 },
  { name: 'Soft', value: 0.45 },
  { name: 'Full', value: 1 },
];
import s from './deep.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Field = dynamic(() => import('./Field'), { ssr: false });
const Portrait = dynamic(() => import('./Portrait'), { ssr: false });

const LIFE = ['img_5998', 'img_6217', 'img_1573', 'img_6245'];

// Candidate accents: one warm or electric colour against the blues.
const ACCENTS = [
  { name: 'Neon pear', hex: '#D7FF3D' },
  { name: 'Mandarin', hex: '#FF6B2C' },
  { name: 'Magenta', hex: '#FF3D9A' },
  { name: 'Sun', hex: '#FFC83D' },
  { name: 'All blue', hex: '#E3ECFF' },
];

export default function DeepWater() {
  const [reduced, setReduced] = useState(false);
  const [accent, setAccent] = useState(ACCENTS[0].hex);
  const [photoColor, setPhotoColor] = useState(1);
  useEffect(() => {
    portraitState.trueColor = photoColor;
  }, [photoColor]);
  useEffect(() => {
    fieldState.accent = accent;
  }, [accent]);
  const hero = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const heroRow = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rm = prefersReducedMotion();
    setReduced(rm);
    if (rm) {
      fieldState.settle = 1;
      portraitState.progress = 1;
      gsap.set(name.current, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // One orchestrated moment: the water settles into rows as the name rises out of it.
      const split = SplitText.create(name.current, { type: 'lines,chars', mask: 'lines' });
      gsap.set(name.current, { autoAlpha: 1 });
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(fieldState, { settle: 0 }, { settle: 1, duration: 3.4, ease: 'power2.inOut' }, 0)
        .from(split.chars, { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.03 }, 1.0)
        .from(heroRow.current, { autoAlpha: 0, y: 14, duration: 1.1, ease: 'power2.out' }, 1.8);

      // Scrolling past the hero breaks the rows apart into drifting particles.
      gsap.fromTo(fieldState, { scroll: 0, dim: 1 }, {
        scroll: 1,
        dim: 0.45,
        ease: 'none',
        scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // Your portrait gathers out of the drifting particles as About scrolls into view.
      gsap.fromTo(portraitState, { progress: 0 }, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: aboutRef.current, start: 'top 90%', end: 'top 20%', scrub: 1 },
      });

      // The photo strip drifts sideways a little as it passes.
      gsap.fromTo(strip.current, { xPercent: 4 }, {
        xPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: strip.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={s.page} style={{ '--accent': accent } as React.CSSProperties}>
      <SmoothScroll />
      <div className={s.switcher} role="radiogroup" aria-label="Accent colour">
        {ACCENTS.map((a) => (
          <button
            key={a.hex}
            type="button"
            role="radio"
            aria-checked={accent === a.hex}
            aria-label={a.name}
            title={a.name}
            className={s.swatch}
            style={{ background: a.hex }}
            onClick={() => setAccent(a.hex)}
          />
        ))}
        <span className={s.switchLabel}>Portrait colour</span>
        {PHOTO_COLOR.map((c) => (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={photoColor === c.value}
            className={s.textSwitch}
            onClick={() => setPhotoColor(c.value)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className={s.canvas} aria-hidden>
        <Field reduced={reduced} />
      </div>

      <nav className={s.nav}>
        <a href="#top" className={s.mark}>{person.name}</a>
        <div className={s.links}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" ref={hero} className={s.hero}>
        <h1 ref={name} className={s.name}>
          Rayzell
          <br />
          Tjandra
        </h1>
        <div ref={heroRow} className={s.heroRow}>
          <p className={s.lede}>
            {tagline} From the first messy problem to the version they use every day.
          </p>
          <p className={s.role}>Software engineer, CS and Management at UBC</p>
        </div>
      </section>

      <section id="work" className={s.section}>
        <h2 className={s.h2}>Selected work</h2>
        <article className={s.feature}>
          <div className={s.featureText}>
            <h3 className={s.h3}>{mer.title}</h3>
            <p className={s.body}>{mer.summary}</p>
            <a className={s.cta} href={mer.href}>Read the case study</a>
          </div>
          <dl className={s.facts}>
            {mer.facts.map((f) => (
              <div key={f.label} className={s.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <ul className={s.list}>
          {projects.map((p) => (
            <li key={p.title}>
              <a href={p.href} target="_blank" rel="noreferrer" className={s.row}>
                <span className={s.rowTitle}>{p.title}</span>
                <span className={s.rowKind}>{p.kind}</span>
                <span className={s.rowLine}>{p.line}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="about" ref={aboutRef} className={s.section}>
        <h2 className={s.h2}>About</h2>
        <div className={s.aboutGrid}>
          <div className={s.portrait} role="img" aria-label="Portrait of Rayzell drawn in glowing particles">
            <Portrait reduced={reduced} />
          </div>
          <p className={s.aboutText}>{about}</p>
        </div>

        <div className={s.lifeWrap}>
          <div ref={strip} className={s.life}>
            {LIFE.map((id) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={id}
                src={`/images/life/${id}.webp`}
                alt="Latte art poured by Rayzell"
                className={s.lifePhoto}
                loading="lazy"
              />
            ))}
          </div>
          <p className={s.lifeCaption}>Latte art I&apos;ve poured. I&apos;m a big foodie too.</p>
        </div>
      </section>

      <section id="contact" className={`${s.section} ${s.contact}`}>
        <h2 className={s.h2}>Contact</h2>
        <a className={s.email} href={`mailto:${person.email}`}>{person.email}</a>
        <div className={s.socials}>
          <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </section>
    </div>
  );
}
