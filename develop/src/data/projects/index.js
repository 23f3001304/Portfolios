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

export const projects = [adarag, contribConsole, typereal, formdash, quizzy, animy, spiderMan, stic, menthub, buildMyOwnGit, buildMyOwnShell];
export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
