// Homepage copy. MERvin facts: project_description_mervin_v2 (Oct 2026) + mervin-mastery;
// user count (48) confirmed by Rayzell. The client firm stays unnamed.

export const person = {
  name: 'Rayzell Tjandra',
  email: 'tjandrarayzell@gmail.com',
  github: 'https://github.com/rayzelltj/',
  linkedin: 'https://www.linkedin.com/in/rayzell-tjandra/',
};

export const hero = {
  lede: 'I build software people rely on.',
  role: 'Software engineer, studying Computer Science and Management at UBC',
};

export const intro = {
  text: "I'm a Computer Science and Management student at UBC, and I love the whole arc of building software: finding the real problem, shaping how it should feel, and shipping something people can count on every day.",
  note: 'Looking for software engineering and AI internships for 2027.',
};

export const mervin = {
  title: 'MERvin',
  subtitle: 'An AI agent for month-end accounting reviews. I was the only engineer, from the first commit to production.',
  chapters: {
    problem:
      "Every month, an accountant checks each client's books before signing off. Does the bank balance match the statement? Is every loan recorded correctly? By hand, one review took three to four hours, and the firm ran about 300 of them a month.",
    built:
      'MERvin connects to the books and to the client’s documents, then runs 34 checks. The AI does the reading, pulling numbers out of messy statements and working papers. Plain code makes the call: a check only passes when two independent numbers agree to the cent.',
    result:
      'Each review now takes 20 to 30 minutes. 46 accountants use MERvin every month, and it frees up roughly 900 hours of their time.',
  },
  before: '3–4 hours',
  after: '20–30 minutes',
  // Illustration only: generic sample checks, not real client data.
  sampleChecks: [
    { name: 'Bank balance matches the statement', status: 'Pass' },
    { name: 'Loan balances agree with lender statements', status: 'Pass' },
    { name: 'Clearing account is empty at month end', status: 'Fail', note: '$842.10 still in the account' },
    { name: 'Sales tax payable ties to the filing', status: 'Review' },
  ],
  href: '/work/mer-agent',
};

export const projects = [
  {
    title: 'cafe-manager',
    kind: 'Payroll engine for a local cafe',
    line: 'Runs payroll for a 7-person Vancouver cafe: CPP, EI and income tax, matched to the cent against the CRA’s own calculator, replacing a $200-a-month service.',
    href: 'https://github.com/rayzelltj/cafe-manager',
    image: '',
    stamp: 'To the cent.',
  },
  {
    title: 'BrainJack',
    kind: 'nwHacks 2025',
    line: 'Blackjack where every hand is a study question, so revising comes with real stakes.',
    href: 'https://devpost.com/software/brainjack',
    image: '/images/brainjack.png',
  },
  {
    title: 'MedLex',
    kind: 'HackCamp 2024',
    line: 'Turns the way people describe their symptoms into the terms a doctor would use.',
    href: 'https://devpost.com/software/medlex',
    image: '/images/medlex.png',
  },
  {
    title: 'Coffee Order Manager',
    kind: 'CPSC 210',
    line: 'A desktop app for coffee orders, sales history and customer records.',
    href: 'https://github.com/rayzelltj/online-ordering-software-project',
    image: '/images/cpsc210.png',
  },
  {
    title: 'Pulsar classifier',
    kind: 'DSCI 100',
    line: 'A k-nearest-neighbours model that spots pulsar stars with 97.6% precision.',
    href: 'https://github.com/rayzelltj/data-science-project',
    image: '/images/dsci100project.png',
  },
];

export const experience = {
  work: [
    {
      role: 'Software Engineer, Co-op',
      org: 'Optimus Information',
      date: 'Jan – Aug 2026',
      logo: '/images/optimus.png',
      line: 'Sole engineer on MERvin, from the Python backend to the React front end accountants use every day.',
      highlights: [
        'Built the whole front end myself: 130+ components and 1,900+ tests',
        'Moved a legacy sync service off a vendor’s AWS onto the client’s Azure with zero data loss, halving its hosting cost',
        'Cut the production cloud bill by about 36% after tracing it to 30+ idle app copies running around the clock',
        'Found a silent caching bug behind 94% of QuickBooks logins and brought it down to about 1%',
      ],
    },
  ],
  education: {
    school: 'University of British Columbia',
    degree: 'BSc Computer Science and Master of Management, dual degree',
    date: '2023 – 2028',
    badge: 'UBC',
    line: "Dean's List, A average, and the UBC Outstanding International Student Award.",
  },
  community: [
    {
      role: 'Careers Co-Chair',
      org: 'UBC Science Undergraduate Society',
      date: 'Sept 2024 – Apr 2025',
      logo: '/images/sus.png',
      line: 'Led a team of 14 through 225+ hours of career events for 500+ students, with 25+ company partners.',
    },
    {
      role: 'Co-founder and Lead Teacher',
      org: 'KitaSehat Foundation',
      date: '2021 – 2022',
      logo: '/images/kitasehat.png',
      line: 'Started a health-education program for 12 children in Bulakan, Indonesia.',
    },
    {
      role: 'Emergency Department Volunteer',
      org: "BC Children's Hospital",
      date: 'Since Sept 2024',
      logo: '/images/bcch.jpg',
      line: 'Keeping kids busy and families a little calmer during tough visits.',
    },
    {
      role: 'Research Assistant',
      org: "Endometriosis and Pelvic Pain Lab, BC Women's Hospital",
      date: 'Since Jan 2025',
      logo: '/images/whri.png',
      line: 'Keeping the registry codebook tidy so analysts can match variables across study phases.',
    },
  ],
  earlier: 'Earlier: barista, and IB Chemistry and Physics tutor.',
};

export const offKeyboard = {
  text: "When I'm not building, I'm usually pouring latte art, playing guitar in a rock band, or hunting down somewhere new to eat.",
  caption: 'A few of my favourite pours.',
  photos: ['img_5998', 'img_6217', 'img_1573', 'img_6245'],
};

export const contact = {
  headline: "Let's build something.",
  text: 'Whether it’s an internship, a project or just a coffee, my inbox is open.',
};
