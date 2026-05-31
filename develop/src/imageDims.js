/*
 * Intrinsic pixel dimensions of the project screenshots. The Figure component
 * stamps these onto each <img> as width/height attributes so the browser
 * reserves the correct aspect-ratio box before the (lazy) image loads. Without
 * this, below-the-fold images collapse to zero height and then expand on load,
 * shifting the page - which left TOC jumps landing short on a cold cache.
 *
 * Keyed by the public src path. Generated from the files in public/projects.
 */
export const IMG_DIMS = {
  '/projects/formdash/analytics.png': [2400, 1686],
  '/projects/formdash/dashboard.png': [1400, 984],
  '/projects/formdash/editor-build.png': [2880, 1800],
  '/projects/formdash/editor-design.png': [2880, 1800],
  '/projects/formdash/editor-flow.png': [2880, 1800],
  '/projects/formdash/editor-logic.png': [2880, 1800],
  '/projects/formdash/public-form.png': [2880, 1800],
  '/projects/formdash/publish-popover.png': [1882, 473],
  '/projects/formdash/responses.png': [2400, 1686],
  '/projects/formdash/templates.png': [2400, 1686],
  '/projects/spider-man/assets.png': [7344, 5168],
  '/projects/spider-man/details.png': [5600, 3600],
  '/projects/spider-man/home.png': [1400, 900],
  '/projects/stic/assets.png': [9184, 11420],
  '/projects/stic/hero.jpg': [7680, 4328],
  '/projects/stic/landing.jpg': [7680, 7112],
  '/projects/stic/landing-2.jpg': [7680, 3688],
  '/projects/typereal/code-mode.png': [2880, 1800],
  '/projects/typereal/dashboard.png': [2880, 1800],
  '/projects/typereal/duel.png': [2880, 1800],
  '/projects/typereal/friends.png': [2880, 1800],
  '/projects/typereal/ghost.png': [2880, 1800],
  '/projects/typereal/history.png': [2880, 1800],
  '/projects/typereal/landing.png': [2880, 1800],
  '/projects/typereal/result.png': [2880, 1800],
  '/projects/typereal/surface.png': [2880, 1800],
  '/projects/typereal/test.png': [2880, 1800],
  '/projects/typereal/themes.png': [2880, 1800],
  '/projects/typereal/themes-editor.png': [2880, 1800],
  '/projects/typereal/tutorial.png': [2880, 1800],
};
