export const saathi = {
  id: 'PRJ-012',
  slug: 'saathi',
  name: 'Saathi',
  tagline: 'A shopping agent that cannot spend your money except through a mandate it can prove you signed.',
  when: 'Aug → Sep 2026',
  status: 'SHIPPED',
  stack: ['TypeScript', 'Node.js', 'React', 'AP2', 'Razorpay', 'SQLite', 'OpenAI'],
  metrics: [
    { value: '8',   unit: '',  label: 'checks before a paisa moves' },
    { value: '100', unit: '%', label: 'attack recall, live HTTP' },
    { value: '0',   unit: '%', label: 'false blocks on the purchase path' },
    { value: '4',   unit: '',  label: 'provenance tiers, P0 to P3' },
  ],
  sprite: '/oneko/oneko-maia.gif',
  accent: '#1098ad',
  hero: {
    light: '/projects/saathi/product-tilt-light.webp',
    dark: '/projects/saathi/product-tilt-dark.webp',
  },
  overview: [
    'Saathi is an agent that shops on your behalf and cannot spend your money outside a mandate you signed. You say "a navy kurta under ₹2,000, refundable", and it drafts an Intent Mandate - a ceiling, a category, a refundability requirement, an expiry - which you sign by holding a button for 600 ms. Nothing has been searched for yet. Only after that does it go looking.',
    'Every rupee moves under an AP2 mandate chain, Intent → Cart → Payment, issued as W3C Verifiable Credentials and appended to a hash-chained ledger. The thesis fits in one sentence: the model decides what to do, the covenant decides what is allowed, and neither can quietly become the other. It is a pnpm and TypeScript monorepo whose dependency rules are compiled rather than documented - the agent layer has no import path to a payment rail even by accident.',
  ],
  sections: [
    {
      title: 'A price is a claim until it is signed',
      body: 'The idea the rest of the system defends: listing copy is not evidence. No number an agent reads off a page is treated as real until it arrives merchant-signed, so a cheerful "₹1,899, free returns" in a product description can inform a decision and can never justify one. Merchants are onboarded into a trust ring, their signing key minted into the gateway JWKS, and a quote from a key the ring does not know reads back as SIGNER_UNKNOWN rather than quietly passing.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'the mandate chain, in three links', code: [
          '// Intent: signed BEFORE the agent is allowed to search.',
          '{ cap_paise: 200000, category: "kurta", refundable: true, exp }',
          '',
          '// Cart: carries a digest of exactly which memories justified it.',
          '{ intent_ref, items, memory_digest: "sha256:9f2c...", nonce }',
          '',
          '// Payment: minted only after eight checks return pass.',
          '{ cart_ref, rail: "razorpay", amount_paise: 189900 }',
        ] },
      ],
    },
    {
      title: 'Provenance-Tiered Ledger Memory',
      body: 'PTLM is the novel part. Every remembered fact carries a provenance tier, and only facts the user actually signed can justify spending. A claim scraped from a page is quarantined at P0, a merchant-signed attestation reaches P2, and P3 is the user\'s own ceiling. The gateway\'s write gate - not the agent - decides which tier a memory is granted, so an agent cannot promote its own beliefs. Five contradiction rules, R1 through R5, refuse a memory that would widen a bound it is not entitled to widen, and the constraints they are checked against are derived from the real signed intent by the same call the signing route makes. A memory can never be judged against a different covenant than the one in force.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'the write gate refusing a promotion', code: [
          '// A constraint requires P3. Untrusted text grants P0.',
          'write({ type: "constraint", claim: "cap_paise=500000",',
          '        channel: "untrusted_text", claimed_tier: "P3" })',
          '',
          '// -> REFUSED',
          '//    TIER_CLAIM_EXCEEDS_CHANNEL',
          '//    TYPE_REQUIRES_HIGHER_TIER',
          '//    CONSTRAINT_RELAXATION_ATTEMPT',
        ] },
      ],
    },
    {
      title: 'Eight checks, each with a reason code and a remedy',
      body: 'Before a single paisa moves, eight independent checks run: mandate chain, envelope, cool-off, provenance entitlement, nonce, quote freshness, refundability, and cap. Each is its own strategy returning pass, hold, or fail with a machine-readable reason code and a remedy - and a hold is not a failure. A cool-off tells you when it will execute and how to cancel it, which is the difference between a system that refuses you and a system that explains itself.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'a verdict, as the shopper UI receives it', code: [
          '{',
          '  "verdict": "hold",',
          '  "checks": [',
          '    { "id": "mandate_chain", "result": "pass" },',
          '    { "id": "provenance",    "result": "pass" },',
          '    { "id": "nonce",         "result": "pass" },',
          '    { "id": "cooloff",       "result": "hold",',
          '      "reason_code": "ABOVE_THRESHOLD_HOLD",',
          '      "remedy": "executes 11:04Z, cancel any time" }',
          '  ]',
          '}',
        ] },
      ],
    },
    {
      title: 'A refusal the agent cannot talk its way past',
      body: 'The merchant\'s MCP server advertises a tool called execute_payment. The agent, being an agent, tries it - and the harness blocks the call before it runs, because money leaves only through the covenant gateway. That refusal is not a scripted demo beat, it is a policy enforced a layer below the model\'s reasoning. It is also enforced at build time: dependency-cruiser rules and TypeScript project references mean the agents package cannot import the Razorpay package, and the build fails if anyone tries. The arrows in the architecture diagram are not documentation, they are lint rules.',
      blocks: [
        { kind: 'code', lang: 'js', caption: '.dependency-cruiser.cjs - the rule with teeth', code: [
          '{',
          '  name: "agents-cannot-reach-a-rail",',
          '  severity: "error",',
          '  from: { path: "^packages/agents" },',
          '  to:   { path: "^packages/razorpay" },',
          '}',
        ] },
      ],
    },
    {
      title: 'The ledger replays, or it says so',
      body: 'State is not stored, it is folded. The ledger is append-only and hash-chained, written by a single writer under BEGIN IMMEDIATE, and the system state is a deterministic fold over those events. A replay endpoint rebuilds everything from sequence zero and compares state hashes against what is live. If a replay diverges, the system reports the divergence rather than papering over it, which is the only way an audit trail is worth anything. The shopper UI reads the same ledger the gateway writes, so what you see and what actually happened cannot drift apart.',
    },
    {
      title: 'A browser that cannot type your password',
      body: 'When the agent needs a real site it drives a disposable Chrome profile over a remote debugging pipe, never with the sandbox disabled. Password and card fields are classified, and their pixels are painted opaque in the PNG bytes before a frame ever leaves the process - not a CSS overlay a hostile page could decline to render. The agent is structurally unable to type a credential: at that point control moves visibly to you, you type into the Saathi window directly, and control moves back. Those keystrokes never pass through the page the agent can see.',
    },
    {
      title: 'Measured against itself, and published',
      body: 'A separate harness talks to a running gateway over HTTP and imports none of its code, so it cannot cheat. Three live attacks - pre-signing context poisoning, an AP2 extension-URI downgrade, and a mandate replay - are blocked 3 of 3. The more interesting half is the false-positive measurement against a benign corpus chosen to be adversarial to the detectors: catalogue copy that innocently contains trigger words, amounts sitting exactly on cap boundaries, covenant edits that tighten rather than loosen. Overall 30.6% of those are refused, but split by surface it is 44.1% on memory and 0.0% on purchases - a dropped belief, never a blocked sale. Eight findings are written up against the system\'s own rules, four of which name real defects in it.',
      blocks: [
        { kind: 'code', lang: 'js', caption: 'RESULTS.md - generated from a live run, nothing simulated', code: [
          '//              allowed    held    blocked',
          '// attack  (3)        0       0          3   <- 100% recall',
          '// benign (49)       32       2         15',
          '',
          '// false positives  15/49 = 30.6%',
          '//   memory surface 15/34 = 44.1%   belief dropped',
          '//   purchase        0/15 =  0.0%   no sale lost',
        ] },
      ],
    },
    {
      title: 'Two applications, deliberately',
      body: 'A shopper and a shopkeeper do not want the same software. The shopper\'s agent is bounded by a covenant and spends money. The merchant\'s agent has no covenant, signs no mandate, and moves nothing - it answers the only question a seller actually has, why am I not being picked by AI buyers, out of folds the ledger already computes: trust standing, unmet demand, leakage, and an audit of the merchant\'s own listing copy against eight named dark patterns. The second app is the honest consequence of the first. If agents start refusing to buy from you, you deserve to know which sentence in your product page did it.',
    },
  ],
  conclusion: [
    'Saathi was built to answer a question agentic commerce mostly waves away: not whether an agent can buy something, but what stops it. The answer here is layered and deliberately boring - a mandate chain you sign, a memory system where provenance decides what may justify a purchase, eight checks that each explain themselves, a ledger that replays, and a build that fails if the agent layer so much as imports a payment rail.',
    'The part worth defending hardest is the measurement. It is easy to demo a system blocking three attacks. It is uncomfortable to publish that the same detectors refuse 44% of a deliberately tricky benign corpus on the memory surface, and to write up four defects in your own rules. But the split is the finding: the cost lands on beliefs, not on sales, and a guarantee you have not tried to break is not a guarantee.',
  ],
  figma: null,
  links: [
    { label: 'GitHub', href: 'https://github.com/23f3001304/Saathi' },
  ],
};
