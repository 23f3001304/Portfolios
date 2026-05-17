import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const PROBE_VERT = /* glsl */ `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`

const PROBE_FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_mouse;
  uniform vec3 u_paper;
  uniform vec3 u_ink;
  uniform vec3 u_rust;
  uniform vec3 u_accent;
  uniform float u_intensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      v += a * vnoise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    uv.x *= u_res.x / u_res.y;
    float t = u_time * 0.3;
    vec2 mouseUv = u_mouse;
    mouseUv.x *= u_res.x / u_res.y;
    vec2 toMouse = mouseUv - uv;
    float mouseDist = length(toMouse);
    float mouseInfluence = exp(-mouseDist * 2.0) * 0.25;

    vec2 p1 = uv * 0.7 + vec2(t * 0.3, t * 0.15);
    float cloud1 = fbm(p1);
    vec2 p2 = uv * 1.5 + vec2(t * 0.4, -t * 0.25);
    float cloud2 = fbm(p2);
    vec2 p3 = uv * 2.8 + vec2(-t * 0.2, t * 0.15);
    float cloud3 = fbm(p3);

    float cloudDensity = cloud1 * 0.5 + cloud2 * 0.3 + cloud3 * 0.2;
    cloudDensity += mouseInfluence * 0.5;

    float softCloud = smoothstep(0.2, 0.8, cloudDensity);
    float cloudEdges = smoothstep(0.3, 0.6, cloudDensity) * (1.0 - smoothstep(0.7, 0.95, cloudDensity));

    vec3 col = u_paper;
    col = mix(col, u_accent * 0.35, softCloud * 0.55);
    col = mix(col, u_accent * 0.7, cloudEdges * 0.4);
    float denseShadow = smoothstep(0.65, 0.95, cloudDensity);
    col = mix(col, u_rust * 0.3, denseShadow * 0.4);
    vec3 mouseGlow = u_accent * 0.45 * exp(-mouseDist * 1.5);
    col = col + mouseGlow * softCloud * 0.35;

    vec2 d = v_uv - 0.5;
    float vig = 1.0 - smoothstep(0.4, 1.15, length(d));
    col *= mix(0.75, 1.0, vig);
    col = max(col, u_paper);
    col = mix(u_paper, col, u_intensity);

    gl_FragColor = vec4(col, 1.0);
  }
`

const LIVE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const LIVE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_mouse;
  uniform vec3 u_paper;
  uniform vec3 u_ink;
  uniform vec3 u_rust;
  uniform vec3 u_accent;
  uniform float u_intensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      v += a * vnoise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= u_res.x / u_res.y;
    float t = u_time * 0.3;
    vec2 mouseUv = u_mouse;
    mouseUv.x *= u_res.x / u_res.y;
    vec2 toMouse = mouseUv - uv;
    float mouseDist = length(toMouse);
    float mouseInfluence = exp(-mouseDist * 2.0) * 0.25;

    vec2 p1 = uv * 0.7 + vec2(t * 0.3, t * 0.15);
    float cloud1 = fbm(p1);
    vec2 p2 = uv * 1.5 + vec2(t * 0.4, -t * 0.25);
    float cloud2 = fbm(p2);
    vec2 p3 = uv * 2.8 + vec2(-t * 0.2, t * 0.15);
    float cloud3 = fbm(p3);

    float cloudDensity = cloud1 * 0.5 + cloud2 * 0.3 + cloud3 * 0.2;
    cloudDensity += mouseInfluence * 0.5;

    float softCloud = smoothstep(0.2, 0.8, cloudDensity);
    float cloudEdges = smoothstep(0.3, 0.6, cloudDensity) * (1.0 - smoothstep(0.7, 0.95, cloudDensity));

    vec3 col = u_paper;
    col = mix(col, u_accent * 0.35, softCloud * 0.55);
    col = mix(col, u_accent * 0.7, cloudEdges * 0.4);
    float denseShadow = smoothstep(0.65, 0.95, cloudDensity);
    col = mix(col, u_rust * 0.3, denseShadow * 0.4);
    vec3 mouseGlow = u_accent * 0.45 * exp(-mouseDist * 1.5);
    col = col + mouseGlow * softCloud * 0.35;

    vec2 d = vUv - 0.5;
    float vig = 1.0 - smoothstep(0.4, 1.15, length(d));
    col *= mix(0.75, 1.0, vig);
    col = max(col, u_paper);
    col = mix(u_paper, col, u_intensity);

    gl_FragColor = vec4(col, 1.0);
  }
`

