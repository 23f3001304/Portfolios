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
export const worldPhotos = [
  { src: '/world/1.jpeg',  w: 1599, h: 1200, alt: 'Photograph 01', taken: null },
  { src: '/world/2.jpeg',  w: 1152, h: 864,  alt: 'Photograph 02', taken: null },
  { src: '/world/3.jpeg',  w: 1200, h: 1599, alt: 'Photograph 03', taken: null },
  { src: '/world/4.jpeg',  w: 1599, h: 1599, alt: 'Photograph 04', taken: null },
  { src: '/world/5.jpeg',  w: 1280, h: 720,  alt: 'Photograph 05', taken: null },
  { src: '/world/6.jpeg',  w: 1599, h: 1200, alt: 'Photograph 06', taken: null },
  { src: '/world/7.jpeg',  w: 864,  h: 1152, alt: 'Photograph 07', taken: null },
  { src: '/world/8.jpeg',  w: 1200, h: 1599, alt: 'Photograph 08', taken: null },
  { src: '/world/9.jpeg',  w: 620,  h: 1386, alt: 'Photograph 09', taken: null },
  { src: '/world/10.jpeg', w: 762,  h: 1280, alt: 'Photograph 10', taken: null },
  { src: '/world/11.jpeg', w: 960,  h: 1280, alt: 'Photograph 11', taken: null },
  { src: '/world/12.jpeg', w: 960,  h: 1280, alt: 'Photograph 12', taken: null },
  { src: '/world/13.jpeg', w: 1280, h: 960,  alt: 'Photograph 13', taken: null },
  { src: '/world/14.jpeg', w: 960,  h: 1280, alt: 'Photograph 14', taken: null },
  { src: '/world/15.jpeg', w: 720,  h: 1280, alt: 'Photograph 15', taken: null },
  { src: '/world/16.jpeg', w: 1280, h: 720,  alt: 'Photograph 16', taken: null },
  { src: '/world/17.jpeg', w: 720,  h: 1280, alt: 'Photograph 17', taken: null },
  { src: '/world/18.jpeg', w: 720,  h: 1280, alt: 'Photograph 18', taken: null },
  { src: '/world/19.jpeg', w: 960,  h: 1280, alt: 'Photograph 19', taken: null },
  { src: '/world/20.jpeg', w: 960,  h: 1280, alt: 'Photograph 20', taken: null },
  { src: '/world/21.jpeg', w: 960,  h: 1280, alt: 'Photograph 21', taken: null },
  { src: '/world/22.jpeg', w: 1280, h: 960,  alt: 'Photograph 22', taken: null },
  { src: '/world/23.jpeg', w: 960,  h: 1280, alt: 'Photograph 23', taken: null },
  { src: '/world/24.jpeg', w: 960,  h: 1280, alt: 'Photograph 24', taken: null },
  { src: '/world/25.jpeg', w: 960,  h: 1280, alt: 'Photograph 25', taken: null },
];
