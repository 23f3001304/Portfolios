import { saathi } from './saathi.js';
import { tcursor } from './tcursor.js';
import { adarag } from './adarag.js';
import { contribConsole } from './contrib-console.js';
import { typereal } from './typereal.js';
import { formdash } from './formdash.js';
import { quizzy } from './quizzy.js';
import { animy } from './animy.js';
import { spiderMan } from './spider-man.js';
import { stic } from './stic.js';
import { menthub } from './menthub.js';
import { buildMyOwnGit } from './build-my-own-git.js';
import { buildMyOwnShell } from './build-my-own-shell.js';

/* Ordered so the index reads as three runs rather than a shuffle: the six
 * projects with a real product shot, then the Figma work, then the four that
 * carry a typographic poster instead. The posters used to be split across the
 * page with photographed cards between them, which made them look like gaps
 * rather than a set; they sit together at the end now. Home takes the first
 * few off the top, so the strongest work stays first. */
export const projects = [
  // Shipped, with a product shot
  saathi, tcursor, adarag, contribConsole, typereal, formdash,
  // Design work
  spiderMan, stic, menthub,
  // No screen to photograph - typographic posters (scripts/posters.mjs)
  quizzy, animy, buildMyOwnGit, buildMyOwnShell,
];
export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
