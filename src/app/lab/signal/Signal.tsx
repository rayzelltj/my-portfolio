'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SmoothScroll, { prefersReducedMotion } from '../_shared/SmoothScroll';
import { mer, person, projects } from '../_shared/content';
import { silkState } from './state';
import s from './signal.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Silk = dynamic(() => import('./Silk'), { ssr: false });

const STATEMENT =
  "Good software disappears into someone's day. I care about the whole path there: understanding the problem, designing how it feels, and building it to hold up when people depend on it.";

export default function Signal() {
  const [reduced, setReduced] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const heroSide = useRef<HTMLDivElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const work = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rm = prefersReducedMotion();
    setReduced(rm);
    gsap.set(name.current, { autoAlpha: 1 });
    if (rm) {
      silkState.intro = 1;
      return;
    }

    const ctx = gsap.context(() => {
      // Load: the silk is lit up from darkness while the name rises.
      const split = SplitText.create(name.current, { type: 'lines', mask: 'lines' });
      gsap
        .timeline({ delay: 0.1 })
        .fromTo(silkState, { intro: 0 }, { intro: 1, duration: 2.6, ease: 'power2.inOut' }, 0)
        .from(split.lines, { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.12 }, 0.7)
        .from(heroSide.current, { autoAlpha: 0, y: 14, duration: 1, ease: 'power2.out' }, 1.3);

      // The silk sinks and dims as you leave the hero.
      gsap.to(canvasWrap.current, {
        yPercent: 22,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // Statement words brighten one by one as you read down.
      const words = SplitText.create(statement.current, { type: 'words' }).words;
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: statement.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      );

      // Work panels travel sideways while the section is pinned (wide screens only).
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: work.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={s.page}>
      <SmoothScroll />
      <nav className={s.nav}>
        <a href="#top" className={s.mark}>Rayzell Tjandra</a>
        <div className={s.links}>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" ref={hero} className={s.hero}>
        <div ref={canvasWrap} className={s.canvas} aria-hidden>
          <Silk reduced={reduced} />
        </div>
        <div className={s.heroContent}>
          <h1 ref={name} className={s.name}>
            Rayzell
            <br />
            <em>Tjandra</em>
          </h1>
          <div ref={heroSide} className={s.heroSide}>
            <p>Software engineer who takes ideas from the problem all the way to production.</p>
            <p className={s.muted}>CS and Management, UBC. Previously Optimus.</p>
          </div>
        </div>
      </section>

      <section className={s.statementWrap}>
        <p ref={statement} className={s.statement}>{STATEMENT}</p>
      </section>

      <section id="work" ref={work} className={s.work}>
        <div ref={track} className={s.track}>
          <div className={s.workIntro}>
            <h2 className={s.h2}>Selected work</h2>
            <p className={s.muted}>Scroll to move through it.</p>
          </div>

          <article className={`${s.panel} ${s.panelFeature}`}>
            <h3 className={s.panelTitle}>{mer.title}</h3>
            <p className={s.panelBody}>{mer.summary}</p>
            <div className={s.compare}>
              <div>
                <span className={s.muted}>Before</span>
                <strong>{mer.before}</strong>
              </div>
              <div>
                <span className={s.muted}>After</span>
                <strong>{mer.after}</strong>
              </div>
            </div>
            <a href={mer.href} className={s.panelLink}>Read the case study</a>
          </article>

          {projects.map((p) => (
            <article key={p.title} className={s.panel}>
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={`${p.title} screenshot`} className={s.panelImage} />
              ) : (
                <div className={s.panelArt} aria-hidden />
              )}
              <p className={s.muted}>{p.kind}</p>
              <h3 className={s.panelTitle}>{p.title}</h3>
              <p className={s.panelBody}>{p.line}</p>
              <a href={p.href} target="_blank" rel="noreferrer" className={s.panelLink}>View project</a>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className={s.contact}>
        <h2 className={s.contactLine}>
          Building something that has to be <em>right</em>? Let&apos;s talk.
        </h2>
        <div className={s.socials}>
          <a href={`mailto:${person.email}`} className={s.button}>Email me</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </section>
    </div>
  );
}
