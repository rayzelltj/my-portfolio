'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SmoothScroll, { prefersReducedMotion } from './SmoothScroll';
import { contact, experience, hero, intro, mervin, offKeyboard, person, projects } from './content';
import { ACCENT, fieldState, portraitState } from './state';
import s from './home.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const Field = dynamic(() => import('./Field'), { ssr: false });
const PortraitDissolve = dynamic(() => import('./PortraitDissolve'), { ssr: false });

type Job = (typeof experience.work)[number];

function JobRow({ job }: { job: Job }) {
  return (
    <li className={s.job}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.jobLogo} src={job.logo} alt="" loading="lazy" />
      <div>
        <h4 className={s.jobRole}>{job.role}</h4>
        <p className={s.jobOrg}>
          {job.org} <span className={s.jobDate}>{job.date}</span>
        </p>
        <p className={s.jobLine}>{job.line}</p>
      </div>
    </li>
  );
}

export default function HomePage() {
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const portrait = useRef<HTMLDivElement>(null);
  const heroFoot = useRef<HTMLDivElement>(null);
  const checks = useRef<HTMLUListElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const withBar = useRef<HTMLDivElement>(null);
  const afterLabel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rm = prefersReducedMotion();
    setReduced(rm);

    const ctx = gsap.context(() => {
      gsap.set(name.current, { autoAlpha: 1 });

      if (rm) {
        fieldState.settle = 1;
        portraitState.progress = 1;
        gsap.set(withBar.current, { scaleX: 0.11 });
        return;
      }

      // Load: the water settles, your name rises behind you, and you resolve out of the particles.
      const split = SplitText.create(name.current, { type: 'chars', mask: 'chars' });
      gsap
        .timeline({ delay: 0.1 })
        .fromTo(fieldState, { settle: 0 }, { settle: 1, duration: 3.2, ease: 'power2.inOut' }, 0)
        .fromTo(split.chars, { yPercent: 105 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.035 }, 0.4)
        .fromTo(portraitState, { progress: 0 }, { progress: 1, duration: 2.6, ease: 'power2.out' }, 0.7)
        .fromTo(heroFoot.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 1.6);

      // Leaving the hero: layers move at different speeds for depth; the water breaks apart.
      const leave = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(name.current, { yPercent: 40, ease: 'none', scrollTrigger: leave });
      gsap.to(portrait.current, { yPercent: 8, ease: 'none', scrollTrigger: leave });
      gsap.fromTo(fieldState, { scroll: 0, dim: 1 }, { scroll: 1, dim: 0.45, ease: 'none', scrollTrigger: leave });

      // Section headings slide up out of a mask once, as they arrive.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const lines = SplitText.create(el, { type: 'lines', mask: 'lines' }).lines;
        gsap.from(lines, {
          yPercent: 100,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      // MERvin, what I built: the sample checks run one by one.
      gsap.from(checks.current!.querySelectorAll('li'), {
        autoAlpha: 0,
        x: -14,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.28,
        scrollTrigger: { trigger: checks.current, start: 'top 75%', once: true },
      });

      // MERvin, the result: the "with MERvin" bar shrinks next to the "before" bar.
      gsap
        .timeline({ scrollTrigger: { trigger: result.current, start: 'top 70%', once: true } })
        .fromTo(withBar.current, { scaleX: 1 }, { scaleX: 0.11, duration: 1.8, ease: 'power3.inOut' })
        .fromTo(afterLabel.current, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');

      // Project images ease in with a little parallax.
      gsap.utils.toArray<HTMLElement>(`.${s.projectMedia}`).forEach((el) => {
        gsap.fromTo(el, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`immersive ${s.page}`} style={{ '--accent': ACCENT } as React.CSSProperties}>
      <SmoothScroll />
      <noscript>
        <style>{`.${s.heroName}{visibility:visible!important}`}</style>
      </noscript>
      <div className={s.canvas} aria-hidden>
        <Field reduced={reduced} />
      </div>

      <nav className={s.nav} aria-label="Main">
        <a href="#top" className={s.mark}>{person.name}</a>
        <div className={s.links}>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about" className={s.hideSmall}>About</a>
          <a href="#contact" className={s.pill}>Get in touch</a>
        </div>
      </nav>

      <div>
        {/* Hero: your name behind you, you in front, the water underneath */}
        <section id="top" ref={heroRef} className={s.hero}>
          <h1 ref={name} className={s.heroName} aria-label={person.name}>
            <span>Rayzell</span> <span>Tjandra</span>
          </h1>
          <div ref={portrait} className={s.heroPortrait} role="img" aria-label="Photo of Rayzell">
            <PortraitDissolve reduced={reduced} />
          </div>
          <div ref={heroFoot} className={s.heroFoot}>
            <p className={s.heroLede}>{hero.lede}</p>
            <p className={s.heroRole}>{hero.role}</p>
          </div>
        </section>

        <section id="about" className={s.intro}>
          <p className={s.introText} data-reveal>{intro.text}</p>
          <p className={s.introNote}>{intro.note}</p>
        </section>

        {/* MERvin, told as a story: problem, what I built, the result */}
        <section id="work" className={s.section}>
          <header className={s.mervinHead}>
            <p className={s.eyebrow}>Selected work</p>
            <h2 className={`${s.display} ${s.keepCase}`} data-reveal>{mervin.title}</h2>
            <p className={s.mervinSub}>{mervin.subtitle}</p>
          </header>

          <div className={s.chapter}>
            <h3 className={s.chapterLabel}>The problem</h3>
            <p className={s.chapterText}>{mervin.chapters.problem}</p>
          </div>

          <div className={s.chapter}>
            <h3 className={s.chapterLabel}>What I built</h3>
            <div className={s.builtGrid}>
              <p className={s.chapterText}>{mervin.chapters.built}</p>
              <figure className={s.review}>
                <ul ref={checks} className={s.checks}>
                  {mervin.sampleChecks.map((c) => (
                    <li key={c.name} className={s.check}>
                      <span className={s.checkName}>
                        {c.name}
                        {c.note && <small>{c.note}</small>}
                      </span>
                      <span className={`${s.status} ${s['status' + c.status]}`}>{c.status}</span>
                    </li>
                  ))}
                </ul>
                <figcaption>Illustration with sample data</figcaption>
              </figure>
            </div>
          </div>

          <div className={s.chapter}>
            <h3 className={s.chapterLabel}>The result</h3>
            <div ref={result}>
              <p className={s.chapterText}>{mervin.chapters.result}</p>
              <div className={s.bars} role="img" aria-label={`Review time went from ${mervin.before} to ${mervin.after}`}>
                <div className={s.barRow}>
                  <span className={s.barLabel}>Before</span>
                  <div className={s.barTrack}><div className={`${s.bar} ${s.barBefore}`} /></div>
                  <span className={s.barValue}>{mervin.before}</span>
                </div>
                <div className={s.barRow}>
                  <span className={s.barLabel}>With MERvin</span>
                  <div className={s.barTrack}><div ref={withBar} className={`${s.bar} ${s.barAfter}`} /></div>
                  <span ref={afterLabel} className={`${s.barValue} ${s.barValueAccent}`}>{mervin.after}</span>
                </div>
              </div>
              <Link className={s.cta} href={mervin.href}>Read the case study</Link>
            </div>
          </div>
        </section>

        <section className={s.section} aria-labelledby="projects-title">
          <h2 id="projects-title" className={s.display} data-reveal>More projects</h2>
          <div className={s.projects}>
            {projects.map((p, i) => (
              <a key={p.title} href={p.href} target="_blank" rel="noreferrer" className={`${s.project} ${i < 2 ? s.projectWide : ''}`}>
                <div className={s.projectFrame}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={s.projectMedia} src={p.image} alt={`${p.title} screenshot`} loading="lazy" />
                  ) : (
                    <div className={`${s.projectMedia} ${s.projectStamp}`}>{p.stamp}</div>
                  )}
                </div>
                <div className={s.projectMeta}>
                  <h3 className={s.projectTitle}>{p.title}</h3>
                  <span className={s.projectKind}>{p.kind}</span>
                </div>
                <p className={s.projectLine}>{p.line}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="experience" className={s.section}>
          <h2 className={s.display} data-reveal>Experience</h2>
          <div className={s.expGrid}>
            <div>
              <h3 className={s.expGroup}>Work</h3>
              <ul className={s.jobs}>{experience.work.map((j) => <JobRow key={j.role} job={j} />)}</ul>
            </div>
            <div>
              <h3 className={s.expGroup}>Community</h3>
              <ul className={s.jobs}>{experience.community.map((j) => <JobRow key={j.role} job={j} />)}</ul>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.offGrid}`} aria-labelledby="off-title">
          <div>
            <h2 id="off-title" className={s.display} data-reveal>Off the keyboard</h2>
            <p className={s.offText}>{offKeyboard.text}</p>
            <p className={s.offCaption}>{offKeyboard.caption}</p>
          </div>
          <div className={s.mugs}>
            {offKeyboard.photos.map((id) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={id} src={`/images/life/${id}.webp`} alt="Latte art poured by Rayzell" className={s.mug} loading="lazy" />
            ))}
          </div>
        </section>

        <section id="contact" className={`${s.section} ${s.contact}`}>
          <h2 className={s.contactHeadline} data-reveal>{contact.headline}</h2>
          <p className={s.contactText}>{contact.text}</p>
          <div className={s.contactActions}>
            <a className={s.cta} href={`mailto:${person.email}`}>Email me</a>
            <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </section>
      </div>

      <footer className={s.footer}>
        <span>© {new Date().getFullYear()} {person.name}</span>
        <span>{person.email}</span>
      </footer>
    </div>
  );
}
