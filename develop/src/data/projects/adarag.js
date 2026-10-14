export const adarag = {
  id: 'PRJ-010',
  slug: 'adarag',
  name: 'AdaRag',
  tagline: 'Multimodal RAG on one workstation. It profiles each file, picks the right pipeline, and answers with citations that can point at the actual image.',
  when: 'Jun 2026',
  status: 'LIVE',
  stack: ['Next.js 16', 'React 19', 'FastAPI', 'Qdrant', 'Postgres', 'bge-m3', 'Optuna'],
  metrics: [
    { value: '6',    unit: '',   label: 'modalities, one pipeline' },
    { value: '1024', unit: 'd',  label: 'bge-m3 dense vectors, plus sparse' },
    { value: '3',    unit: '',   label: 'local LLM backends to pick from' },
    { value: '600',  unit: 'ms', label: 'between chat checkpoints' },
  ],
  accent: '#6fae0f',
  hero: {
    light: '/projects/adarag/product-flat-light.webp',
    dark: '/projects/adarag/product-flat-dark.webp',
  },
  invertShotsInLight: true,
  overview: [
    'AdaRag is a multimodal RAG system that runs entirely on one workstation. You drop in text, code, a PDF, an image, audio or video. It detects the type and turns the file into a text version: images get a vision caption and OCR, audio and video get transcribed, PDFs get parsed. Then everything goes into one hybrid vector store.',
    'When you ask a question, it retrieves, reranks with a cross-encoder, and answers with citations. If a citation is an image or a video, the original file goes along in the prompt, so a vision model reads the real pixels and not just a caption of them.',
    'It is three processes: a Next.js front end, a FastAPI service over Qdrant and Postgres, and a bridge on the host that runs claude-cli, gemini-cli and Ollama. The bridge exists because the API container cannot reach the CLIs logged in on the host, so it proxies them over HTTP. That is what lets a Claude subscription I already pay for handle chat, while Ollama does the cheap per-chunk work. The index stays on disk and never leaves it.',
  ],
  sections: [
    {
      title: 'The overview screen',
      body: [
        'The home view shows AdaRag as a pipeline you can watch, not a single search box. It lays out the whole path (profile, chunk, enrich, embed, index, then retrieve, rerank, generate) over four modalities, and each file is kept both as a text version and as the original media.',
        'The summary strip shows the two numbers that matter for a local system: cost per query, and the latency knee the optimizer found.',
      ],
      figure: { id: 'FIG 10.1', caption: 'The bucket overview: the whole ingest-to-answer pipeline, four modalities, and a cost and latency readout.', src: '/projects/adarag/overview.png', alt: 'AdaRag overview dashboard showing the profile-to-generate pipeline, text/image/audio/video modalities, and an at-a-glance cost and latency-knee panel' },
    },
    {
      title: 'Ingest: one pipeline, six modalities',
      body: [
        'A file\'s type picks its preprocessor, and a profiler picks its chunker: code-AST for source code, paper-section for a structured document, and plain prose splitting for everything else.',
        'Every chunk then gets two LLM enrichments in parallel. One is a short, dense context that places the chunk within its file. The other is a small set of entities, dates and keyphrases. For visual files the original media is attached, so the context is based on the pixels.',
        'The chunk is embedded with bge-m3, which gives dense and sparse vectors from one model, and upserted into a Qdrant collection per bucket. The Postgres rows are written in the same transaction, so a refresh shows the file right away.',
      ],
      figure: { id: 'FIG 10.2', caption: 'The ingest screen: a profile, chunk, embed and index stepper over the bucket\'s bge-m3 vector space.', src: '/projects/adarag/ingest.png', alt: 'AdaRag ingest page with a profile, chunk, embed, index stepper and a vector-space panel labelled bge-m3 1024d' },
    },
    {
      title: 'Seeing exactly what is indexed',
      body: [
        'The Files view lists everything in the active bucket with its source, type and chunk count. Here it is a resume PDF split into seven chunks, next to three images with vision captions.',
        'A local index is only trustworthy if you can see what it holds. Re-ingesting a file updates its rows in place instead of stacking duplicates.',
      ],
      figure: { id: 'FIG 10.3', caption: 'The files view: every indexed source in the bucket with its type and chunk count.', src: '/projects/adarag/files.png', alt: 'AdaRag files page listing four indexed sources - three images and a PDF resume - with modality and chunk-count columns' },
    },
    {
      title: 'Answering: retrieve, rerank, then diversify',
      body: [
        'First, a query rewrite tightens the search string. Then Qdrant runs dense and sparse searches and merges them on the server with reciprocal-rank fusion, returning up to twenty candidates.',
        'A bge-reranker-v2-m3 cross-encoder scores all of them against the query. On top of that, a diversity rule makes sure every retrieved modality gets its best chunk into the top-k. Without it, a pile of text results could bury the one photo that answers the question. The answer cites the spans it used and attaches the original image or video for any visual citation.',
      ],
      figure: { id: 'FIG 10.4', caption: 'Search: ask a question and see the answer next to the exact chunks it used.', src: '/projects/adarag/search.png', alt: 'AdaRag search page with a query box asking how bge-m3 produces sparse vectors, ready to show grounded chunks' },
    },
    {
      title: 'Chat that shows where answers come from',
      body: [
        'Chat adds the controls a local RAG needs to be clear about its sources. A three-state scope pill (strict, medium, lazy) decides whether the model may go beyond the retrieved context. An agent pill turns on tool use, shown as inline cards you can expand. A model picker switches between claude, gemini and ollama per chat.',
        'Answers stream as server-sent events, with a Postgres checkpoint every 600 ms. So if you refresh, the container restarts or something crashes mid-stream, the buffer replays and a Continue button finishes the answer.',
      ],
      figure: { id: 'FIG 10.5', caption: 'The chat screen: per-chat scope, an agent toggle, a model picker and a streaming answer area.', src: '/projects/adarag/chat.png', alt: 'AdaRag chat page with a model selector, an agent pill, a strict/medium/lazy scope toggle, and a question composer' },
    },
    {
      title: 'Tuning retrieval with an optimizer',
      body: [
        'Retrieval has knobs, and guessing them is how a local system ends up slow or wrong. An Optuna multi-objective study sweeps `rerank_candidates` and the other knobs, trading relevance against latency, using test queries generated from the active bucket.',
        'It reports the knee of that curve in plain language. In one run, K=36 kept about 98% of peak nDCG at roughly 11% lower latency. The trials run on the local GPU, so they cost nothing extra.',
      ],
      figure: { id: 'FIG 10.6', caption: 'The optimizer: an Optuna Pareto front of nDCG against latency, with the point of diminishing returns marked.', src: '/projects/adarag/optimizer.png', alt: 'AdaRag optimizer page showing a Pareto-front scatter of nDCG versus latency and a headline naming the K=36 knee' },
    },
    {
      title: 'Why local?',
      body: [
        'Research notes, source code, private photos: the system that reads them should not be a monthly subscription with a privacy policy nobody reads. AdaRag owns its index, runs on one machine, and sends inference through whichever local CLI you already pay for. So it costs nothing on top of your LLM, and the retrieval is yours to tune.',
        'The whole thing is about three thousand lines, small enough to read end to end.',
      ],
      figure: { id: 'FIG 10.7', caption: 'The public landing page.', src: '/projects/adarag/landing.png', alt: 'AdaRag landing page with the headline "A search system for everything on your disk" over a dark editorial layout' },
    },
  ],
  conclusion: [
    'With AdaRag I wanted to own the unglamorous half of RAG end to end: profiling, adaptive chunking, hybrid retrieval, reranking, and grounding answers in the original media. Splitting it into three small processes around a local bridge kept it cheap. The subscription does the talking, Ollama does the bulk enrichment, and the index never leaves the disk.',
    'What works today: single-user multimodal RAG, clarifications that retag an ambiguous file by an entity you give it, agent visibility for claude and gemini, per-chat scope, and chat that survives a refresh, a restart or a crash. What does not work yet: real pre-approval for agent tools. That needs an SDK rewrite, because neither CLI exposes a permission gate in print mode.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://adarag.coehemang.dev' },
    { label: 'GitHub', href: 'https://github.com/23f3001304/AdaRag' },
  ],
};
