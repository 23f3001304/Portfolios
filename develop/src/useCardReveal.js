import { useCallback, useRef } from 'react';

/* WebGL hover reveal for the project index.
 *
 * At rest a card's picture is black and white (plain CSS). Point at it and the
 * colour seeps in through a sheet of liquid lying over the image.
 *
 * The liquid is STATIC - a fixed fbm field in UV space, with no clock in the
 * shader at all. Nothing on this page moves by itself. What moves is your
 * cursor, and the surface answers it three ways: the colour opens up while you
 * are over the card, a lens of refraction sits under the pointer, and the
 * pointer's own velocity shears that lens as you drag it about. Stop moving
 * and the surface is completely still - which matters, because these are
 * screenshots full of 10px UI text and a surface that never settles reads as
 * a rendering fault rather than as an effect.
 *
 * Because the field is static, the render loop can stop the moment the easing
 * settles, and a pointermove restarts it.
 *
 * One renderer, moved between cards: thirteen canvases would be thirteen WebGL
 * contexts and browsers cap that in the teens, so the single canvas is adopted
 * by whichever media box is hovered and detached on the way out. three.js is
 * imported on first hover, never at page load - until it lands (and on reduced
 * motion, or without WebGL) the CSS greyscale swap stands in, which is why the
 * shader computes its own greyscale rather than crossfading two textures: both
 * paths have to agree on what "off" looks like. The canvas also only mounts
 * once its texture has decoded; attaching first is what flashes black.
 */

const REVEAL = `
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2  uMouse;
  uniform vec2  uVel;
  uniform float uOpen;
  uniform float uAspect;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  /* Four octaves of value noise - the standing shape of the liquid. No time
     term anywhere in here, which is the whole point. */
  float liquid(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    // Cursor distance, aspect-corrected so the lens is round on screen.
    vec2  d = (vUv - uMouse) * vec2(uAspect, 1.0);
    float dist = length(d);

    vec2 q = vUv * vec2(uAspect, 1.0) * 3.4;
    float f = liquid(q);

    /* The lens: a soft pool under the pointer, only present while the card is
       hovered. This is the only thing the cursor's position controls. */
    float lens = smoothstep(0.62, 0.0, dist) * uOpen;

    /* Surface normal from the gradient of the field, so the refraction follows
       the liquid's own shape rather than pushing everything one way. */
    float e = 0.012;
    vec2 grad = vec2(liquid(q + vec2(e, 0.0)) - f, liquid(q + vec2(0.0, e)) - f) / e;

    // Refract under the lens; the pointer's velocity drags the surface with it.
    vec2 offset = (grad * 0.011 + uVel * 0.45) * lens;
    vec2 uv = clamp(vUv + offset / vec2(uAspect, 1.0), 0.0015, 0.9985);

    /* Colour seeps in along the liquid's low ground, and starts nearest the
       cursor - so it looks absorbed rather than cross-faded. */
    float th = f * 0.78 + dist * 0.30;
    float wet = smoothstep(th, th + 0.30, uOpen * 1.32);

    /* Straight sRGB passthrough - see the colour-space note in boot(). The
       values here are exactly the bytes in the file, which is exactly what the
       browser composites for the <img> underneath, so the two agree. The grey
       uses Rec.709 because that is what CSS grayscale() uses. Nothing else
       touches the tones: no contrast curve, no tone mapping. */
    vec3 c = texture2D(uTex, uv).rgb;
    vec3 grey = vec3(dot(c, vec3(0.2126, 0.7152, 0.0722)));

    // A little light where the surface tilts - what makes it read as wet.
    // Kept faint: it is added light, and these are photographs of UI.
    float spec = clamp(dot(grad, vec2(0.7, 0.7)), 0.0, 1.0) * lens * 0.025;

    gl_FragColor = vec4(mix(grey, c, wet) + spec, 1.0);
  }
`;

const VERT = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

let gl = null;        // the singleton, built on first hover
let loading = null;   // in-flight import, so a fast hover doesn't start two

async function boot() {
  const THREE = await import('three');
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.className = 'pbox-gl';

  /* Colour management off, deliberately, in both directions.
   *
   * This canvas has one job: draw the same image the <img> beneath it is
   * drawing, with some of the colour removed. The browser composites that
   * <img> as plain sRGB bytes, so the only way to match it is to do nothing -
   * no sRGB->linear decode on the way in, no encode on the way out.
   *
   * Getting this wrong is not subtle. Tagging the texture sRGB decodes it to
   * linear on sample, but a raw ShaderMaterial gets no output encode from
   * three, so the linear values land in the framebuffer as-is and the picture
   * arrives about 25 levels darker than the one next to it - measured, not
   * guessed. */
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const uniforms = {
    uTex: { value: null },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uVel: { value: new THREE.Vector2(0, 0) },
    uOpen: { value: 0 },
    uAspect: { value: 1.5 },
  };
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: REVEAL, uniforms }),
  ));

  return {
    THREE, renderer, scene, uniforms,
    camera: new THREE.Camera(),
    aniso: renderer.capabilities.getMaxAnisotropy(),
    textures: new Map(),   // src -> Promise<Texture>
    host: null,            // the .pbox-media currently holding the canvas
    target: 0,             // where uOpen is heading
    aim: new THREE.Vector2(0.5, 0.5),   // where the pointer actually is
    raf: null,
    last: 0,               // previous frame time, for framerate-free easing
  };
}

