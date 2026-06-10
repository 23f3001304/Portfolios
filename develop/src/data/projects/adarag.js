export const adarag = {
  id: 'PRJ-010',
  slug: 'adarag',
  name: 'AdaRag',
  tagline: 'Adaptive multimodal RAG that runs on one workstation - it profiles every file, routes it down the right pipeline, and answers with citations that ground in the actual pixels.',
  when: 'Jun 2026',
  status: 'LIVE',
  stack: ['Next.js 16', 'React 19', 'FastAPI', 'Qdrant', 'Postgres', 'bge-m3', 'Optuna'],
  metrics: [
    { value: '6',    unit: '',   label: 'modalities, one pipeline' },
    { value: '1024', unit: 'd',  label: 'bge-m3 dense + sparse vectors' },
    { value: '3',    unit: '',   label: 'local LLM backends, your pick' },
    { value: '600',  unit: 'ms', label: 'checkpoints, survives a crash' },
  ],
  accent: '#6fae0f',
  hero: {
    light: '/projects/adarag/product-flat-light.webp',
    dark: '/projects/adarag/product-flat-dark.webp',
  },
  invertShotsInLight: true,
  overview: [
    'AdaRag is a multimodal RAG system that runs entirely on one workstation. You drop in text, code, a PDF, an image, audio, or video; it detects the modality and turns the file into a text surrogate - vision-captioned and OCR\'d for an image, transcribed for audio or video, parsed for a PDF - then indexes it in a single hybrid vector store. Ask a question and it retrieves, reranks with a cross-encoder, and answers with citations; when a citation is an image or video, the original media rides along in the prompt so a vision-capable model reads the actual pixels, not a caption of them.',
    'Under the hood it is three processes: a Next.js front end, a FastAPI service over Qdrant and Postgres, and a host CLI bridge that owns claude-cli, gemini-cli, and Ollama. The split is deliberate - the API container can\'t reach the host\'s logged-in CLIs, so the bridge proxies them over HTTP, which is what lets a free Claude subscription pay for chat while Ollama handles the cheap per-chunk enrichment. The whole index lives on disk and never leaves it.',
  ],
  sections: [
    {
      title: 'The surface: a control room, not a search box',
      body: 'The home view frames AdaRag as a pipeline you can watch rather than a single text box. It lays out the full path - profile, chunk, enrich, embed, index, then retrieve, rerank, generate - over four first-class modalities, each kept as both a text surrogate and its original media. An at-a-glance strip carries the numbers that actually matter for a local system: cost per query and the latency knee the optimizer found, not vanity stats.',
      figure: { id: 'FIG 10.1', caption: 'The bucket overview - the whole ingest-to-answer pipeline, four modalities, and a cost/latency readout.', src: '/projects/adarag/overview.png', alt: 'AdaRag overview dashboard showing the profile-to-generate pipeline, text/image/audio/video modalities, and an at-a-glance cost and latency-knee panel' },
    },
    {
      title: 'Ingest: one pipeline, six modalities',
      body: 'A file\'s modality picks its preprocessor and a profiler picks its chunker - code-AST for source, paper-section for a structured document, naive prose otherwise. Every chunk then gets two LLM enrichments in parallel: a maximally dense situating context and a small bag of entities, dates, and keyphrases, with the original media attached when it is visual so the context grounds in pixels. The result is embedded with bge-m3 - dense and sparse vectors from one model - and upserted into a per-bucket Qdrant collection, with the Postgres rows written in the same transaction so a refresh sees the file immediately.',
      figure: { id: 'FIG 10.2', caption: 'The ingest surface - a profile/chunk/embed/index stepper over the bucket\'s bge-m3 vector space.', src: '/projects/adarag/ingest.png', alt: 'AdaRag ingest page with a profile, chunk, embed, index stepper and a vector-space panel labelled bge-m3 1024d' },
    },
    {
      title: 'A corpus you can audit',
      body: 'Files lists everything indexed in the active bucket, by source, modality, and chunk count - here a resume PDF broken into seven chunks sitting beside three vision-captioned images. The point is legibility: a local index is only trustworthy if you can see exactly what it holds, and re-ingesting a source updates its rows in place rather than stacking duplicates.',
      figure: { id: 'FIG 10.3', caption: 'The files view - every indexed source in the bucket with its modality and chunk count.', src: '/projects/adarag/files.png', alt: 'AdaRag files page listing four indexed sources - three images and a PDF resume - with modality and chunk-count columns' },
    },
    {
      title: 'Answering: retrieve, rerank, then diversify',
      body: 'A query rewrite tightens the search string, then Qdrant runs dense and sparse prefetches and fuses them server-side with reciprocal-rank fusion, returning up to twenty candidates. A bge-reranker-v2-m3 cross-encoder scores the whole pool against the query, and a diversity guarantee makes sure every retrieved modality lands its best chunk in the top-k, so a text-heavy result can\'t bury the one photo that answers the question. The answer cites the spans it used, and attaches the original image or video for any visual citation.',
      figure: { id: 'FIG 10.4', caption: 'Search - ask a question and see the answer beside the exact chunks it was grounded in.', src: '/projects/adarag/search.png', alt: 'AdaRag search page with a query box asking how bge-m3 produces sparse vectors, ready to show grounded chunks' },
    },
    {
      title: 'A chat that shows its work',
      body: 'Chat adds the controls a local RAG needs to be honest about where an answer came from. A three-state scope pill - strict, medium, lazy - decides whether the model may go beyond the retrieved context, an agent pill turns on tool use that renders as inline, expandable cards, and a model picker switches between claude, gemini, and ollama per chat. Answers stream as server-sent events with a Postgres checkpoint every 600 ms, so a refresh, a container restart, or a crash mid-stream replays the buffer and a Continue button finishes the thought.',
      figure: { id: 'FIG 10.5', caption: 'The chat surface - per-chat scope, an agent toggle, a model picker, and a streaming answer area.', src: '/projects/adarag/chat.png', alt: 'AdaRag chat page with a model selector, an agent pill, a strict/medium/lazy scope toggle, and a question composer' },
    },
    {
      title: 'An optimizer on the relevance/latency frontier',
      body: 'Retrieval has knobs, and guessing at them is how a local system ends up slow or wrong. An Optuna multi-objective study sweeps rerank_candidates and the rest against a relevance-versus-latency Pareto front, built from golden queries drawn off the active bucket, and reports the knee in plain language - one study found K=36 holding about 98% of peak nDCG at roughly 11% lower latency. The trials run on the local GPU at no marginal cost.',
      figure: { id: 'FIG 10.6', caption: 'The optimizer - an Optuna Pareto front of nDCG against latency, with the diminishing-returns knee called out.', src: '/projects/adarag/optimizer.png', alt: 'AdaRag optimizer page showing a Pareto-front scatter of nDCG versus latency and a headline naming the K=36 knee' },
    },
    {
      title: 'Why it is local, and why that matters',
      body: 'Research notes, source code, private photos - the system that reads them should not be a monthly subscription with a privacy policy you skim. AdaRag owns its index, runs on one machine, and routes inference through whichever local CLI you already pay for, so the running cost above your LLM is zero and the retrieval is yours to tune rather than a vendor\'s black box. It is about three thousand lines, small enough to read.',
      figure: { id: 'FIG 10.7', caption: 'The public landing page - the case for a RAG that owns its index and never uploads your disk.', src: '/projects/adarag/landing.png', alt: 'AdaRag landing page with the headline "A search system for everything on your disk" over a dark editorial layout' },
    },
  ],
  conclusion: [
    'AdaRag\'s bet is that the unglamorous half of RAG - profiling, adaptive chunking, hybrid retrieval, cross-encoder reranking, and grounding answers in the original media - is worth owning end to end rather than renting. Writing it as three small processes around one local bridge is what makes that affordable: a free subscription does the talking, Ollama does the bulk enrichment, and the index never leaves the disk.',
    'What is here runs end to end for single-user multimodal RAG - clarifications that retag an ambiguous file by the entity you supply, agent visibility for claude and gemini, per-chat scope, and chat that survives a refresh, a container restart, or a crash mid-stream. The honest edges are named too: real pre-approval for agent tools waits on an SDK rewrite, since neither CLI exposes a permission gate in print mode.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://adarag.coehemang.dev' },
    { label: 'GitHub', href: 'https://github.com/23f3001304/AdaRag' },
  ],
};
