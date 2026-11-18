'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { person } from '@/components/home/content';
import { decisions, intro, learned, problem, stack, stats, testing } from './content';
import s from './case.module.css';

/** Fades blocks in as they scroll into view; everything is visible without JS. */
function useReveal(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]');
    items.forEach((item) => item.classList.add(s.hidden));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove(s.hidden);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, [root]);
}

export default function CaseStudy() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className={`immersive ${s.page}`}>
      <nav className={s.nav} aria-label="Main">
        <Link href="/" className={s.mark}>{person.name}</Link>
        <div className={s.links}>
          <Link href="/#work" className={s.hideSmall}>Work</Link>
          <Link href="/#experience" className={s.hideSmall}>Experience</Link>
          <Link href="/#contact" className={s.pill}>Get in touch</Link>
        </div>
      </nav>

      <article className={s.wrap}>
        <Link href="/#work" className={s.back}>← Back to the homepage</Link>

        <header className={s.head}>
          <p className={s.eyebrow}>{intro.eyebrow}</p>
          <h1 className={s.title}>MERvin</h1>
          <p className={s.lede}>{intro.lede}</p>
        </header>

        <section className={s.stats} aria-label="Impact" data-reveal>
          {stats.map((st) => (
            <div key={st.label} className={s.stat}>
              <span className={s.statValue}>
                {st.to ? (
                  <>
                    <span className={s.statWas}>{st.value}</span> {st.to}
                  </>
                ) : (
                  st.value
                )}
              </span>
              <span className={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </section>

        <section className={s.row} data-reveal>
          <h2 className={s.label}>The problem</h2>
          <p className={s.body}>{problem}</p>
        </section>

        <section className={s.decisionsHead} data-reveal>
          <h2 className={s.display}>Decisions worth explaining</h2>
        </section>

        <ol className={s.decisions}>
          {decisions.map((d, i) => (
            <li key={d.title} className={s.decision} data-reveal>
              <span className={s.num} aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className={s.decisionTitle}>{d.title}</h3>
                <p className={s.body}>{d.body}</p>
                <dl className={s.notes}>
                  <div>
                    <dt>Why it mattered</dt>
                    <dd>{d.why}</dd>
                  </div>
                  <div>
                    <dt>{d.resultLabel ?? 'Result'}</dt>
                    <dd>{d.result}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>

        <section className={s.row} data-reveal>
          <h2 className={s.label}>Testing</h2>
          <div className={s.body}>
            {testing.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </section>

        <section className={s.row} data-reveal>
          <h2 className={s.label}>What I took from it</h2>
          <p className={s.body}>{learned}</p>
        </section>

        <section className={s.row} data-reveal>
          <h2 className={s.label}>Built with</h2>
          <ul className={s.chips}>
            {stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className={s.next} data-reveal>
          <p>Want to talk about it?</p>
          <div className={s.nextActions}>
            <a href={`mailto:${person.email}`} className={s.pill}>Email me</a>
            <Link href="/#work">See more projects</Link>
          </div>
        </section>
      </article>

      <footer className={s.footer}>
        <span>© {new Date().getFullYear()} {person.name}</span>
        <span>{person.email}</span>
      </footer>
    </div>
  );
}
