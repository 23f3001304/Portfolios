import { IMG_DIMS } from '../imageDims.js';

/* The picture a project is drawn with at card size, in one theme's feel.
 *
 * The hero ships at 2400px for the detail page, and letting a browser do a
 * five times downscale turns the UI text inside a screenshot to mush, so
 * every surface that draws a project small reads the derivatives
 * scripts/card-thumbs.mjs resampled for it: 1000w, with a 500w beside it for
 * 1x screens. A project whose derivatives have not been generated yet falls
 * back to its hero rather than to nothing. */
export function cardShot(project, theme) {
  const card = `/projects/${project.slug}/card-${theme}.webp`;
  if (IMG_DIMS[card]) {
    const half = card.replace('.webp', '-500.webp');
    return {
      src: card,
      srcSet: `${half} 500w, ${card} 1000w`,
      width: IMG_DIMS[card][0],
      height: IMG_DIMS[card][1],
    };
  }
  const hero = project.hero?.[theme];
  if (!hero) return null;
  return { src: hero, srcSet: undefined, width: IMG_DIMS[hero]?.[0], height: IMG_DIMS[hero]?.[1] };
}

/* The hero at whatever size a surface paints it. The detail page draws it
 * full width, but the space's crawl draws it in a reading column, where the
 * 2400px file on its own is the same five-times downscale the cards avoid.
 * So the card derivatives sit in its srcset beside it - they are the same
 * composition, resampled - and the browser takes the one the column needs. */
export function heroShot(project, theme) {
  const hero = project.hero?.[theme];
  if (!hero) return null;
  const dims = IMG_DIMS[hero];
  const card = cardShot(project, theme);
  const srcSet = card?.srcSet && dims ? `${card.srcSet}, ${hero} ${dims[0]}w` : undefined;
  return { src: hero, srcSet, width: dims?.[0], height: dims?.[1] };
}
