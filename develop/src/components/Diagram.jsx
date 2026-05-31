/*
 * Hand-authored SVG diagrams for the case-study pages (Build-My-Own-Git and
 * Quizzy). No image assets - everything is drawn with rects, lines, and text so
 * it stays crisp and re-themes itself: structure is currentColor, highlights
 * are the project accent (var --proj-accent, set by ProjectDetail). Colours
 * live in CSS (.gd-* classes in project-detail.css). An accent glow sits under
 * the key node of each diagram.
 */

function Defs({ id }) {
  return (
    <defs>
      <marker id={`${id}-arr`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" className="gd-arrow" />
      </marker>
      <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/* === Build-My-Own-Git ==================================================== */

/* 1 - content addressing: an object becomes its own hash, then a fan-out path. */
function ContentAddress() {
  return (
    <svg viewBox="0 0 800 132" className="gd-svg" role="img" aria-label="An object's bytes become a SHA-1 address and a fan-out path on disk">
      <Defs id="ca" />
      <text x="24" y="20" className="gd-dim" fontSize="11">content + header</text>
      <rect x="24" y="30" width="182" height="74" rx="9" className="gd-box" />
      <text x="44" y="63" className="gd-mono" fontSize="14">blob 11<tspan className="gd-acc">\0</tspan></text>
      <text x="44" y="89" className="gd-mono" fontSize="14">hello git</text>

      <line x1="210" y1="67" x2="252" y2="67" className="gd-edge" markerEnd="url(#ca-arr)" />

      <rect x="256" y="44" width="110" height="46" rx="23" className="gd-box-acc" filter="url(#ca-glow)" />
      <text x="311" y="73" className="gd-acc" fontSize="14" textAnchor="middle">SHA-1</text>

      <line x1="370" y1="67" x2="412" y2="67" className="gd-edge" markerEnd="url(#ca-arr)" />

      <text x="485" y="22" className="gd-dim" fontSize="11" textAnchor="middle">40 hex chars</text>
      <rect x="416" y="38" width="138" height="58" rx="9" className="gd-box" />
      <text x="485" y="73" className="gd-acc" fontSize="14" textAnchor="middle">9f2a1d…c4</text>

      <text x="579" y="22" className="gd-dim" fontSize="11" textAnchor="middle">deflate</text>
      <line x1="558" y1="67" x2="600" y2="67" className="gd-edge" markerEnd="url(#ca-arr)" />

      <rect x="604" y="28" width="172" height="78" rx="9" className="gd-box" />
      <text x="620" y="52" className="gd-dim" fontSize="12">.git/objects/</text>
      <text x="620" y="75" className="gd-acc" fontSize="13.5">9f/</text>
      <text x="620" y="97" className="gd-mono" fontSize="12.5">2a1d…c4</text>
    </svg>
  );
}

/* 2 - the Merkle object graph. */
function Merkle() {
  return (
    <svg viewBox="0 0 800 300" className="gd-svg" role="img" aria-label="A commit points to a tree that names blobs and sub-trees by hash">
      <Defs id="mk" />
      <rect x="320" y="20" width="160" height="52" rx="9" className="gd-box-acc" filter="url(#mk-glow)" />
      <text x="400" y="42" className="gd-acc" fontSize="13.5" textAnchor="middle">commit 7c1…</text>
      <text x="400" y="60" className="gd-dim" fontSize="11" textAnchor="middle">points at one tree</text>

      <line x1="400" y1="72" x2="400" y2="104" className="gd-edge" markerEnd="url(#mk-arr)" />

      <rect x="320" y="106" width="160" height="52" rx="9" className="gd-box" />
      <text x="400" y="129" className="gd-mono" fontSize="13.5" textAnchor="middle">tree a4f…</text>
      <text x="400" y="147" className="gd-dim" fontSize="11" textAnchor="middle">a directory listing</text>

      <path d="M400 158 V178 H150 V200" className="gd-edge" markerEnd="url(#mk-arr)" />
      <path d="M400 158 V200" className="gd-edge" markerEnd="url(#mk-arr)" />
      <path d="M400 158 V178 H650 V200" className="gd-edge" markerEnd="url(#mk-arr)" />

      <rect x="60" y="202" width="180" height="56" rx="9" className="gd-box" />
      <text x="150" y="226" className="gd-mono" fontSize="13" textAnchor="middle">blob  main.js</text>
      <text x="150" y="244" className="gd-dim" fontSize="10.5" textAnchor="middle">100644</text>

      <rect x="310" y="202" width="180" height="56" rx="9" className="gd-box" />
      <text x="400" y="226" className="gd-mono" fontSize="13" textAnchor="middle">blob  README</text>
      <text x="400" y="244" className="gd-dim" fontSize="10.5" textAnchor="middle">100644</text>

      <rect x="560" y="202" width="180" height="56" rx="9" className="gd-box-acc" />
      <text x="650" y="226" className="gd-acc" fontSize="13" textAnchor="middle">tree  lib/</text>
      <text x="650" y="244" className="gd-dim" fontSize="10.5" textAnchor="middle">40000 · recurses</text>

      <text x="400" y="286" className="gd-dim" fontSize="11.5" textAnchor="middle">each parent hash folds in its children - one byte changes, every hash up the chain changes</text>
    </svg>
  );
}

/* 3 - the commit chain. */
function CommitChain() {
  return (
    <svg viewBox="0 0 800 170" className="gd-svg" role="img" aria-label="HEAD resolves to a branch ref and a chain of commits linked by parent pointers">
      <Defs id="cc" />
      <rect x="24" y="52" width="74" height="46" rx="9" className="gd-box" />
      <text x="61" y="80" className="gd-mono" fontSize="13" textAnchor="middle">HEAD</text>

      <line x1="100" y1="75" x2="132" y2="75" className="gd-edge" markerEnd="url(#cc-arr)" />

      <rect x="134" y="52" width="150" height="46" rx="9" className="gd-box" />
      <text x="209" y="80" className="gd-mono" fontSize="12.5" textAnchor="middle">refs/heads/main</text>

      <line x1="286" y1="75" x2="318" y2="75" className="gd-edge" markerEnd="url(#cc-arr)" />

      <rect x="320" y="46" width="130" height="58" rx="9" className="gd-box-acc" filter="url(#cc-glow)" />
      <text x="385" y="72" className="gd-acc" fontSize="13" textAnchor="middle">commit c3</text>
      <text x="385" y="91" className="gd-dim" fontSize="10.5" textAnchor="middle">newest</text>

      <line x1="452" y1="75" x2="500" y2="75" className="gd-edge" markerEnd="url(#cc-arr)" />
      <text x="476" y="64" className="gd-dim" fontSize="10.5" textAnchor="middle">parent</text>

      <rect x="502" y="46" width="120" height="58" rx="9" className="gd-box" />
      <text x="562" y="79" className="gd-mono" fontSize="13" textAnchor="middle">commit c2</text>

      <line x1="624" y1="75" x2="666" y2="75" className="gd-edge" markerEnd="url(#cc-arr)" />
      <text x="645" y="64" className="gd-dim" fontSize="10.5" textAnchor="middle">parent</text>

      <rect x="668" y="46" width="120" height="58" rx="9" className="gd-box" />
      <text x="728" y="72" className="gd-mono" fontSize="13" textAnchor="middle">commit c1</text>
      <text x="728" y="91" className="gd-dim" fontSize="10.5" textAnchor="middle">root, no parent</text>

      <text x="400" y="140" className="gd-dim" fontSize="11.5" textAnchor="middle">log reads HEAD, then follows each parent line back to the root</text>
    </svg>
  );
}

/* 4 - command dispatch. */
function Dispatch() {
  return (
    <svg viewBox="0 0 800 240" className="gd-svg" role="img" aria-label="argv selects a command class which the client runs">
      <Defs id="dp" />
      <rect x="24" y="96" width="118" height="50" rx="9" className="gd-box" />
      <text x="83" y="126" className="gd-mono" fontSize="12.5" textAnchor="middle">process.argv</text>

      <line x1="144" y1="121" x2="176" y2="121" className="gd-edge" markerEnd="url(#dp-arr)" />

      <rect x="178" y="92" width="150" height="58" rx="9" className="gd-box" />
      <text x="253" y="116" className="gd-mono" fontSize="13" textAnchor="middle">main.js</text>
      <text x="253" y="134" className="gd-dim" fontSize="11" textAnchor="middle">switch(argv[2])</text>

      <line x1="330" y1="121" x2="362" y2="121" className="gd-edge" markerEnd="url(#dp-arr)" />

      <rect x="364" y="36" width="180" height="170" rx="9" className="gd-box-acc" />
      <text x="454" y="60" className="gd-acc" fontSize="12.5" textAnchor="middle">one class per verb</text>
      <text x="382" y="88" className="gd-mono" fontSize="12.5">HashWrite</text>
      <text x="382" y="110" className="gd-mono" fontSize="12.5">WriteTree</text>
      <text x="382" y="132" className="gd-mono" fontSize="12.5">CommitTree</text>
      <text x="382" y="154" className="gd-mono" fontSize="12.5">CatFile</text>
      <text x="382" y="176" className="gd-mono" fontSize="12.5">Log …</text>

      <line x1="546" y1="121" x2="578" y2="121" className="gd-edge" markerEnd="url(#dp-arr)" />

      <rect x="580" y="92" width="150" height="58" rx="9" className="gd-box-acc" filter="url(#dp-glow)" />
      <text x="655" y="116" className="gd-acc" fontSize="13" textAnchor="middle">GitClient</text>
      <text x="655" y="134" className="gd-dim" fontSize="11" textAnchor="middle">run(cmd) → cmd.run()</text>

      <text x="400" y="226" className="gd-dim" fontSize="11.5" textAnchor="middle">the client is four lines - the work lives in each command's run()</text>
    </svg>
  );
}

/* === Quizzy ============================================================== */

/* 5 - the solve loop: one URL becomes a whole quiz, with a correct->next chain
   and a wrong->retry feedback loop. */
function SolveLoop() {
  return (
    <svg viewBox="0 0 800 212" className="gd-svg" role="img" aria-label="A background task fetches, plans, solves, and submits each question, chaining to the next URL or retrying on a wrong answer">
      <Defs id="sl" />
      <text x="450" y="22" className="gd-dim" fontSize="11.5" textAnchor="middle">correct · follow next_url to the next question</text>
      <path d="M685 80 V40 H216 V80" className="gd-edge" markerEnd="url(#sl-arr)" />

      <rect x="20" y="80" width="108" height="54" rx="9" className="gd-box" />
      <text x="74" y="104" className="gd-mono" fontSize="12.5" textAnchor="middle">POST /start</text>
      <text x="74" y="121" className="gd-dim" fontSize="10.5" textAnchor="middle">auth · secret</text>

      <line x1="128" y1="107" x2="158" y2="107" className="gd-edge" markerEnd="url(#sl-arr)" />

      <rect x="160" y="80" width="112" height="54" rx="9" className="gd-box" />
      <text x="216" y="104" className="gd-mono" fontSize="12.5" textAnchor="middle">fetch page</text>
      <text x="216" y="121" className="gd-dim" fontSize="10.5" textAnchor="middle">vision</text>

      <line x1="272" y1="107" x2="302" y2="107" className="gd-edge" markerEnd="url(#sl-arr)" />

      <rect x="304" y="80" width="112" height="54" rx="9" className="gd-box" />
      <text x="360" y="104" className="gd-mono" fontSize="12.5" textAnchor="middle">guidance</text>
      <text x="360" y="121" className="gd-dim" fontSize="10.5" textAnchor="middle">plan · Flash</text>

      <line x1="416" y1="107" x2="446" y2="107" className="gd-edge" markerEnd="url(#sl-arr)" />

      <rect x="448" y="80" width="150" height="54" rx="9" className="gd-box-acc" filter="url(#sl-glow)" />
      <text x="523" y="104" className="gd-acc" fontSize="13" textAnchor="middle">quiz agent</text>
      <text x="523" y="121" className="gd-dim" fontSize="10.5" textAnchor="middle">solve · Pro + tools</text>

      <line x1="598" y1="107" x2="628" y2="107" className="gd-edge" markerEnd="url(#sl-arr)" />

      <rect x="630" y="80" width="110" height="54" rx="9" className="gd-box" />
      <text x="685" y="104" className="gd-mono" fontSize="12.5" textAnchor="middle">submit</text>
      <text x="685" y="121" className="gd-dim" fontSize="10.5" textAnchor="middle">action</text>

      <path d="M685 134 V172 H523 V134" className="gd-edge" markerEnd="url(#sl-arr)" />
      <text x="450" y="192" className="gd-dim" fontSize="11.5" textAnchor="middle">wrong · feed the server's reason back into the prompt and retry</text>
    </svg>
  );
}

/* 6 - two agents: a fast planner, then the tool-using solver with a typed output.
   Four equal-height nodes on one baseline; the solver is the accent. */
function TwoAgents() {
  return (
    <svg viewBox="0 0 800 116" className="gd-svg" role="img" aria-label="A fast guidance agent plans, then the solver agent answers with tools and returns a typed object">
      <Defs id="ta" />
      <rect x="20" y="30" width="138" height="62" rx="9" className="gd-box" />
      <text x="89" y="58" className="gd-mono" fontSize="12.5" textAnchor="middle">question</text>
      <text x="89" y="77" className="gd-dim" fontSize="10.5" textAnchor="middle">+ files · links</text>

      <line x1="158" y1="61" x2="198" y2="61" className="gd-edge" markerEnd="url(#ta-arr)" />

      <rect x="202" y="30" width="158" height="62" rx="9" className="gd-box" />
      <text x="281" y="58" className="gd-mono" fontSize="12.5" textAnchor="middle">guidance agent</text>
      <text x="281" y="77" className="gd-dim" fontSize="10.5" textAnchor="middle">Gemini Flash · plan</text>

      <text x="402" y="24" className="gd-dim" fontSize="11" textAnchor="middle">strategy</text>
      <line x1="360" y1="61" x2="440" y2="61" className="gd-edge" markerEnd="url(#ta-arr)" />

      <rect x="444" y="30" width="168" height="62" rx="9" className="gd-box-acc" filter="url(#ta-glow)" />
      <text x="528" y="58" className="gd-acc" fontSize="13" textAnchor="middle">quiz agent</text>
      <text x="528" y="77" className="gd-dim" fontSize="10.5" textAnchor="middle">Gemini Pro · tools</text>

      <line x1="612" y1="61" x2="652" y2="61" className="gd-edge" markerEnd="url(#ta-arr)" />

      <rect x="656" y="30" width="136" height="62" rx="9" className="gd-box" />
      <text x="724" y="58" className="gd-mono" fontSize="12.5" textAnchor="middle">QuizAnswer</text>
      <text x="724" y="77" className="gd-dim" fontSize="10.5" textAnchor="middle">typed output</text>
    </svg>
  );
}

/* 7 - the tool belt: one agent, tools by modality, many running through the sandbox. */
function ToolBelt() {
  return (
    <svg viewBox="0 0 800 226" className="gd-svg" role="img" aria-label="The agent calls tools grouped by modality; many emit Python that runs in a sandbox">
      <Defs id="tb" />
      <rect x="308" y="18" width="184" height="52" rx="9" className="gd-box-acc" filter="url(#tb-glow)" />
      <text x="400" y="41" className="gd-acc" fontSize="13" textAnchor="middle">quiz agent</text>
      <text x="400" y="59" className="gd-dim" fontSize="10.5" textAnchor="middle">@quiz_agent.tool · 90 tools</text>

      <path d="M340 70 V92 H85 V104" className="gd-edge" markerEnd="url(#tb-arr)" />
      <path d="M370 70 V92 H213 V104" className="gd-edge" markerEnd="url(#tb-arr)" />
      <path d="M392 70 V104" className="gd-edge" markerEnd="url(#tb-arr)" />
      <path d="M408 70 V104" className="gd-edge" markerEnd="url(#tb-arr)" />
      <path d="M430 70 V92 H587 V104" className="gd-edge" markerEnd="url(#tb-arr)" />
      <path d="M460 70 V92 H715 V104" className="gd-edge" markerEnd="url(#tb-arr)" />

      <rect x="24" y="104" width="122" height="52" rx="8" className="gd-box" />
      <text x="85" y="127" className="gd-mono" fontSize="12" textAnchor="middle">web</text>
      <text x="85" y="144" className="gd-dim" fontSize="10" textAnchor="middle">scrape · parse</text>

      <rect x="152" y="104" width="122" height="52" rx="8" className="gd-box" />
      <text x="213" y="127" className="gd-mono" fontSize="12" textAnchor="middle">data</text>
      <text x="213" y="144" className="gd-dim" fontSize="10" textAnchor="middle">JSON·CSV·XML</text>

      <rect x="280" y="104" width="122" height="52" rx="8" className="gd-box" />
      <text x="341" y="127" className="gd-mono" fontSize="12" textAnchor="middle">docs</text>
      <text x="341" y="144" className="gd-dim" fontSize="10" textAnchor="middle">PDF·xlsx·zip</text>

      <rect x="408" y="104" width="122" height="52" rx="8" className="gd-box" />
      <text x="469" y="127" className="gd-mono" fontSize="12" textAnchor="middle">media</text>
      <text x="469" y="144" className="gd-dim" fontSize="10" textAnchor="middle">audio·video·OCR</text>

      <rect x="536" y="104" width="122" height="52" rx="8" className="gd-box" />
      <text x="597" y="127" className="gd-mono" fontSize="12" textAnchor="middle">text</text>
      <text x="597" y="144" className="gd-dim" fontSize="10" textAnchor="middle">hash·regex</text>

      <rect x="664" y="104" width="112" height="52" rx="8" className="gd-box" />
      <text x="720" y="127" className="gd-mono" fontSize="12" textAnchor="middle">math</text>
      <text x="720" y="144" className="gd-dim" fontSize="10" textAnchor="middle">sympy·eval</text>

      <path d="M341 156 V174 H400 V184" className="gd-edge" markerEnd="url(#tb-arr)" />
      <path d="M469 156 V174 H400" className="gd-edge" markerEnd="url(#tb-arr)" />
      <path d="M213 156 V174 H400" className="gd-edge" markerEnd="url(#tb-arr)" />

      <rect x="280" y="184" width="240" height="38" rx="9" className="gd-box-acc" />
      <text x="400" y="208" className="gd-acc" fontSize="12" textAnchor="middle">sandbox · python subprocess + timeout</text>
    </svg>
  );
}

/* === Build-My-Own-Shell ================================================== */

/* 8 - the read-eval loop: prompt, read, parse, run, repeat until exit. */
function ReplLoop() {
  return (
    <svg viewBox="0 0 800 130" className="gd-svg" role="img" aria-label="The shell prints a prompt, reads a line, parses it, runs it, then loops until exit">
      <Defs id="rl" />
      <text x="358" y="20" className="gd-dim" fontSize="11.5" textAnchor="middle">loop until exit 0</text>
      <path d="M615 66 V28 H102 V66" className="gd-edge" markerEnd="url(#rl-arr)" />

      <rect x="40" y="66" width="124" height="54" rx="9" className="gd-box" />
      <text x="102" y="89" className="gd-mono" fontSize="12.5" textAnchor="middle">prompt</text>
      <text x="102" y="107" className="gd-dim" fontSize="10.5" textAnchor="middle">print $</text>

      <line x1="164" y1="93" x2="200" y2="93" className="gd-edge" markerEnd="url(#rl-arr)" />

      <rect x="200" y="66" width="130" height="54" rx="9" className="gd-box" />
      <text x="265" y="89" className="gd-mono" fontSize="12.5" textAnchor="middle">read</text>
      <text x="265" y="107" className="gd-dim" fontSize="10.5" textAnchor="middle">getline</text>

      <line x1="330" y1="93" x2="366" y2="93" className="gd-edge" markerEnd="url(#rl-arr)" />

      <rect x="366" y="66" width="138" height="54" rx="9" className="gd-box" />
      <text x="435" y="89" className="gd-mono" fontSize="12.5" textAnchor="middle">parse</text>
      <text x="435" y="107" className="gd-dim" fontSize="10.5" textAnchor="middle">split into args</text>

      <line x1="504" y1="93" x2="540" y2="93" className="gd-edge" markerEnd="url(#rl-arr)" />

      <rect x="540" y="66" width="150" height="54" rx="9" className="gd-box-acc" filter="url(#rl-glow)" />
      <text x="615" y="89" className="gd-acc" fontSize="12.5" textAnchor="middle">dispatch</text>
      <text x="615" y="107" className="gd-dim" fontSize="10.5" textAnchor="middle">builtin or exec</text>
    </svg>
  );
}

/* 9 - dispatch: the first word is a builtin (handled in process) or a program
   resolved on $PATH. */
function ShellDispatch() {
  return (
    <svg viewBox="0 0 800 198" className="gd-svg" role="img" aria-label="The first word is matched against the builtin table, otherwise resolved by walking PATH">
      <Defs id="ds" />
      <rect x="24" y="76" width="124" height="48" rx="9" className="gd-box" />
      <text x="86" y="96" className="gd-mono" fontSize="12.5" textAnchor="middle">args[0]</text>
      <text x="86" y="113" className="gd-dim" fontSize="10" textAnchor="middle">first word</text>

      <path d="M148 90 H206 V59 H262" className="gd-edge" markerEnd="url(#ds-arr)" />
      <text x="231" y="50" className="gd-dim" fontSize="10" textAnchor="middle">in table</text>
      <path d="M148 110 H206 V147 H262" className="gd-edge" markerEnd="url(#ds-arr)" />
      <text x="231" y="170" className="gd-dim" fontSize="10" textAnchor="middle">else</text>

      <rect x="262" y="32" width="248" height="54" rx="9" className="gd-box-acc" filter="url(#ds-glow)" />
      <text x="386" y="54" className="gd-acc" fontSize="12" textAnchor="middle">built-in table</text>
      <text x="386" y="73" className="gd-dim" fontSize="10" textAnchor="middle">echo · type · pwd · cd · cat · exit</text>

      <line x1="510" y1="59" x2="546" y2="59" className="gd-edge" markerEnd="url(#ds-arr)" />
      <rect x="548" y="35" width="142" height="48" rx="9" className="gd-box" />
      <text x="619" y="63" className="gd-mono" fontSize="12" textAnchor="middle">run in process</text>

      <rect x="262" y="122" width="176" height="50" rx="9" className="gd-box" />
      <text x="350" y="143" className="gd-mono" fontSize="12" textAnchor="middle">search $PATH</text>
      <text x="350" y="161" className="gd-dim" fontSize="10" textAnchor="middle">split on :</text>

      <line x1="438" y1="147" x2="474" y2="147" className="gd-edge" markerEnd="url(#ds-arr)" />
      <rect x="476" y="122" width="158" height="50" rx="9" className="gd-box" />
      <text x="555" y="143" className="gd-mono" fontSize="12" textAnchor="middle">fork + execvp</text>
      <text x="555" y="161" className="gd-dim" fontSize="10" textAnchor="middle">else: not found</text>
    </svg>
  );
}

/* 10 - fork/exec/wait: one call returns twice; the child execs, the parent waits. */
function ForkExec() {
  return (
    <svg viewBox="0 0 800 184" className="gd-svg" role="img" aria-label="fork returns twice: the child execs the program, the parent waits for it">
      <Defs id="fe" />
      <rect x="320" y="22" width="160" height="50" rx="9" className="gd-box-acc" filter="url(#fe-glow)" />
      <text x="400" y="44" className="gd-acc" fontSize="13" textAnchor="middle">fork()</text>
      <text x="400" y="62" className="gd-dim" fontSize="10.5" textAnchor="middle">returns twice</text>

      <path d="M400 72 V94 H260 V112" className="gd-edge" markerEnd="url(#fe-arr)" />
      <text x="300" y="106" className="gd-dim" fontSize="10.5" textAnchor="middle">pid == 0</text>
      <path d="M400 72 V94 H540 V112" className="gd-edge" markerEnd="url(#fe-arr)" />
      <text x="500" y="106" className="gd-dim" fontSize="10.5" textAnchor="middle">pid &gt; 0</text>

      <rect x="140" y="112" width="240" height="58" rx="9" className="gd-box" />
      <text x="260" y="135" className="gd-mono" fontSize="12.5" textAnchor="middle">child</text>
      <text x="260" y="155" className="gd-dim" fontSize="10.5" textAnchor="middle">execvp → becomes the program</text>

      <rect x="420" y="112" width="240" height="58" rx="9" className="gd-box" />
      <text x="540" y="135" className="gd-mono" fontSize="12.5" textAnchor="middle">parent</text>
      <text x="540" y="155" className="gd-dim" fontSize="10.5" textAnchor="middle">waitpid → wait for it to exit</text>
    </svg>
  );
}

/* === ANIMY =============================================================== */

/* 11 - the prompt-to-video pipeline: a model writes Manim, it renders, R2 stores. */
function AnimyPipeline() {
  return (
    <svg viewBox="0 0 800 112" className="gd-svg" role="img" aria-label="A prompt goes to Gemini, which writes Manim that renders an mp4; ffmpeg grabs a thumbnail and R2 stores the result">
      <Defs id="ap" />
      <rect x="20" y="24" width="124" height="64" rx="9" className="gd-box" />
      <text x="82" y="52" className="gd-mono" fontSize="12.5" textAnchor="middle">prompt</text>
      <text x="82" y="71" className="gd-dim" fontSize="10.5" textAnchor="middle">plain text</text>

      <line x1="144" y1="56" x2="178" y2="56" className="gd-edge" markerEnd="url(#ap-arr)" />

      <rect x="178" y="24" width="124" height="64" rx="9" className="gd-box" />
      <text x="240" y="52" className="gd-mono" fontSize="12.5" textAnchor="middle">Gemini</text>
      <text x="240" y="71" className="gd-dim" fontSize="10.5" textAnchor="middle">writes Manim</text>

      <line x1="302" y1="56" x2="336" y2="56" className="gd-edge" markerEnd="url(#ap-arr)" />

      <rect x="336" y="24" width="124" height="64" rx="9" className="gd-box-acc" filter="url(#ap-glow)" />
      <text x="398" y="52" className="gd-acc" fontSize="12.5" textAnchor="middle">Manim</text>
      <text x="398" y="71" className="gd-dim" fontSize="10.5" textAnchor="middle">renders mp4</text>

      <line x1="460" y1="56" x2="494" y2="56" className="gd-edge" markerEnd="url(#ap-arr)" />

      <rect x="494" y="24" width="124" height="64" rx="9" className="gd-box" />
      <text x="556" y="52" className="gd-mono" fontSize="12.5" textAnchor="middle">ffmpeg</text>
      <text x="556" y="71" className="gd-dim" fontSize="10.5" textAnchor="middle">thumbnail</text>

      <line x1="618" y1="56" x2="652" y2="56" className="gd-edge" markerEnd="url(#ap-arr)" />

      <rect x="652" y="24" width="124" height="64" rx="9" className="gd-box" />
      <text x="714" y="52" className="gd-mono" fontSize="12.5" textAnchor="middle">R2 store</text>
      <text x="714" y="71" className="gd-dim" fontSize="10.5" textAnchor="middle">video + code</text>
    </svg>
  );
}

/* 12 - the worker pool: /generate replies at once, four workers drain a queue. */
function AnimyWorkers() {
  return (
    <svg viewBox="0 0 800 192" className="gd-svg" role="img" aria-label="POST generate returns an id immediately while a pool of four workers drains a queue, each worker pulling the next job as it frees up">
      <Defs id="aw" />
      <rect x="24" y="74" width="140" height="50" rx="9" className="gd-box" />
      <text x="94" y="95" className="gd-mono" fontSize="12" textAnchor="middle">POST /generate</text>
      <text x="94" y="112" className="gd-dim" fontSize="10" textAnchor="middle">returns an id now</text>

      <line x1="164" y1="99" x2="196" y2="99" className="gd-edge" markerEnd="url(#aw-arr)" />

      <rect x="200" y="74" width="108" height="50" rx="9" className="gd-box" />
      <text x="254" y="95" className="gd-mono" fontSize="12.5" textAnchor="middle">queue</text>
      <text x="254" y="112" className="gd-dim" fontSize="10" textAnchor="middle">FIFO</text>

      <line x1="308" y1="99" x2="360" y2="99" className="gd-edge" markerEnd="url(#aw-arr)" />

      <rect x="364" y="22" width="412" height="142" rx="10" className="gd-box-acc" filter="url(#aw-glow)" />
      <text x="570" y="43" className="gd-acc" fontSize="12" textAnchor="middle">render pool · max 4</text>

      <rect x="384" y="52" width="372" height="24" rx="6" className="gd-box" />
      <circle cx="402" cy="64" r="3.4" className="gd-acc" />
      <text x="418" y="68" className="gd-mono" fontSize="11" textAnchor="start">worker 1</text>
      <text x="740" y="68" className="gd-dim" fontSize="10.5" textAnchor="end">manim render</text>

      <rect x="384" y="80" width="372" height="24" rx="6" className="gd-box" />
      <circle cx="402" cy="92" r="3.4" className="gd-acc" />
      <text x="418" y="96" className="gd-mono" fontSize="11" textAnchor="start">worker 2</text>
      <text x="740" y="96" className="gd-dim" fontSize="10.5" textAnchor="end">manim render</text>

      <rect x="384" y="108" width="372" height="24" rx="6" className="gd-box" />
      <circle cx="402" cy="120" r="3.4" className="gd-acc" />
      <text x="418" y="124" className="gd-mono" fontSize="11" textAnchor="start">worker 3</text>
      <text x="740" y="124" className="gd-dim" fontSize="10.5" textAnchor="end">manim render</text>

      <rect x="384" y="136" width="372" height="24" rx="6" className="gd-box" style={{ strokeDasharray: '3 3' }} />
      <circle cx="402" cy="148" r="3.4" className="gd-edge" fill="none" />
      <text x="418" y="152" className="gd-dim" fontSize="11" textAnchor="start">worker 4</text>
      <text x="740" y="152" className="gd-dim" fontSize="10.5" textAnchor="end">idle, free slot</text>

      <path d="M570 164 V180 H254 V124" className="gd-edge" markerEnd="url(#aw-arr)" />
      <text x="412" y="176" className="gd-dim" fontSize="10.5" textAnchor="middle">a free slot pulls the next job</text>
    </svg>
  );
}

/* 13 - the transport choice: one held-open request dies at Heroku's 30s limit;
   short polls of a status endpoint stay well under it. */
function AnimyPoll() {
  return (
    <svg viewBox="0 0 800 186" className="gd-svg" role="img" aria-label="One request held open for the whole render is killed by Heroku's 30-second router timeout, while accepting the job and repeatedly polling a short status endpoint keeps every request fast">
      <Defs id="apl" />
      <text x="24" y="20" className="gd-dim" fontSize="11">one request, held open</text>

      <rect x="24" y="34" width="92" height="44" rx="9" className="gd-box" />
      <text x="70" y="60" className="gd-mono" fontSize="12.5" textAnchor="middle">client</text>

      <line x1="116" y1="56" x2="150" y2="56" className="gd-edge" markerEnd="url(#apl-arr)" />

      <rect x="152" y="38" width="346" height="36" rx="9" className="gd-box" />
      <text x="325" y="60" className="gd-dim" fontSize="11" textAnchor="middle">held open for the whole render</text>

      <line x1="500" y1="28" x2="500" y2="86" className="gd-edge" style={{ strokeDasharray: '4 4' }} />
      <text x="500" y="21" className="gd-acc" fontSize="11" textAnchor="middle">30 s</text>
      <text x="500" y="99" className="gd-dim" fontSize="9.5" textAnchor="middle">Heroku router</text>
      <text x="521" y="62" className="gd-dim" fontSize="15" textAnchor="middle">✕</text>
      <text x="544" y="60" className="gd-dim" fontSize="10.5" textAnchor="start">H12 timeout</text>

      <text x="24" y="112" className="gd-dim" fontSize="11">accept now, then poll</text>

      <rect x="24" y="128" width="122" height="46" rx="9" className="gd-box" />
      <text x="85" y="148" className="gd-mono" fontSize="11.5" textAnchor="middle">POST /generate</text>
      <text x="85" y="164" className="gd-dim" fontSize="9.5" textAnchor="middle">returns id &lt; 1 s</text>

      <line x1="146" y1="151" x2="174" y2="151" className="gd-edge" markerEnd="url(#apl-arr)" />

      <rect x="176" y="128" width="80" height="46" rx="9" className="gd-box" />
      <text x="216" y="155" className="gd-mono" fontSize="12" textAnchor="middle">job id</text>

      <line x1="256" y1="151" x2="284" y2="151" className="gd-edge" markerEnd="url(#apl-arr)" />

      <rect x="286" y="128" width="94" height="46" rx="9" className="gd-box" />
      <text x="333" y="155" className="gd-mono" fontSize="12" textAnchor="middle">/status</text>
      <path d="M356 128 V116 H310 V128" className="gd-edge" markerEnd="url(#apl-arr)" />
      <text x="333" y="111" className="gd-dim" fontSize="10" textAnchor="middle">poll on an interval</text>

      <line x1="380" y1="151" x2="408" y2="151" className="gd-edge" markerEnd="url(#apl-arr)" />

      <rect x="410" y="128" width="126" height="46" rx="9" className="gd-box-acc" filter="url(#apl-glow)" />
      <text x="473" y="155" className="gd-acc" fontSize="12" textAnchor="middle">complete ✓</text>
    </svg>
  );
}

const DIAGRAMS = {
  'content-address': ContentAddress,
  merkle: Merkle,
  'commit-chain': CommitChain,
  dispatch: Dispatch,
  'solve-loop': SolveLoop,
  'two-agents': TwoAgents,
  'tool-belt': ToolBelt,
  'repl-loop': ReplLoop,
  'builtin-dispatch': ShellDispatch,
  'fork-exec': ForkExec,
  'animy-pipeline': AnimyPipeline,
  'animy-workers': AnimyWorkers,
  'animy-poll': AnimyPoll,
};

export function Diagram({ id, caption }) {
  const Svg = DIAGRAMS[id];
  if (!Svg) return null;
  return (
    <figure className="gd">
      <div className="gd-frame"><Svg /></div>
      {caption && (
        <figcaption className="gd-cap">
          <span className="gd-cap-id">DIAGRAM</span>
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
