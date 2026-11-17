'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll, { prefersReducedMotion } from '../_shared/SmoothScroll';
import { about, intro as introText, mer, person, projects } from '../_shared/content';
import s from './glacier.module.css';

gsap.registerPlugin(ScrollTrigger);

const LINES = ['I build software', 'people rely on', 'every day.'];
const BASE_WEIGHT = 340;
const PEAK_WEIGHT = 800;

const rows = [
  { title: mer.title, kind: mer.kind, line: mer.summary, href: mer.href, image: '' },
  ...projects,
];

export default function Glacier() {
  const h1 = useRef<HTMLHeadingElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const compress = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLSpanElement>(null);
  const after = useRef<HTMLSpanElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const preview = useRef<HTMLImageElement>(null);

  // Headline letters thicken as the cursor passes over them.
  useEffect(() => {
    const chars = Array.from(h1.current!.querySelectorAll<HTMLElement>(`.${s.ch}`));
    const weights = chars.map(() => BASE_WEIGHT);
    const apply = (el: HTMLElement, w: number) => (el.style.fontVariationSettings = `'wght' ${w.toFixed(0)}, 'opsz' 96`);
    chars.forEach((el) => apply(el, BASE_WEIGHT));

    const reduced = prefersReducedMotion();
    const canHover = window.matchMedia('(hover: hover)').matches;

    // Context so the entrance is fully reverted on unmount (React runs effects twice in dev).
    const ctx = gsap.context(() => {
      gsap.set(h1.current, { autoAlpha: 1 });
      if (reduced) return;
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(chars, { yPercent: 105 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.022 })
        .fromTo(intro.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.8);
    });
    if (reduced || !canHover) return () => ctx.revert();

    let mx = -9999;
    let my = -9999;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('pointermove', onMove);
    let raf = 0;
    const loop = () => {
      const rects = chars.map((el) => el.getBoundingClientRect());
      rects.forEach((r, i) => {
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const target = BASE_WEIGHT + (PEAK_WEIGHT - BASE_WEIGHT) * Math.max(0, 1 - d / 240) ** 1.6;
        weights[i] += (target - weights[i]) * 0.14;
        apply(chars[i], weights[i]);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ctx.revert();
    };
  }, []);

  // Pinned scene: the hours bar compresses into minutes as you scroll.
  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(bar.current, { scaleX: 0.09, backgroundColor: '#1746D8' });
      gsap.set(before.current, { autoAlpha: 0 });
      gsap.set([after.current, caption.current], { autoAlpha: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: compress.current, start: 'top top', end: '+=170%', pin: true, scrub: 0.6 },
        })
        .to({}, { duration: 0.15 })
        .to(bar.current, { scaleX: 0.09, backgroundColor: '#1746D8', duration: 1, ease: 'power2.inOut' })
        .to(before.current, { autoAlpha: 0, filter: 'blur(14px)', scaleX: 0.55, duration: 0.55 }, '<0.1')
        .fromTo(after.current, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '<0.35')
        .fromTo(caption.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, '>-0.1')
        .to({}, { duration: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  // Project rows reveal a floating preview that trails the cursor.
  useEffect(() => {
    const img = preview.current!;
    const xTo = gsap.quickTo(img, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(img, 'y', { duration: 0.5, ease: 'power3' });
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX + 24);
      yTo(e.clientY - 90);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const showPreview = (src: string) => {
    const img = preview.current!;
    if (!src) return;
    img.src = src;
    gsap.to(img, { autoAlpha: 1, scale: 1, rotate: -2, duration: 0.35, ease: 'power3.out' });
  };
  const hidePreview = () => gsap.to(preview.current, { autoAlpha: 0, scale: 0.92, rotate: 0, duration: 0.25 });

  return (
    <div className={s.page}>
      <SmoothScroll />
      <nav className={s.nav}>
        <a href="#top" className={s.mark}>{person.name}</a>
        <div className={s.links}>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className={s.hero}>
        <h1 ref={h1} className={s.h1} aria-label={LINES.join(' ')}>
          {LINES.map((line) => (
            <span key={line} className={s.line} aria-hidden>
              {Array.from(line).map((c, i) => (
                <span key={i} className={s.ch}>{c === ' ' ? ' ' : c}</span>
              ))}
            </span>
          ))}
        </h1>
        <div ref={intro} className={s.intro}>
          <p>{introText}</p>
          <a href="#work" className={s.scrollCue}>See the work</a>
        </div>
      </section>

      <section ref={compress} className={s.compress} aria-label="Review time before and after the agent">
        <div className={s.compressInner}>
          <p className={s.kicker}>Month-end review, per client</p>
          <div className={s.times}>
            <span ref={before} className={s.before}>{mer.before}</span>
            <span ref={after} className={s.after}>{mer.after}</span>
          </div>
          <div className={s.track}>
            <div ref={bar} className={s.bar}>
              {[1, 2, 3].map((i) => (
                <span key={i} className={s.tick} style={{ left: `${i * 25}%` }} />
              ))}
            </div>
          </div>
          <p ref={caption} className={s.caption}>
            With MERvin, the agent I built as sole engineer at Optimus. About 300 reviews a month for 46 accountants,
            freeing roughly 900 hours.
          </p>
        </div>
      </section>

      <section id="work" className={s.section}>
        <h2 className={s.h2}>Work</h2>
        <ul className={s.list}>
          {rows.map((p) => (
            <li key={p.title}>
              <a
                href={p.href}
                className={s.row}
                onPointerEnter={() => showPreview(p.image)}
                onPointerLeave={hidePreview}
                {...(p.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className={s.rowTitle}>{p.title}</span>
                <span className={s.rowMeta}>
                  <span className={s.rowKind}>{p.kind}</span>
                  <span className={s.rowLine}>{p.line}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={preview} className={s.preview} alt="" aria-hidden />
      </section>

      <section id="about" className={s.section}>
        <h2 className={s.h2}>About</h2>
        <p className={s.aboutText}>{about}</p>
      </section>

      <section id="contact" className={`${s.section} ${s.contact}`}>
        <h2 className={s.h2}>Contact</h2>
        <a className={s.email} href={`mailto:${person.email}`}>Email me</a>
        <div className={s.socials}>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </section>
    </div>
  );
}
