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
  { value: '16', label: 'Accountants using it' },
  { value: '270+', label: 'Clients served' },
];

const decisions = [
  {
    n: '01',
    title: 'Deterministic rule logic, not "let the LLM decide."',
    body: [
      'Each of the 34 balance-sheet / P&L checks is a pure, side-effect-free function: the same RuleContext in, the same PASS / FAIL / WARN out, with cited evidence. Requirements were often ambiguous, so the rules were shaped through a twice-weekly feedback loop with the firm\'s staff accountants and translated into deterministic logic — not left to an LLM to interpret at runtime. The LLM is used upstream to extract and match evidence from documents, but the verdict is always computed by deterministic code.',
    ],
    why: 'Financial review must be reproducible and auditable; an accountant has to trace exactly why a rule fired.',
    tradeoff: 'More upfront engineering per rule, in exchange for trust and testability.',
  },
  {
    n: '02',
    title: 'A multi-extractor evidence pipeline, grounded and reproducible.',
    body: [
      'Documents are parsed by a primary extractor, then cross-checked against a vision-language corroboration pass. Extracted values are tied back to real evidence in the source documents before a rule can rely on them — the agent surfaces "couldn\'t find support for X" rather than inventing a plausible number. The cascade caught real extraction errors, including a $10K digit-drop misread, and routed unresolved mismatches to human review instead of guessing.',
    ],
    why: 'In finance, a confident wrong answer is worse than an honest "needs review" — and a single extractor fails silently on messy real-world documents.',
    tradeoff: 'Made reproducible — byte-identical verdicts across runs — by seeding every model call and pinning temperature to 0.',
    tradeoffLabel: 'Result',
  },
  {
    n: '03',
    title: 'Single-flight admission control for a flaky pipeline.',
    body: [
      'Duplicate review runs and silent 90-second-to-5-minute pipeline hangs were slipping through undetected. Added request de-duplication and a concurrency cap so only one run can be in flight per client, plus a heartbeat watchdog that detects stalls and automatically recovers stuck jobs.',
    ],
    why: 'A finance tool that silently hangs or double-runs erodes trust fast — accountants need to know a review either completed or is visibly still running, never stuck in between.',
    tradeoff: 'Eliminated duplicate runs and made pipeline stalls self-healing instead of requiring a manual restart.',
    tradeoffLabel: 'Result',
  },
  {
    n: '04',
    title: 'A token-refresh bug hiding in plain sight.',
    body: [
      'Telemetry showed the QuickBooks Online (QBO) OAuth flow was refreshing tokens on 94% of API calls (10,770 of 11,410 in a single day) — nearly every request, instead of once per token lifetime. Fixed with a run-scoped token cache and a per-realm lock.',
    ],
    why: 'Invisible without tracing — the pipeline worked, so nothing looked broken. But it was one bad day away from tripping Intuit\'s rate limits and taking down every client\'s review at once.',
    tradeoff: 'Cut redundant refreshes from 94% to ~1% of calls and removed the rate-limit risk entirely.',
    tradeoffLabel: 'Result',
  },
  {
    n: '05',
    title: 'Diagnosing a slow, invisible cost leak.',
    body: [
      'Production Azure costs kept climbing without a clear reason. Traced it to 30+ idle Container App revisions running 24/7 — leftover copies from deploys that were never cleaned up — plus a deployment flaw that risked duplicate processing of the same review.',
    ],
    why: 'Cost leaks like this compound silently for months; nobody notices until the bill does.',
    tradeoff: 'Cut production Azure costs ~36% (~CA$435/mo) and closed the duplicate-processing risk in the same fix.',
    tradeoffLabel: 'Result',
  },
];

const techStack = [
  'Python',
  'FastAPI',
  'Pydantic',
  'Azure OpenAI',
  'Microsoft Agent Framework',
  'Vision-Language Models',
  'Azure Document Intelligence',
  'Azure Container Apps',
  'Azure Container Registry',
  'Docker',
  'Cosmos DB',
  'Azure Blob Storage',
  'Azure Key Vault',
  'Microsoft Entra ID',
  'Azure Application Insights',
  'OpenTelemetry',
  'pytest',
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
          10–20 minutes and is used daily by 16 accountants across a 270+-client
          Canadian accounting firm. Built solo during an 8-month co-op.
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
          Decisions worth explaining
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
          <span className="font-mono text-fg">6,000+</span>-test suite and per-rule cases.
        </motion.p>
        <motion.p variants={fadeUp} className="text-lg text-muted leading-relaxed">
          A shadow-comparator harness re-runs every rule change against the full
          benchmark fleet before it ships —{' '}
          <span className="font-mono text-fg">30+</span> rule changes have gone out
          with zero false-PASS regressions.
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