/* Mipmaps and anisotropy matter here: the card paints a 1000px texture at
   about 900 device px, and a plain LinearFilter minification is visibly
   grittier than the browser's own downscale of the same <img> - which is the
   thing sitting right next to it for comparison. */
function texture(src) {
  let p = gl.textures.get(src);
  if (!p) {
    p = new gl.THREE.TextureLoader().loadAsync(src).then((t) => {
      t.colorSpace = gl.THREE.NoColorSpace;   // see the note in boot()
      t.minFilter = gl.THREE.LinearMipmapLinearFilter;
      t.magFilter = gl.THREE.LinearFilter;
      t.anisotropy = gl.aniso;
      t.generateMipmaps = true;
      return t;
    });
    gl.textures.set(src, p);
  }
  return p;
}

function detach() {
  if (gl?.host) {
    gl.host.removeAttribute('data-gl');
    if (gl.renderer.domElement.parentNode === gl.host) gl.host.removeChild(gl.renderer.domElement);
    gl.host = null;
  }
}

function tick(now) {
  if (!gl) return;
  const dt = Math.min(0.05, gl.last ? (now - gl.last) / 1000 : 0.016);
  gl.last = now;

  const { uOpen, uMouse, uVel } = gl.uniforms;

  /* Exponential easing on elapsed time, not on frames - a dropped frame must
     not change the timing. Leaving closes faster than entering opens. */
  const speed = gl.target > uOpen.value ? 2.7 : 5.4;
  uOpen.value += (gl.target - uOpen.value) * (1 - Math.exp(-speed * dt));

  // The lens trails the pointer slightly, which is what gives it weight.
  uMouse.value.lerp(gl.aim, 1 - Math.exp(-13 * dt));
  // Velocity bleeds off, so a flick shears the surface and then lets go.
  uVel.value.multiplyScalar(Math.exp(-7 * dt));

  gl.renderer.render(gl.scene, gl.camera);

  if (gl.target === 0 && uOpen.value < 0.004) {
    uOpen.value = 0;
    uVel.value.set(0, 0);
    gl.raf = null;
    gl.last = 0;
    detach();
    return;
  }

  /* Settled: field is static, pointer has arrived, velocity has died. Stop the
     loop entirely - a card resting under the cursor should cost nothing. Any
     pointermove restarts it. */
  const still =
    Math.abs(gl.target - uOpen.value) < 0.002 &&
    uMouse.value.distanceToSquared(gl.aim) < 1e-7 &&
    uVel.value.lengthSq() < 1e-8;
  if (still) {
    uOpen.value = gl.target;
    uVel.value.set(0, 0);
    gl.raf = null;
    gl.last = 0;
    return;
  }

  gl.raf = requestAnimationFrame(tick);
}

function run() {
  if (gl && gl.raf === null) { gl.last = 0; gl.raf = requestAnimationFrame(tick); }
}

/* Handlers for one card's media box. The <img> underneath stays put; the
 * canvas covers it while the reveal is running. */
export function useCardReveal() {
  const ref = useRef(null);
  const token = useRef(0);

  const ok = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const at = (e, el) => {
    const r = el.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
  };

  const enter = useCallback(async (e) => {
    const el = ref.current;
    if (!el || !ok()) return;
    const img = el.querySelector('img');
    if (!img) return;
    const [mx, my] = at(e, el);
    const mine = ++token.current;   // a hover already left by now is dropped

    if (!gl) {
      loading ??= boot().catch(() => null);
      gl = await loading;
      if (!gl || mine !== token.current) return;   // no WebGL: the CSS swap covers us
    }

    const tex = await texture(img.currentSrc || img.src).catch(() => null);
    if (!tex || mine !== token.current) return;

    if (gl.host && gl.host !== el) detach();
    const r = el.getBoundingClientRect();
    gl.renderer.setSize(r.width, r.height, false);
    gl.uniforms.uAspect.value = r.width / r.height;
    gl.uniforms.uTex.value = tex;
    gl.uniforms.uOpen.value = 0;
    gl.uniforms.uVel.value.set(0, 0);
    gl.uniforms.uMouse.value.set(mx, my);
    gl.aim.set(mx, my);
    gl.target = 1;

    // Draw one frame before it is visible, so the canvas never appears blank.
    gl.renderer.render(gl.scene, gl.camera);
    gl.host = el;
    el.setAttribute('data-gl', '');
    el.appendChild(gl.renderer.domElement);
    run();
  }, []);

  const move = useCallback((e) => {
    const el = ref.current;
    if (!gl || gl.host !== el || gl.target === 0) return;
    const [mx, my] = at(e, el);
    // Velocity is the step the pointer just took, accumulated and clamped so a
    // fast sweep shears the surface without tearing it.
    gl.uniforms.uVel.value
      .add(new gl.THREE.Vector2(mx - gl.aim.x, my - gl.aim.y))
      .clampLength(0, 0.09);
    gl.aim.set(mx, my);
    run();
  }, []);

  const leave = useCallback(() => {
    token.current += 1;
    if (gl && gl.host === ref.current) { gl.target = 0; run(); }
  }, []);

  return { ref, onPointerEnter: enter, onPointerMove: move, onPointerLeave: leave };
}
