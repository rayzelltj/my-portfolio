'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const stats = [
  { value: '~90%', label: 'Faster per-client review' },
  { value: '3–4h → 10–20m', label: 'Time per client' },
  { value: '14', label: 'Accountants using it' },
  { value: '270+', label: 'Clients served' },
];

const decisions = [
  {
    n: '01',
    title: 'Deterministic rule logic, not "let the LLM decide."',
    body: [
      'Each of the 36 balance-sheet / P&L checks is a pure, side-effect-free function: the same RuleContext in, the same PASS / FAIL / WARN out, with cited evidence. The LLM is used upstream to extract and match evidence from documents (deterministic-first, with an LLM-fallback matcher), but the verdict is always computed by deterministic code — and when a value came from the LLM-fallback path, the rule tags it so a reviewer knows.',
    ],
    why: 'Financial review must be reproducible and auditable; an accountant has to trace exactly why a rule fired.',
    tradeoff: 'More upfront engineering per rule, in exchange for trust and testability.',
  },
  {
    n: '02',
    title: 'A multi-extractor pipeline with a reconciliation firewall.',
    body: [
      'Documents (bank statements, working papers) are parsed by Azure Document Intelligence as the primary extractor, then cross-checked against an LLM + vision cascade. A firewall reconciles them: accept on agreement, fall back on low confidence, and flag genuine disagreements for human review instead of silently guessing.',
    ],
    why: 'A single extractor fails silently on messy real-world PDFs; cross-validation turns silent errors into visible flags.',
    tradeoff: 'This drove document-matching false positives from 5.56% to 0%.',
    tradeoffLabel: 'Result',
  },
  {
    n: '03',
    title: 'Grounding / hallucination guarding.',
    body: [
      'Extracted values are tied back to real evidence in the source documents before a rule can rely on them, so the agent surfaces "couldn\'t find support for X" rather than inventing a plausible number.',
    ],
    why: 'In finance, a confident wrong answer is worse than an honest "needs review."',
  },
];

const techStack = [
  'Python',
  'FastAPI',
  'Azure OpenAI',
  'Microsoft Agent Framework',
  'Azure Document Intelligence',
  'React',
  'TypeScript',
];

function Section({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={`max-w-3xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent"
    >
      {children}
    </motion.p>
  );
}

export default function CaseStudy() {
  return (
    <article className="py-16 sm:py-24">
      {/* Back link */}
      <div className="max-w-3xl mx-auto mb-10">
        <Link
          href="/#projects"
          prefetch={false}
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors"
        >
          <FaArrowLeft size={11} />
          Back to projects
        </Link>
      </div>

      {/* Hero */}
      <Section>
        <SectionLabel>Case Study · Optimus co-op</SectionLabel>
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
        >
          MER Review Agent
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-lg text-muted leading-relaxed"
        >
          A production AI agent that automates the month-end balance-sheet review
          accountants do for each client — reconciling the books against dozens of
          rules and supporting documents. It cut per-client review from 3–4 hours to
          10–20 minutes and is used by 14 accountants across a 270+-client Canadian
          accounting firm. Built solo during an 8-month co-op.
        </motion.p>
      </Section>

      {/* Impact stats */}
      <Section className="mt-14">
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-subtle bg-subtle"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 p-5 bg-surface"
            >
              <span className="font-mono text-xl sm:text-2xl font-semibold text-accent">
                {s.value}
              </span>
              <span className="text-xs text-muted leading-snug">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* The problem */}
      <Section className="mt-20">
        <SectionLabel>The problem</SectionLabel>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold mb-5 text-fg">
          Manual, repetitive, easy to do inconsistently
        </motion.h2>
        <motion.p variants={fadeUp} className="text-lg text-muted leading-relaxed">
          Every month, an accountant manually checks each client&apos;s balance sheet
          against a long list of rules (do the bank statements reconcile? are clearing
          accounts zero? do subledgers match the GL?), hunting through supporting
          documents for evidence. It&apos;s slow, repetitive, and easy to do
          inconsistently across a large client base.
        </motion.p>
      </Section>

      {/* Architecture — deferred placeholder (do NOT invent diagrams) */}
      <Section className="mt-20">
        <SectionLabel>Architecture</SectionLabel>
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-dashed border-subtle bg-surface/40 p-10 text-center"
        >
          <p className="font-mono text-sm text-accent mb-2">Architecture — coming soon</p>
          <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
            Accurate architecture diagrams are being prepared and will be added here.
            Placeholder intentionally left empty — no auto-generated diagrams.
          </p>
        </motion.div>
      </Section>

      {/* Design decisions */}
      <Section className="mt-20">
        <SectionLabel>Design decisions</SectionLabel>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold mb-8 text-fg">
          Three decisions worth explaining
        </motion.h2>

        <div className="flex flex-col gap-5">
          {decisions.map((d) => (
            <motion.div
              key={d.n}
              variants={fadeUp}
              className="group rounded-2xl border border-subtle bg-surface p-6 sm:p-7 transition-colors duration-300 hover:border-accent/60"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm text-accent">{d.n}</span>
                <h3 className="text-lg font-semibold text-fg leading-snug">
                  {d.title}
                </h3>
              </div>

              {d.body.map((p, i) => (
                <p key={i} className="text-muted leading-relaxed mb-4">
                  {p}
                </p>
              ))}

              <div className="mt-4 flex flex-col gap-3 border-t border-subtle pt-4">
                <p className="text-sm text-muted leading-relaxed">
                  <span className="font-mono text-xs uppercase tracking-wide text-fg/80 mr-2">
                    Why
                  </span>
                  {d.why}
                </p>
                {d.tradeoff && (
                  <p className="text-sm text-muted leading-relaxed">
                    <span className="font-mono text-xs uppercase tracking-wide text-fg/80 mr-2">
                      {d.tradeoffLabel ?? 'Tradeoff'}
                    </span>
                    {d.tradeoff}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Testing & correctness */}
      <Section className="mt-20">
        <SectionLabel>Testing &amp; correctness</SectionLabel>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold mb-5 text-fg">
          Validated to the number
        </motion.h2>
        <motion.p variants={fadeUp} className="text-lg text-muted leading-relaxed mb-4">
          Validated against a ground-truth suite of real (anonymized) client datasets
          with a{' '}
          <span className="font-mono text-fg">300+</span>-test suite and per-rule cases.
        </motion.p>
        <motion.p variants={fadeUp} className="text-lg text-muted leading-relaxed">
          One representative debugging win: diagnosed from telemetry that an OAuth flow
          was refreshing tokens on{' '}
          <span className="font-mono text-fg">~94%</span> of API calls, and fixed it to
          roughly once per token lifetime — a subtle efficiency / reliability bug
          invisible without tracing.
        </motion.p>
      </Section>

      {/* What I learned */}
      <Section className="mt-20">
        <SectionLabel>What I learned / next</SectionLabel>
        <motion.p variants={fadeUp} className="text-lg text-muted leading-relaxed">
          Shipping software where a wrong number means a wrong financial statement
          changes how you weight correctness vs. speed.
        </motion.p>
      </Section>

      {/* Tech stack footer */}
      <Section className="mt-20">
        <SectionLabel>Built with</SectionLabel>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[0.7rem] px-3 py-1 rounded-full bg-bg-alt text-muted border border-subtle"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </Section>
    </article>
  );
}
