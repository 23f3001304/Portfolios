/* ============================================================
   World - the photo manifest.

   Every entry becomes one photograph in the infinite canvas.
   Photos are laid out at their TRUE aspect ratio (w / h) and
   are never cropped, so each one needs its pixel dimensions.

   To add a photo: drop the file in /public/world and append an
   entry. To read a file's dimensions quickly on Windows:
     Add-Type -AssemblyName System.Drawing
     $i=[System.Drawing.Image]::FromFile('C:\path\to.jpg'); "$($i.Width) x $($i.Height)"

   PRIVACY: nothing is read from the image file at runtime - no
   EXIF, no GPS. The date/time shown is ONLY what you type in
   `taken`. These photos had their EXIF already stripped, so
   `taken` is null (the inspector shows "—"); fill in a plain
   local timestamp 'YYYY-MM-DDTHH:mm' whenever you want a real
   date/time to appear.

   Fields:
     src     - public path to the image (required)
     w, h    - pixel dimensions, for the no-crop layout (required)
     alt     - short description, for screen readers (required)
     caption - title in the inspector (optional; falls back to alt)
     taken   - ISO local datetime 'YYYY-MM-DDTHH:mm' (optional)
   ============================================================ */
// /world/*.webp are static files in /public, NOT content-hashed - so if a CDN
// edge ever cached a bad response for one (e.g. the SPA's index.html 404 fallback,
// served while a file was briefly missing during a rename), it keeps serving that
// stale copy for the life of the cache header. Appending a version query gives
// every photo URL a fresh cache key - the clean form of the `//world/6.webp`
// double-slash trick. Bump WORLD_V whenever a world photo is replaced or renamed.
const WORLD_V = 2;

export const worldPhotos = [
  { src: '/world/1.webp',  w: 1599, h: 1200, alt: 'Photograph 01', taken: null },
  { src: '/world/2.webp',  w: 1152, h: 864,  alt: 'Photograph 02', taken: null },
  { src: '/world/3.webp',  w: 1200, h: 1599, alt: 'Photograph 03', taken: null },
  { src: '/world/4.webp',  w: 1599, h: 1599, alt: 'Photograph 04', taken: null },
  { src: '/world/5.webp',  w: 1280, h: 720,  alt: 'Photograph 05', taken: null },
  { src: '/world/6.webp',  w: 1599, h: 1200, alt: 'Photograph 06', taken: null },
  { src: '/world/7.webp',  w: 864,  h: 1152, alt: 'Photograph 07', taken: null },
  { src: '/world/8.webp',  w: 1200, h: 1599, alt: 'Photograph 08', taken: null },
  { src: '/world/9.webp',  w: 620,  h: 1386, alt: 'Photograph 09', taken: null },
  { src: '/world/10.webp', w: 762,  h: 1280, alt: 'Photograph 10', taken: null },
  { src: '/world/11.webp', w: 960,  h: 1280, alt: 'Photograph 11', taken: null },
  { src: '/world/12.webp', w: 960,  h: 1280, alt: 'Photograph 12', taken: null },
  { src: '/world/13.webp', w: 1280, h: 960,  alt: 'Photograph 13', taken: null },
  { src: '/world/14.webp', w: 960,  h: 1280, alt: 'Photograph 14', taken: null },
  { src: '/world/15.webp', w: 720,  h: 1280, alt: 'Photograph 15', taken: null },
  { src: '/world/16.webp', w: 1280, h: 720,  alt: 'Photograph 16', taken: null },
  { src: '/world/17.webp', w: 720,  h: 1280, alt: 'Photograph 17', taken: null },
  { src: '/world/18.webp', w: 720,  h: 1280, alt: 'Photograph 18', taken: null },
  { src: '/world/19.webp', w: 960,  h: 1280, alt: 'Photograph 19', taken: null },
  { src: '/world/20.webp', w: 960,  h: 1280, alt: 'Photograph 20', taken: null },
  { src: '/world/21.webp', w: 960,  h: 1280, alt: 'Photograph 21', taken: null },
  { src: '/world/22.webp', w: 1280, h: 960,  alt: 'Photograph 22', taken: null },
  { src: '/world/23.webp', w: 960,  h: 1280, alt: 'Photograph 23', taken: null },
  { src: '/world/24.webp', w: 960,  h: 1280, alt: 'Photograph 24', taken: null },
  { src: '/world/25.webp', w: 960,  h: 1280, alt: 'Photograph 25', taken: null },
  { src: '/world/26.webp', w: 1280, h: 960,  alt: 'Photograph 26', taken: '2025-07-16T19:28' },
  { src: '/world/27.webp', w: 960,  h: 1280, alt: 'Photograph 27', taken: '2025-07-19T19:19' },
  { src: '/world/28.webp', w: 960,  h: 1280, alt: 'Photograph 28', taken: '2025-07-24T18:29' },
  { src: '/world/29.webp', w: 960,  h: 1280, alt: 'Photograph 29', taken: '2025-10-05T17:21' },
  { src: '/world/30.webp', w: 960,  h: 1280, alt: 'Photograph 30', taken: '2025-10-05T17:25' },
  { src: '/world/31.webp', w: 960,  h: 1280, alt: 'Photograph 31', taken: '2025-10-05T17:25' },
  { src: '/world/32.webp', w: 960,  h: 1280, alt: 'Photograph 32', taken: '2025-10-05T17:34' },
  { src: '/world/33.webp', w: 960,  h: 1280, alt: 'Photograph 33', taken: '2025-10-06T17:52' },
  { src: '/world/34.webp', w: 1280, h: 576,  alt: 'Photograph 34', taken: '2024-03-02T17:24' },
  { src: '/world/35.webp', w: 960,  h: 1280, alt: 'Photograph 35', taken: '2025-01-08T18:28' },
  { src: '/world/36.webp', w: 960,  h: 1280, alt: 'Photograph 36', taken: '2025-01-08T18:31' },
].map((photo) => ({ ...photo, src: `${photo.src}?v=${WORLD_V}` }));
