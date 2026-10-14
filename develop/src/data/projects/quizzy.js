export const quizzy = {
  id: 'PRJ-001',
  slug: 'quizzy',
  name: 'Quizzy',
  tagline: 'An agent that solves a quiz from start to finish: a fast planner, a solver with tools, and a sandbox that runs its own code.',
  when: 'Nov → Dec 2025',
  status: 'SHIPPED',
  stack: ['FastAPI', 'Pydantic AI', 'Gemini', 'Docker'],
  metrics: [
    { value: '90', unit: '',     label: 'tools across 12 modules' },
    { value: '2',  unit: '',     label: 'agents: one plans, one solves' },
    { value: '5',  unit: '',     label: 'FastAPI endpoints' },
    { value: '92', unit: '/100', label: 'graded eval score' },
  ],
  sprite: '/oneko/oneko-tora.gif',
  accent: '#ff5e00',
  // No product shot to take - so a typographic poster instead
  // (scripts/posters.mjs), drawn in this project's own accent.
  hero: {
    light: '/projects/quizzy/poster-light.webp',
    dark: '/projects/quizzy/poster-dark.webp',
  },
  heroAlt: 'Poster: a four-option answer sheet where "all of the above" is the marked answer',
  overview: [
    'Quizzy is the answering side of a quiz. You give it a starting URL and it solves question after question by itself. A FastAPI service takes the URL, starts a background task, and runs a two-agent loop: a fast Gemini Flash agent sketches a plan, then a Gemini Pro agent solves the question with tools and returns a typed answer that gets submitted automatically.',
    'Most of the work was the harness around the model: 90 tools across twelve modules (web, data, documents, media, maths), a subprocess sandbox that runs Python the agent writes on the fly, and a retry loop that feeds every rejection back into the next attempt. Everything that crosses a layer is a Pydantic model, and the whole thing ships as one Docker image.',
  ],
  sections: [
    {
      title: 'One URL becomes a whole quiz',
      body: [
        'Quizzy walks a quiz the way a person would: load the page, work out the answer, submit, and follow the link to the next question. The whole run is one `while` loop in `QuizSolver`.',
        'Each turn fetches the page, plans, solves and submits. A correct answer with a `next_url` moves on to the next question, a correct answer without one ends the quiz, and a wrong answer goes into a retry. None of this blocks the caller: `/start` checks the secret and hands the loop to a FastAPI background task.',
      ],
      blocks: [
        { kind: 'diagram', id: 'solve-loop', caption: 'The loop: fetch, plan, solve, submit, then move on or retry.' },
        { kind: 'code', lang: 'py', caption: 'solver.py · the chain loop (condensed)', code: [
          '# walk the question chain until a question has no next_url',
          'while True:',
          '    result = await self._solve_single_question(context)   # fetch -> plan -> solve -> submit',
          '',
          '    if result.correct and result.next_url:',
          '        context.current_url = result.next_url             # advance to the next question',
          '        context.attempt_number = 0',
          '    elif result.correct:',
          '        break                                             # no next_url -> the quiz is done',
          '    else:',
          '        context.last_failure_reason = result.message      # remember why, then retry',
          '        if context.attempt_number >= MAX_RETRIES:',
          '            break',
          '        context.attempt_number += 1',
        ] },
      ],
    },
    {
      title: 'Plan first, then solve',
      body: [
        'Two agents split the work. A cheap Gemini Flash `guidance_agent` reads the question and writes a short plan: which files to open, what format the answer needs, and the usual traps.',
        'That plan goes into the prompt for the Gemini Pro `quiz_agent`, which does the actual solving with tools. It has to return a `QuizAnswer` instead of free text, and Pydantic AI validates that shape before anything gets submitted.',
      ],
      blocks: [
        { kind: 'diagram', id: 'two-agents', caption: 'A fast planner hands a plan to the solver, which uses tools and returns a typed answer.' },
        { kind: 'code', lang: 'py', caption: 'prompts.py · two agents, two models', code: [
          '# fast planner: cheap model, no tools, returns a strategy string',
          'guidance_agent = Agent(',
          '    model=GoogleModel("gemini-2.5-flash", provider=provider),',
          '    output_type=str,',
          '    system_prompt=GUIDANCE_PROMPT,',
          ')',
          '',
          '# solver: stronger model, typed output, tools registered below',
          'quiz_agent = Agent(',
          '    model=GoogleModel("gemini-2.5-pro", provider=provider),',
          '    deps_type=QuizDependencies,',
          '    output_type=QuizAnswer,        # Pydantic-validated, not free text',
          '    system_prompt=SYSTEM_PROMPT,',
          '    retries=2,',
          ')',
        ] },
      ],
    },
    {
      title: 'A tool for every file type',
      body: [
        'The solver has 90 tools across twelve modules: web scraping, JSON, CSV and XML, PDFs, spreadsheets and archives, audio, video and image OCR, hashing, regex and symbolic maths.',
        'Many of them are thin on purpose. The tool downloads the file, writes a few lines of Python, runs them in a subprocess sandbox with a timeout, and returns stdout. This keeps heavy libraries like pdfplumber and ffprobe out of the main process, and gives every risky operation its own short-lived runtime that gets thrown away after.',
      ],
      blocks: [
        { kind: 'diagram', id: 'tool-belt', caption: 'Tools grouped by file type. The file-heavy ones run generated Python in the sandbox.' },
        { kind: 'code', lang: 'py', caption: 'unified.py · a tool that writes and runs its own code', code: [
          '@quiz_agent.tool',
          'async def process_document(ctx, url: str) -> str:',
          '    path = await sandbox.download_file(url)',
          '    # emit a pdfplumber snippet, then run it in the sandbox',
          '    code = f"import pdfplumber; print(pdfplumber.open(r\'{path}\').pages[0].extract_text())"',
          '    out = await sandbox.execute_code(code, timeout=120)   # python subprocess + timeout',
          '    return out.stdout if out.success else out.stderr',
        ] },
      ],
    },
    {
      title: 'Wrong answer? Read the feedback and try again',
      body: [
        'When the quiz server rejects a submission, it usually says why. That reason, along with the exact answer that was rejected, goes straight into the next prompt under a loud retry banner.',
        'So the agent reads its own mistake before trying again, up to a limit per question. This turns most format mistakes, like a date with a stray time or an array where the schema wanted an object, into a fix on the second attempt.',
      ],
      blocks: [
        { kind: 'code', lang: 'py', caption: 'solver.py · the retry that feeds back the mistake', code: [
          '# on a wrong answer, the rejection becomes part of the next prompt',
          'if context.attempt_number > 0:',
          '    retry_note = (',
          '        "PREVIOUS ANSWER WAS WRONG: " + context.last_wrong_answer + "\\n"',
          '        "SERVER FEEDBACK: " + context.last_failure_reason + "\\n"',
          '        "Your new answer MUST be different from the one above."',
          '    )',
          '    prompt = build_prompt(page, guidance, retry_note)   # the model sees its own miss',
        ] },
      ],
    },
    {
      title: 'Typed everywhere, and it never hangs',
      body: [
        'Everything that crosses a layer is a Pydantic model: `QuizContext` for session state, `QuizDependencies` for what tools can access, `QuizAnswer` for the model\'s output and `QuizResult` for what gets recorded. These types also work as guardrails, because the agent cannot hand back a shape the rest of the code does not expect.',
        'When the model fails completely, the loop still does not stall. A regex fallback handles the common question types, and an emergency submit sends a placeholder answer just to get the `next_url` back and keep going.',
      ],
      blocks: [
        { kind: 'code', lang: 'py', caption: 'models.py + solver.py · typed output, and a way out when the model fails', code: [
          'class QuizAnswer(BaseModel):                  # the agent must return THIS shape',
          '    answer: Any = Field(..., description="the computed answer")',
          '    submission_url: str',
          '    confidence: float = Field(default=1.0, ge=0.0, le=1.0)',
          '    reasoning: str = ""',
          '',
          '# if the agent throws, do not hang the chain - submit a fallback, keep going',
          'async def _emergency_submit(self, context) -> QuizResult:',
          '    resp = await action.submit_answer(endpoint=base + "/submit",',
          '                                      answer="error_fallback", ...)',
          '    return QuizResult(correct=resp.correct, next_url=resp.url, ...)',
        ] },
      ],
    },
  ],
  conclusion: [
    'Quizzy ended up being less a quiz solver and more a small agent harness that happens to target quizzes. The model is just one part. Planning before solving, typed contracts on every edge, a sandbox for the code the agent writes, and a retry loop that feeds failures back in are what let it finish a chain of questions it has never seen.',
    'The same loop works for anything shaped like read, decide, act, check, repeat. Swap the page fetcher and the submit step, and you have a different agent.',
  ],
  figma: null,
  links: [
    { label: 'GitHub', href: 'https://github.com/23f3001304' },
  ],
};