const LIVE_FRAG_SAFE = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_mouse;
  uniform vec3 u_paper;
  uniform vec3 u_ink;
  uniform vec3 u_rust;
  uniform vec3 u_accent;
  uniform float u_intensity;

  float noiseLite(vec2 p) {
    return 0.5 + 0.5 * sin(p.x) * cos(p.y);
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= u_res.x / u_res.y;
    float t = u_time * 0.22;

    vec2 mouseUv = u_mouse;
    mouseUv.x *= u_res.x / u_res.y;
    float mouseDist = distance(mouseUv, uv);

    float n1 = noiseLite(uv * 2.2 + vec2(t * 0.7, -t * 0.4));
    float n2 = noiseLite(uv * 1.35 + vec2(-t * 0.35, t * 0.25));
    float n3 = noiseLite(uv * 3.0 + vec2(t * 0.2, t * 0.15));
    float cloud = n1 * 0.52 + n2 * 0.33 + n3 * 0.15;

    float softCloud = smoothstep(0.32, 0.82, cloud);
    float glowBand = smoothstep(0.48, 0.76, cloud) * (1.0 - smoothstep(0.78, 0.94, cloud));

    vec3 col = u_paper;
    col = mix(col, u_accent * 0.38, softCloud * 0.6);
    col = mix(col, u_accent * 0.72, glowBand * 0.3);
    col = mix(col, u_rust * 0.28, smoothstep(0.7, 0.95, cloud) * 0.35);

    float mouseGlow = exp(-mouseDist * 1.9) * 0.24;
    col += u_accent * mouseGlow * softCloud * 0.4;

    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.01;

    vec2 d = vUv - 0.5;
    float vig = 1.0 - smoothstep(0.42, 1.12, length(d));
    col *= mix(0.78, 1.0, vig);

    col = max(col, u_paper);
    col = mix(u_paper, col, u_intensity);

    gl_FragColor = vec4(col, 1.0);
  }
