/* Data barrel. Content lives in ./data/* (resume) and ./data/projects/* (one
 * file per project); this file just re-exports so existing imports from
 * '../data.js' keep working. */
export { profile } from './data/profile.js';
export { intro } from './data/intro.js';
export { experience } from './data/experience.js';
export { skills } from './data/skills.js';
export { education } from './data/education.js';
export { certifications } from './data/certifications.js';
export { projects, projectBySlug } from './data/projects/index.js';
