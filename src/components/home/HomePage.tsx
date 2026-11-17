'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SmoothScroll, { prefersReducedMotion } from './SmoothScroll';
import { about, experience, hero, life, mervin, person, projects } from './content';
import { ACCENT, fieldState, portraitState } from './state';
import s from './home.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Field = dynamic(() => import('./Field'), { ssr: false });
const PortraitDissolve = dynamic(() => import('./PortraitDissolve'), { ssr: false });

export default function HomePage() {
  const [reduced, setReduced] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const heroRow = useRef<HTMLDivElement>(null);
  const compress = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLSpanElement>(null);
  const after = useRef<HTMLSpanElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rm = prefersReducedMotion();
    setReduced(rm);

    const ctx = gsap.context(() => {
      gsap.set(name.current, { autoAlpha: 1 });

      if (rm) {
        fieldState.settle = 1;
        portraitState.progress = 1;
        gsap.set(bar.current, { scaleX: 0.09, backgroundColor: ACCENT });
        gsap.set(before.current, { autoAlpha: 0 });
        gsap.set([after.current, caption.current], { autoAlpha: 1 });
        return;
      }

      // Load: the water settles into rows as the name rises out of it.
      const split = SplitText.create(name.current, { type: 'lines,chars', mask: 'lines' });
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(fieldState, { settle: 0 }, { settle: 1, duration: 3.4, ease: 'power2.inOut' }, 0)
        .fromTo(split.chars, { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.03 }, 1.0)
        .fromTo(heroRow.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 1.8);

      // Leaving the hero breaks the rows into drifting particles.
      gsap.fromTo(fieldState, { scroll: 0, dim: 1 }, {
        scroll: 1,
        dim: 0.45,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // MERvin's impact: hours squeeze into minutes while the scene is pinned.
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: compress.current, start: 'top top', end: '+=160%', pin: true, scrub: 0.6 },
        })
        .to({}, { duration: 0.15 })
        .to(bar.current, { scaleX: 0.09, backgroundColor: ACCENT, duration: 1, ease: 'power2.inOut' })
        .to(before.current, { autoAlpha: 0, filter: 'blur(14px)', scaleX: 0.55, duration: 0.55 }, '<0.1')
        .fromTo(after.current, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '<0.35')
        .fromTo(caption.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, '>-0.1')
        .to({}, { duration: 0.3 });

      // The portrait gathers out of the particles as About comes into view.
      gsap.fromTo(portraitState, { progress: 0 }, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: aboutRef.current, start: 'top 90%', end: 'top 20%', scrub: 1 },
      });

      gsap.fromTo(strip.current, { xPercent: 4 }, {
        xPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: strip.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={`immersive ${s.page}`} style={{ '--accent': ACCENT } as React.CSSProperties}>
      <SmoothScroll />
      <noscript>
        <style>{`.${s.name}{visibility:visible!important}.${s.after},.${s.caption}{visibility:visible!important}.${s.before}{display:none}`}</style>
      </noscript>
      <div className={s.canvas} aria-hidden>
        <Field reduced={reduced} />
      </div>

      <nav className={s.nav} aria-label="Main">
        <a href="#top" className={s.mark} aria-label={person.name}>
          <span className={s.markFull}>{person.name}</span>
          <span className={s.markShort} aria-hidden>RT</span>
        </a>
        <div className={s.links}>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div>
        <section id="top" ref={heroRef} className={s.hero}>
          <h1 ref={name} className={s.name}>
            Rayzell
            <br />
            Tjandra
          </h1>
          <div ref={heroRow} className={s.heroRow}>
            <p className={s.lede}>{hero.lede}</p>
            <p className={s.role}>{hero.role}</p>
          </div>
        </section>

        <section id="work" className={s.section}>
          <h2 className={s.h2}>Selected work</h2>
          <article className={s.feature}>
            <div>
              <p className={s.kind}>{mervin.kind}</p>
              <h3 className={s.h3}>{mervin.title}</h3>
              <p className={s.body}>{mervin.summary}</p>
              <Link className={s.cta} href={mervin.href}>Read the case study</Link>
            </div>
            <dl className={s.facts}>
              {mervin.facts.map((f) => (
                <div key={f.label} className={s.fact}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </section>

        <section ref={compress} className={s.compress} aria-label="MERvin review time, before and after">
          <div className={s.compressInner}>
            <p className={s.kicker}>One month-end review, before and after MERvin</p>
            <div className={s.times}>
              <span ref={before} className={s.before}>{mervin.before}</span>
              <span ref={after} className={s.after}>{mervin.after}</span>
            </div>
            <div className={s.track}>
              <div ref={bar} className={s.bar}>
                {[1, 2, 3].map((i) => (
                  <span key={i} className={s.tick} style={{ left: `${i * 25}%` }} />
                ))}
              </div>
            </div>
            <p ref={caption} className={s.caption}>{mervin.caption}</p>
          </div>
        </section>

        <section className={s.section} aria-labelledby="more-projects">
          <h2 id="more-projects" className={s.h2}>More projects</h2>
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

        <section id="experience" className={s.section}>
          <h2 className={s.h2}>Experience</h2>
          <ol className={s.timeline}>
            {experience.map((e) => (
              <li key={e.role + e.org} className={s.job}>
                <span className={s.jobDate}>{e.date}</span>
                <div>
                  <h3 className={s.jobRole}>{e.role}</h3>
                  <p className={s.jobOrg}>{e.org}</p>
                </div>
                <p className={s.jobLine}>{e.line}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" ref={aboutRef} className={s.section}>
          <h2 className={s.h2}>About</h2>
          <div className={s.aboutGrid}>
            <div className={s.portrait} role="img" aria-label="Photo of Rayzell">
              <PortraitDissolve reduced={reduced} />
            </div>
            <p className={s.aboutText}>{about}</p>
          </div>
          <div className={s.lifeWrap}>
            <div ref={strip} className={s.life}>
              {life.photos.map((id) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={id} src={`/images/life/${id}.webp`} alt="Latte art poured by Rayzell" className={s.lifePhoto} loading="lazy" />
              ))}
            </div>
            <p className={s.lifeCaption}>{life.caption}</p>
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

      <footer className={s.footer}>
        <span>© {new Date().getFullYear()} {person.name}</span>
        <span>Built with Next.js, three.js and GSAP</span>
      </footer>
    </div>
  );
}