`

function compile(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`shader compile failed: ${log}`)
  }
  return shader
}

function hexToVec3(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const PAPER = hexToVec3('#0A0D12')
const INK = hexToVec3('#EDE7DC')
const RUST = hexToVec3('#A98B69')
const ACCENT = hexToVec3('#7BA4C7')
const AURORA_SNAPSHOT = '/assets/aurora-snapshot.png'

function shouldUseStaticSnapshot() {
  if (typeof window === 'undefined') return false

  const navigator = window.navigator
  const saveData = navigator.connection?.saveData ?? false

  if (saveData) return true

  const probeCanvas = document.createElement('canvas')
  const probeGl = probeCanvas.getContext('webgl', { powerPreference: 'high-performance' })

  if (!probeGl) return true

  const fragmentHighp = probeGl.getShaderPrecisionFormat(probeGl.FRAGMENT_SHADER, probeGl.HIGH_FLOAT)
  const vertexHighp = probeGl.getShaderPrecisionFormat(probeGl.VERTEX_SHADER, probeGl.HIGH_FLOAT)
  const fragmentMediump = probeGl.getShaderPrecisionFormat(probeGl.FRAGMENT_SHADER, probeGl.MEDIUM_FLOAT)
  const vertexMediump = probeGl.getShaderPrecisionFormat(probeGl.VERTEX_SHADER, probeGl.MEDIUM_FLOAT)
  if ((!fragmentHighp || fragmentHighp.precision === 0) && (!fragmentMediump || fragmentMediump.precision === 0)) return true
  if ((!vertexHighp || vertexHighp.precision === 0) && (!vertexMediump || vertexMediump.precision === 0)) return true

  const debugInfo = probeGl.getExtension('WEBGL_debug_renderer_info')
  const renderer = debugInfo
    ? `${probeGl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)} ${probeGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`
    : `${probeGl.getParameter(probeGl.VENDOR)} ${probeGl.getParameter(probeGl.RENDERER)}`
  const gpu = String(renderer).toLowerCase()

  if (gpu.includes('swiftshader') || gpu.includes('llvmpipe') || gpu.includes('software')) return true
  if (gpu.includes('mali-4') || gpu.includes('powervr sgx') || gpu.includes('vivante')) return true
  if (gpu.includes('adreno')) return true
  if (gpu.includes('intel') && gpu.includes('hd 3000')) return true

  const testProgram = (() => {
    try {
      const vertexShader = compile(probeGl, probeGl.VERTEX_SHADER, PROBE_VERT)
      const fragmentShader = compile(probeGl, probeGl.FRAGMENT_SHADER, PROBE_FRAG)
      const program = probeGl.createProgram()
      probeGl.attachShader(program, vertexShader)
      probeGl.attachShader(program, fragmentShader)
      probeGl.linkProgram(program)

      if (!probeGl.getProgramParameter(program, probeGl.LINK_STATUS)) {
        throw new Error(probeGl.getProgramInfoLog(program) || 'program link failed')
      }

      return program
    } catch (error) {
      return null
    }
  })()

  if (!testProgram) return true

  const testBuffer = probeGl.createBuffer()
  probeGl.useProgram(testProgram)
  probeGl.bindBuffer(probeGl.ARRAY_BUFFER, testBuffer)
  probeGl.bufferData(
    probeGl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    probeGl.STATIC_DRAW,
  )

  const aPos = probeGl.getAttribLocation(testProgram, 'a_pos')
  probeGl.enableVertexAttribArray(aPos)
  probeGl.vertexAttribPointer(aPos, 2, probeGl.FLOAT, false, 0, 0)

  const uniforms = {
    time: probeGl.getUniformLocation(testProgram, 'u_time'),
    res: probeGl.getUniformLocation(testProgram, 'u_res'),
    mouse: probeGl.getUniformLocation(testProgram, 'u_mouse'),
    paper: probeGl.getUniformLocation(testProgram, 'u_paper'),
    ink: probeGl.getUniformLocation(testProgram, 'u_ink'),
    rust: probeGl.getUniformLocation(testProgram, 'u_rust'),
    accent: probeGl.getUniformLocation(testProgram, 'u_accent'),
    intensity: probeGl.getUniformLocation(testProgram, 'u_intensity'),
  }

  probeGl.viewport(0, 0, 64, 64)
  probeGl.uniform1f(uniforms.time, 2.15)
  probeGl.uniform2f(uniforms.res, 64, 64)
  probeGl.uniform2f(uniforms.mouse, 0.56, 0.52)
  probeGl.uniform3fv(uniforms.paper, PAPER)
  probeGl.uniform3fv(uniforms.ink, INK)
  probeGl.uniform3fv(uniforms.rust, RUST)
  probeGl.uniform3fv(uniforms.accent, ACCENT)
  probeGl.uniform1f(uniforms.intensity, 1.0)
  probeGl.drawArrays(probeGl.TRIANGLE_STRIP, 0, 4)

  const samples = [
    [16, 16],
    [32, 16],
    [48, 16],
    [16, 32],
    [32, 32],
    [48, 32],
    [16, 48],
    [32, 48],
    [48, 48],
  ]

  const pixels = new Uint8Array(4)
  const lumas = []
  let changed = false

  for (const [x, y] of samples) {
    probeGl.readPixels(x, y, 1, 1, probeGl.RGBA, probeGl.UNSIGNED_BYTE, pixels)
    const r = pixels[0] / 255
    const g = pixels[1] / 255
    const b = pixels[2] / 255
    const luma = r * 0.2126 + g * 0.7152 + b * 0.0722
    lumas.push(luma)
    const paperDelta = Math.max(Math.abs(r - PAPER[0]), Math.abs(g - PAPER[1]), Math.abs(b - PAPER[2]))
    if (paperDelta > 0.03) changed = true
  }

  const mean = lumas.reduce((sum, value) => sum + value, 0) / lumas.length
  const variance = lumas.reduce((sum, value) => sum + (value - mean) ** 2, 0) / lumas.length

  if (!changed) return true
  if (!Number.isFinite(variance) || variance < 0.00015) return true

  return false
}

function makeUniforms() {
  return {
    u_time: { value: 0 },
    u_res: { value: new THREE.Vector2(1, 1) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_paper: { value: new THREE.Vector3(...PAPER) },
    u_ink: { value: new THREE.Vector3(...INK) },
    u_rust: { value: new THREE.Vector3(...RUST) },
    u_accent: { value: new THREE.Vector3(...ACCENT) },
    u_intensity: { value: 1.0 },
  }
}

function waitForDomSettled(onReady) {
  const defer = () => {
    const runAfterFrames = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onReady()
        })
      })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(runAfterFrames, { timeout: 700 })
      return
    }

    window.setTimeout(runAfterFrames, 120)
  }

  if (document.readyState === 'complete') {
    defer()
    return () => {}
  }

  const onLoad = () => {
    defer()
  }
  const onReadyStateChange = () => {
    if (document.readyState === 'complete') {
      defer()
    }
  }

  window.addEventListener('load', onLoad, { once: true })
  document.addEventListener('readystatechange', onReadyStateChange)

  return () => {
    window.removeEventListener('load', onLoad)
    document.removeEventListener('readystatechange', onReadyStateChange)
  }
}

export default function AuroraShader({ className = '', intensity = 1.0 }) {
  const containerRef = useRef(null)
  const [useSnapshot, setUseSnapshot] = useState(() => shouldUseStaticSnapshot())
  const [domSettled, setDomSettled] = useState(false)

  useEffect(() => {
    let cancelled = false
    const cleanup = waitForDomSettled(() => {
      if (!cancelled) {
        setDomSettled(true)
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  useEffect(() => {
    if (useSnapshot || !domSettled) return undefined

    const container = containerRef.current
    if (!container) return undefined

    let cleanup = () => {}

    try {
      const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, powerPreference: 'high-performance' })
      const maxPrecision = renderer.capabilities.getMaxPrecision('highp')
      const shaderPrecision = maxPrecision === 'highp' ? 'highp' : 'mediump'
      renderer.setClearColor(new THREE.Color('#0A0D12'), 1)
      renderer.toneMapping = THREE.NoToneMapping
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.style.display = 'block'
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10)
      camera.position.z = 1

      const uniforms = makeUniforms()
      uniforms.u_intensity.value = intensity

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: LIVE_VERT,
        fragmentShader: shaderPrecision === 'highp' ? LIVE_FRAG : LIVE_FRAG_SAFE,
        precision: shaderPrecision,
        depthTest: false,
        depthWrite: false,
      })

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
      mesh.frustumCulled = false
      scene.add(mesh)

      let visible = true
      let reduce = false
      let frameId = 0
      let startedAt = performance.now()
      let mouseX = 0.5
      let mouseY = 0.5

      const resize = () => {
        const rect = container.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        const width = Math.max(1, rect.width || window.innerWidth)
        const height = Math.max(1, rect.height || window.innerHeight)

        renderer.setPixelRatio(dpr)
        renderer.setSize(width, height, false)
        uniforms.u_res.value.set(renderer.domElement.width, renderer.domElement.height)
      }

      const frame = () => {
        if (!visible) {
          frameId = requestAnimationFrame(frame)
          return
        }

        const time = (performance.now() - startedAt) / 1000
        uniforms.u_time.value = reduce ? 0 : time
        uniforms.u_mouse.value.set(mouseX, mouseY)
        uniforms.u_intensity.value = intensity
        renderer.render(scene, camera)

        frameId = reduce ? 0 : requestAnimationFrame(frame)
      }

      const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
      reduce = mq?.matches ?? false
      const onReduceChange = () => {
        reduce = mq.matches
        if (!reduce && !frameId) {
          startedAt = performance.now()
          frameId = requestAnimationFrame(frame)
        }
      }
      mq?.addEventListener?.('change', onReduceChange)

      let observer
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            visible = entries[0].isIntersecting
            if (visible && !frameId && !reduce) {
              frameId = requestAnimationFrame(frame)
            }
          },
          { rootMargin: '100px' },
        )
        observer.observe(container)
      }

      const onMouseMove = (event) => {
        const rect = container.getBoundingClientRect()
        const width = rect.width || window.innerWidth
        const height = rect.height || window.innerHeight
        mouseX = Math.max(0, Math.min(1, (event.clientX - rect.left) / width))
        mouseY = Math.max(0, Math.min(1, 1.0 - (event.clientY - rect.top) / height))
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize', resize)

      const layoutTimer = window.setTimeout(() => {
        resize()
        frameId = requestAnimationFrame(frame)
      }, 0)

      cleanup = () => {
        window.clearTimeout(layoutTimer)
        if (frameId) cancelAnimationFrame(frameId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', resize)
        mq?.removeEventListener?.('change', onReduceChange)
        observer?.disconnect()
        mesh.geometry.dispose()
        material.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    } catch (error) {
      console.warn('[aurora] three.js renderer failed', error)
      setUseSnapshot(true)
    }

    return cleanup
  }, [domSettled, intensity, useSnapshot])

  if (useSnapshot || !domSettled) {
    return (
      <img
        src={AURORA_SNAPSHOT}
        alt=""
        aria-hidden
        className={`block w-full h-full object-cover ${className}`}
        loading="eager"
        decoding="async"
      />
    )
  }

  return <div ref={containerRef} className={`block w-full h-full ${className}`} aria-hidden />
}
