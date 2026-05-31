# tools

Dev-only tooling for the portfolio app in `../develop`. **None of this is needed
to build or deploy the site** - it just regenerates content that is already
committed (screenshots under `develop/public/projects`, `develop/src/worldData.js`,
and the optimised images in `develop/public/world`). It was moved out of
`develop/scripts` to keep the deployable app folder clean.

The scripts import dev dependencies (`sharp`, `puppeteer-core`) that live in
`../develop/node_modules`, so point `NODE_PATH` at it when running them.

PowerShell, from this folder:

```powershell
$env:NODE_PATH = "../develop/node_modules"

node gen-world.mjs            # rebuild develop/src/worldData.js from develop/public/world
node optimize-world.mjs 82    # convert develop/public/world images to .webp (quality arg optional)

$env:TR_SESSION = "<tr_session cookie>"
node _capture-typereal.mjs    # authed TypeReal shots -> ./.shots  (puppeteer-core)
```

`capture-auth.cjs` (authed TypeReal + Formdash shots into `develop/public/projects`,
reads `develop/.auth/cookies.json`) and `capture-typereal.cjs <outDir>` (public
TypeReal shots) use the full **`puppeteer`** package rather than `puppeteer-core`,
so run those with `NODE_PATH` pointed at a `node_modules` that has it installed.
