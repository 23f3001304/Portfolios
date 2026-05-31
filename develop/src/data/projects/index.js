import { typereal } from './typereal.js';
import { formdash } from './formdash.js';
import { quizzy } from './quizzy.js';
import { animy } from './animy.js';
import { spiderMan } from './spider-man.js';
import { stic } from './stic.js';
import { buildMyOwnGit } from './build-my-own-git.js';
import { buildMyOwnShell } from './build-my-own-shell.js';

export const projects = [typereal, formdash, quizzy, animy, spiderMan, stic, buildMyOwnGit, buildMyOwnShell];
export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
