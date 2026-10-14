export const saathi = {
  id: 'PRJ-012',
  slug: 'saathi',
  name: 'Saathi',
  tagline: 'A shopping agent that can only spend your money under a mandate you signed, and can prove you signed it.',
  when: 'Aug → Sep 2026',
  status: 'SHIPPED',
  stack: ['TypeScript', 'Node.js', 'React', 'AP2', 'Razorpay', 'SQLite', 'OpenAI'],
  metrics: [
    { value: '8',   unit: '',  label: 'checks before any money moves' },
    { value: '100', unit: '%', label: 'of live attacks blocked (3 of 3)' },
    { value: '0',   unit: '%', label: 'benign purchases wrongly blocked' },
    { value: '4',   unit: '',  label: 'trust tiers for memory, P0 to P3' },
  ],
  sprite: '/oneko/oneko-maia.gif',
  accent: '#1098ad',
  hero: {
    light: '/projects/saathi/product-tilt-light.webp',
    dark: '/projects/saathi/product-tilt-dark.webp',
  },
  overview: [
    'Saathi is an agent that shops for you but cannot spend money outside a mandate you signed. You say "a navy kurta under ₹2,000, refundable", and before it searches anything it drafts an Intent Mandate: a price ceiling, a category, a refundability rule and an expiry. You sign it by holding a button for 600 ms. Only then does it start looking.',
    'Every rupee moves under an AP2 mandate chain, Intent → Cart → Payment. Each mandate is issued as a W3C Verifiable Credential and appended to a hash-chained ledger. The idea in one line: the model decides what to do, the covenant decides what is allowed, and neither can quietly take over the other.',
    'It is a pnpm and TypeScript monorepo where the dependency rules are enforced by the build, not just written down. The agent package has no import path to a payment rail, even by accident.',
  ],
  sections: [
    {
      title: 'A price on a page is only a claim',
      body: [
        'Everything else in Saathi is built on one rule: text on a product page is not evidence. A number the agent reads off a page does not count until it arrives signed by the merchant. So a listing that says "₹1,899, free returns" can inform a decision, but it can never justify a purchase.',
        'Merchants are onboarded into a trust ring, and their signing key is added to the gateway\'s JWKS. If a quote is signed by a key the ring does not know, it comes back as `SIGNER_UNKNOWN` instead of quietly passing.',
      ],
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
      title: 'Memory with trust levels',
      body: [
        'PTLM, short for Provenance-Tiered Ledger Memory, is the new idea in this project. Every fact the agent remembers carries a tier that says where it came from, and only facts the user actually signed can justify spending.',
        'A claim scraped from a page sits at P0, a merchant-signed attestation reaches P2, and P3 is the user\'s own ceiling. The gateway\'s write gate decides which tier a memory gets, not the agent, so the agent cannot promote its own beliefs.',
        'Five contradiction rules, R1 to R5, refuse any memory that tries to widen a limit it has no right to widen. The limits they check against come from the real signed intent, through the same call the signing route uses. So a memory is always judged against the mandate currently in force.',
      ],
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
      title: 'Eight checks, each with a reason and a fix',
      body: [
        'Before any money moves, eight independent checks run: mandate chain, envelope, cool-off, provenance, nonce, quote freshness, refundability and cap. Each one returns pass, hold or fail, with a machine-readable reason code and a remedy.',
        'A hold is not a failure. A cool-off hold tells you when the purchase will go through and how to cancel it. I wanted the system to explain itself instead of just saying no.',
      ],
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
      title: 'The agent cannot pay directly, even if it tries',
      body: [
        'The merchant\'s MCP server advertises a tool called `execute_payment`. The agent, being an agent, tries to call it, and the harness blocks the call before it runs, because money can only leave through the covenant gateway. The block sits a layer below the model, so no prompt can talk its way past it.',
        'It is also enforced at build time. dependency-cruiser rules and TypeScript project references mean the agents package cannot import the Razorpay package, and the build fails if anyone tries. The arrows in the architecture diagram are lint rules.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: '.dependency-cruiser.cjs', code: [
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
      title: 'The ledger can replay itself',
      body: [
        'System state is not stored directly. It is computed by folding over an append-only, hash-chained ledger, written by a single writer under `BEGIN IMMEDIATE`.',
        'A replay endpoint rebuilds everything from sequence zero and compares state hashes with what is live. If they differ, the system reports it instead of hiding it, which is the whole point of an audit trail. The shopper UI reads the same ledger the gateway writes, so what you see and what actually happened cannot drift apart.',
      ],
    },
    {
      title: 'A browser that cannot type your password',
      body: [
        'When the agent needs a real website, it drives a throwaway Chrome profile over a remote debugging pipe, always with the sandbox on.',
        'Password and card fields are detected, and their pixels are painted over in the PNG bytes before a frame leaves the process. A CSS overlay would not be enough, because a hostile page could simply not render it.',
        'So the agent is structurally unable to type a credential. At that point control moves to you, you type into the Saathi window directly, and then control moves back. Those keystrokes never pass through the page the agent can see.',
      ],
    },
    {
      title: 'Testing it against itself',
      body: [
        'A separate harness talks to a running gateway over HTTP and imports none of its code, so it cannot cheat. Three live attacks were blocked, 3 of 3: context poisoning before signing, an AP2 extension-URI downgrade, and a mandate replay.',
        'The more interesting half is false positives. I built a benign corpus designed to trip the detectors: catalogue copy that innocently contains trigger words, amounts sitting exactly on the cap, and covenant edits that tighten the rules instead of loosening them. Overall, 30.6% of those were refused. Split by surface, it is 44.1% on memory and 0.0% on purchases. So the cost is a dropped belief, never a blocked sale.',
        'I also wrote up eight findings against the system\'s own rules. Four of them are real defects.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'RESULTS.md, generated from a live run', code: [
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
      title: 'A second app, for the shop',
      body: [
        'A shopper and a shopkeeper want different software. The shopper\'s agent is bound by a covenant and spends money. The merchant\'s agent has no covenant, signs no mandate and moves no money.',
        'The merchant app answers the one question a seller has: why am I not being picked by AI buyers? It uses numbers the ledger already computes: trust standing, unmet demand, leakage, and an audit of the merchant\'s own listing copy against eight named dark patterns. If agents start refusing to buy from you, you should know which sentence on your product page caused it.',
      ],
    },
  ],
  conclusion: [
    'I built Saathi to answer a question most agentic commerce demos skip. Not whether an agent can buy something, but what stops it. Here the answer is layered: a mandate you sign, memory where provenance decides what can justify a purchase, eight checks that explain themselves, a ledger that replays, and a build that fails if the agent layer imports a payment rail.',
    'The part I am most glad about is publishing the measurement, including the uncomfortable numbers. Blocking three attacks is an easy demo. Admitting the same detectors refuse 44% of a tricky benign corpus on memory, and writing up four defects in my own rules, was harder. But that split is the real result: the cost falls on beliefs, not on sales.',
  ],
  figma: null,
  links: [
    { label: 'GitHub', href: 'https://github.com/23f3001304/Saathi' },
  ],
};
