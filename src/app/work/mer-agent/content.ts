// MERvin case study copy. The client firm stays unnamed; no client data or branding.

export const intro = {
  eyebrow: 'Case study · Optimus Information co-op',
  lede: 'An AI agent that runs the month-end review accountants do for every client: checking the books against 34 rules and the documents behind them. I was the only engineer on it for eight months, from the first commit to production.',
};

export const stats = [
  { value: '3–4h', to: '20–30m', label: 'Time per review' },
  { value: '~900', label: 'Accountant hours freed each month' },
  { value: '46', label: 'Accountants using it monthly' },
  { value: '270+', label: 'Client companies reviewed' },
];

export const problem =
  "Every month, an accountant checks each client's balance sheet against a long list of rules. Do the bank accounts reconcile? Are the clearing accounts empty? Do the subledgers match the general ledger? Each answer means hunting through statements and working papers for proof. Done by hand it took three to four hours per client, it was repetitive, and two people could easily do it two different ways.";

export const decisions = [
  {
    title: 'Code makes the call, not the model',
    body: "Each of the 34 checks is a plain function: the same inputs always give the same Pass, Fail or Review, with the evidence attached. The rules came out of twice-weekly sessions with the firm's accountants, so the judgement lives in code they signed off on. The AI only works upstream, reading documents and pulling out numbers.",
    why: 'A financial review has to be repeatable and auditable. An accountant needs to see exactly why a check failed.',
    result: 'More engineering per rule, in exchange for results people can trust and test.',
    resultLabel: 'Trade-off',
  },
  {
    title: 'Two readers for every document',
    body: "Documents go through a primary extractor, then a vision model reads them again to corroborate. A number is only used once it's tied back to the source page. When the agent can't find support for a value it says so instead of guessing. This caught real errors, including a $10,000 digit dropped by the first reader.",
    why: 'In finance a confident wrong answer is worse than an honest "needs review", and a single extractor fails silently on messy scans.',
    result: 'Identical verdicts on every rerun: each model call is seeded and runs at temperature 0.',
  },
  {
    title: 'One run at a time, and no silent hangs',
    body: 'Duplicate review runs and pipeline stalls of 90 seconds to five minutes were slipping through unnoticed. I added request de-duplication, a cap of one active run per client, and a heartbeat watchdog that spots stalled jobs and restarts them.',
    why: "Accountants need to know a review either finished or is visibly still running, never stuck somewhere in between.",
    result: 'No more duplicate runs, and stalls now recover on their own instead of waiting for a manual restart.',
  },
  {
    title: 'A login bug hiding in plain sight',
    body: 'Tracing showed the QuickBooks connection was refreshing its login token on 94% of API calls (10,770 of 11,410 in one day) instead of once per token lifetime. I fixed it with a token cache scoped to each run and a lock per company file.',
    why: "Everything still worked, so nothing looked broken. It was one busy day away from hitting Intuit's rate limits and stopping every client's review at once.",
    result: 'Refreshes dropped from 94% of calls to about 1%, and the rate-limit risk went away.',
  },
  {
    title: 'Finding a slow cost leak',
    body: 'The production cloud bill kept climbing with no obvious reason. I traced it to more than 30 idle copies of the app left running around the clock by old deploys, plus a deployment flaw that could process the same review twice.',
    why: 'Leaks like this compound quietly for months. Nobody notices until the bill does.',
    result: 'Production cloud costs down about 36% (around CA$435 a month), with the double-processing risk closed in the same fix.',
  },
];

export const testing = [
  'Every rule is checked against a ground-truth suite of real, anonymised client datasets, backed by more than 6,000 automated tests.',
  'Before any rule change ships, a shadow harness reruns it against the full benchmark set. More than 30 rule changes have gone out with zero false passes.',
];

export const learned =
  "When a wrong number means a wrong financial statement, you start weighing correctness and speed differently.";

export const stack = [
  'Python',
  'FastAPI',
  'Pydantic',
  'Azure OpenAI',
  'Microsoft Agent Framework',
  'Vision-language models',
  'Azure Document Intelligence',
  'Azure Container Apps',
  'Docker',
  'Cosmos DB',
  'Azure Blob Storage',
  'Azure Key Vault',
  'Microsoft Entra ID',
  'Application Insights',
  'OpenTelemetry',
  'pytest',
  'React',
  'TypeScript',
];
