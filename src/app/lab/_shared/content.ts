// Real content shared by every lab direction, so the designs are judged on real copy.

export const person = {
  name: 'Rayzell Tjandra',
  email: 'tjandrarayzell@gmail.com',
  github: 'https://github.com/rayzelltj/',
  linkedin: 'https://www.linkedin.com/in/rayzell-tjandra/',
};

export const tagline = 'I build software people rely on.';

export const intro =
  "I'm Rayzell, a software engineer studying Computer Science and Management at UBC. I like the whole journey: understanding the problem, designing how it feels, and shipping something that holds up when people depend on it.";

// Source: project_description_mervin_v2 (Oct 2026); user count confirmed by Rayzell. Client stays unnamed.
export const mer = {
  title: 'MERvin',
  kind: 'Production AI agent, sole engineer',
  summary:
    "An AI agent that runs the month-end review accountants do on every client's books. The AI reads the bank statements and working papers, and plain code decides each of 34 checks. A pass only counts when two independent numbers agree to the cent.",
  before: '3–4 hours',
  after: '20–30 minutes',
  facts: [
    { label: 'Time per review', value: '3–4 hours to 20–30 minutes' },
    { label: 'Used every month by', value: '46 accountants' },
    { label: 'Accountant time freed', value: 'About 900 hours a month' },
  ],
  href: '/work/mer-agent',
};

export const projects = [
  {
    title: 'cafe-manager',
    kind: 'Canadian payroll engine',
    line: 'Computes CPP, EI and income tax to the cent against the CRA reference, built to replace a $200/month payroll service for a local cafe.',
    href: 'https://github.com/rayzelltj/cafe-manager',
    image: '',
  },
  {
    title: 'BrainJack',
    kind: 'nwHacks 2025',
    line: 'Blackjack where every hand is a study question, so revising comes with real risk and reward.',
    href: 'https://devpost.com/software/brainjack',
    image: '/images/brainjack.png',
  },
  {
    title: 'MedLex',
    kind: 'HackCamp 2024',
    line: 'Turns the way people describe their symptoms into the medical terms a doctor would use.',
    href: 'https://devpost.com/software/medlex',
    image: '/images/medlex.png',
  },
];

export const about =
  "I study Computer Science and Management at UBC, so I care about why something should exist as much as how to build it. Most recently I was the sole engineer on a production AI system at Optimus. Before that: hackathon apps for students and patients, a payroll engine for a local cafe, and research data work at BC Women's Hospital. Off the keyboard I play guitar and pour latte art.";
