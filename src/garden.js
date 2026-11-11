// Generative vine lettering for the home footer. Every letter grows its own
// stems, leaves and roses, woven over and under the glyph, so the name reads
// as one overgrown word instead of twelve decorated characters.

const FONT = '"Instrument Serif", Georgia, serif'
const BREATHE_PERIOD = 9000
const LETTER_STAGGER = 95

function hash(n) {
  const x = Math.sin(n) * 43758.5453
  return x - Math.floor(x)
}

function spring(t, k = 7, w = 16) {
  if (t <= 0) return 0
  return 1 - Math.exp(-t * k) * Math.cos(t * w)
}

function easeOut(t) {
  if (t <= 0) return 0
  if (t >= 1) return 1
  return 1 - (1 - t) ** 3
}

function rng(seed) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function bezier(a, b, c, d, n) {
  const out = []
  for (let i = 0; i <= n; i += 1) {
    const t = i / n
    const u = 1 - t
    out.push([
      u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
    ])
  }
  return out
}

// Point and tangent at a normalised position along a sampled path.
function along(points, u) {
  const n = points.length
  const i = Math.min(n - 2, Math.max(1, Math.round(u * (n - 1))))
  return [
    points[i],
    Math.atan2(points[i + 1][1] - points[i - 1][1], points[i + 1][0] - points[i - 1][0]),
  ]
}

// Per-frame wobble so the drawing never sits perfectly still.
function boil(id, frame, amp) {
  if (!amp) return [0, 0, 0]
  return [
    (hash(id * 1.37 + frame * 7.13) * 2 - 1) * amp,
    (hash(id * 2.71 + frame * 3.11) * 2 - 1) * amp,
    (hash(id * 5.3 + frame * 1.7) * 2 - 1) * 0.035,
  ]
}

function trace(ctx, points, closed) {
  const n = points.length
  if (n < 2) return
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

  if (closed) {
    const start = mid(points[n - 1], points[0])
    ctx.moveTo(start[0], start[1])
    for (let i = 0; i < n; i += 1) {
      const q = mid(points[i], points[(i + 1) % n])
      ctx.quadraticCurveTo(points[i][0], points[i][1], q[0], q[1])
    }
    ctx.closePath()
    return
  }

  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < n - 1; i += 1) {
    const q = mid(points[i], points[i + 1])
    ctx.quadraticCurveTo(points[i][0], points[i][1], q[0], q[1])
  }
  ctx.lineTo(points[n - 1][0], points[n - 1][1])
}

function painter(ctx) {
  return {
    fill(points, color) {
      ctx.beginPath()
      trace(ctx, points, true)
      ctx.fillStyle = color
      ctx.fill()
    },
    stroke(points, color, width) {
      ctx.beginPath()
      trace(ctx, points, false)
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    },
    text(ch, x, y, size, color) {
      ctx.font = `400 ${size}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = color
      ctx.fillText(ch, x, y)
    },
  }
}

function vine(base, dir, len, amp, waves, phase, bend, n = 40) {
  const points = [[base[0], base[1]]]
  const step = len / n
  let x = base[0]
  let y = base[1]

  for (let i = 1; i <= n; i += 1) {
    const u = i / n
    const a = dir + bend * u + amp * Math.sin(u * Math.PI * waves + phase) * Math.min(1, u * 3)
    x += Math.cos(a) * step
    y += Math.sin(a) * step
    points.push([x, y])
  }
  return points
}

function curl(points, sign, radius) {
  const n = points.length
  const end = points[n - 1]
  const a = Math.atan2(end[1] - points[n - 2][1], end[0] - points[n - 2][0])
  const c = [end[0] - Math.sin(a) * sign * radius, end[1] + Math.cos(a) * sign * radius]
  const a0 = Math.atan2(end[1] - c[1], end[0] - c[0])

  for (let i = 1; i <= 14; i += 1) {
    const u = i / 14
    const t = a0 + sign * u * Math.PI * 1.6
    const r = radius * (1 - 0.5 * u)
    points.push([c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r])
  }
  return points
}

// Cuts a stem into segments that alternate in front of and behind the glyph.
function weave(r, startLayer) {
  const cuts = []
  const count = 1 + Math.floor(r() * 3)

  for (let i = 0; i < count; i += 1) cuts.push(0.15 + r() * 0.7)
  cuts.sort((a, b) => a - b)

  const segments = []
  let u0 = 0
  let layer = startLayer

  cuts.forEach((c) => {
    if (c <= u0) return
    segments.push({ u0, u1: c, layer })
    u0 = r() < 0.3 ? Math.min(0.98, c + 0.02 + r() * 0.03) : c
    layer = 1 - layer
  })

  segments.push({ u0, u1: 1, layer })
  return segments
}

function layerAt(segments, u) {
  for (let i = 0; i < segments.length; i += 1) {
    const s = segments[i]
    if (u >= s.u0 && u <= s.u1) return s.layer
  }
  return segments[segments.length - 1].layer
}

function strokeRange(brush, points, a, b, color, width) {
  const n = points.length - 1
  const ia = a * n
  const ib = b * n
  const lerp = (t) => {
    const i = Math.min(n - 1, Math.floor(t))
    const f = t - i
    return [
      points[i][0] + (points[i + 1][0] - points[i][0]) * f,
      points[i][1] + (points[i + 1][1] - points[i][1]) * f,
    ]
  }

  const out = [lerp(ia)]
  for (let i = Math.floor(ia) + 1; i < ib; i += 1) out.push(points[i])
  out.push(lerp(ib))

  if (out.length >= 2) brush.stroke(out, color, width)
}

function leaf(brush, bx, by, a, L, bend, colors) {
  if (L < 0.5) return

  const ca = Math.cos(a)
  const sa = Math.sin(a)
  const px = -sa
  const py = ca
  const axis = (u) => {
    const b = Math.sin(Math.PI * u) * bend * 0.15 * L
    return [bx + ca * u * L + px * b, by + sa * u * L + py * b]
  }
  const halfWidth = (u) => L * 0.18 * Math.sin(Math.PI * u ** 0.8)

  const N = 12
  const side1 = []
  const side2 = []

  for (let i = 0; i <= N; i += 1) {
    const u = i / N
    const c = axis(u)
    const w = halfWidth(u)
    side1.push([c[0] + px * w, c[1] + py * w])
    side2.push([c[0] - px * w, c[1] - py * w])
  }

  const tip = axis(1)
  const base = axis(0)

  brush.fill(
    [base].concat(side1.slice(1, N), [tip, tip], side2.slice(1, N).reverse(), [base]),
    colors.stem,
  )

  if (L > 6) {
    const v = []
    for (let i = 0; i <= 8; i += 1) v.push(axis(0.08 + (0.72 * i) / 8))
    brush.stroke(v, colors.vein, Math.max(0.8, L * 0.03))
  }
}

function rose(brush, cx, cy, R, rot, el, age, tilt, colors) {
  const cr = Math.cos(rot)
  const sr = Math.sin(rot)
  const tm = tilt ? Math.hypot(tilt[0], tilt[1]) : 0
  const ux = tm ? tilt[0] / tm : 0
  const uy = tm ? tilt[1] / tm : 0
  const squash = -0.28 * tm

  const project = (x, y, z = 0) => {
    let dx = x * cr - y * sr
    let dy = x * sr + y * cr
    if (tm) {
      const k = (dx * ux + dy * uy) * squash
      dx += k * ux + tilt[0] * R * z
      dy += k * uy + tilt[1] * R * z
    }
    return [cx + dx, cy + dy]
  }

  const petals = [
    [0, -0.36, 0.56, 0.54, 0, 0, 0],
    [-0.5, -0.06, 0.6, 0.6, -0.35, 0, 0],
    [0.52, -0.06, 0.6, 0.6, 0.35, 0, 0],
    [-0.42, 0.3, 0.62, 0.48, 0.2, 0.12, 1],
    [0.47, 0.3, 0.62, 0.48, -0.2, 0.12, 1],
    [0.05, 0.42, 0.56, 0.38, 0, 0.14, 0],
  ]

  const lineWidth = Math.max(0.8, R * 0.045)
  const step = 85

  petals.forEach((q, i) => {
    const s = spring((age - i * step) / 1000, 8, 14)
    if (s <= 0.001) return

    const open = (1 - Math.min(1, s)) * (q[0] < 0 ? 0.5 : -0.5)
    const ang = q[4] + open
    const ca = Math.cos(ang)
    const sa = Math.sin(ang)

    const point = (th) => {
      const rr = 1 + 0.08 * Math.sin(3 * th + el.ph1 + i) + 0.04 * Math.sin(5 * th + el.ph2)
      const lx = Math.cos(th) * q[2] * rr
      const ly = Math.sin(th) * q[3] * rr
      const px = q[0] + lx * ca - ly * sa
      const py = q[1] + lx * sa + ly * ca
      return project((0 + px * s) * R, (0.5 + (py - 0.5) * s) * R, q[5])
    }

    const pts = []
    for (let k = 0; k < 26; k += 1) pts.push(point((k / 26) * Math.PI * 2))
    brush.fill(pts, colors.bloom)

    if (q[6] && R >= 12 && s > 0.4) {
      const arc = []
      for (let k = 0; k <= 14; k += 1) arc.push(point(Math.PI * (1.18 + (0.64 * k) / 14)))
      strokeRange(brush, arc, 0, Math.min(1, (s - 0.4) / 0.5), colors.line, lineWidth * 0.8)
    }
  })

  // The spiral that reads as the centre of the bloom, drawn on last.
  const fr = easeOut((age - petals.length * step - 80) / 520)
  if (fr > 0 && R > 3) {
    const spiral = []
    const turns = R < 20 ? Math.min(el.turns, 1.3) : R < 32 ? el.turns * 0.8 : el.turns

    for (let i = 0; i <= 70; i += 1) {
      const u = i / 70
      const th = el.ph1 + u * turns * Math.PI * 2
      const rr = R * (0.08 + 0.57 * u)
      spiral.push(project(Math.cos(th) * rr * 1.05, Math.sin(th) * rr * 0.72 - 0.12 * R, 0.34 - 0.24 * u))
    }
    strokeRange(brush, spiral, 0, fr, colors.line, lineWidth)

    if (R >= 14) {
      const collar = []
      for (let i = 0; i <= 36; i += 1) {
        const u = i / 36
        collar.push(project((-0.72 + 1.5 * u) * R, 0.36 * R + 0.16 * R * Math.abs(Math.sin(u * Math.PI * 3)), 0.18))
      }
      strokeRange(brush, collar, 0, fr, colors.line, lineWidth)
    }
  }
}

export function createGarden(canvas, options = {}) {
  const ctx = canvas.getContext('2d')
  const brush = painter(ctx)
  const measureCtx = document.createElement('canvas').getContext('2d')

  const text = options.text || ''
  const seed = options.seed || 20260211
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let colors = {
    bloom: options.color || '#ff4b18',
    stem: 'rgba(255, 255, 255, 0.42)',
    line: 'rgba(255, 255, 255, 0.78)',
    vein: '#000000',
    text: '#ffffff',
  }

  const widths = {}
  let letters = []
  let W = 0
  let H = 0
  let dpr = 1
  let S = 0
  let frame = null
  let bloomAt = null
  let now = 0
  let pointer = null
  const faces = {}

  function measure(ch) {
    if (widths[ch] != null) return widths[ch]
    measureCtx.font = `400 100px ${FONT}`
    let w = measureCtx.measureText(ch).width / 100
    if (ch === ' ') w *= 1.4
    widths[ch] = w
    return w
  }

  function wordParams(ws) {
    const r = rng(ws * 7 + 13)
    return {
      roseP: 0.3 + r() * 0.3,
      leafy: 0.6 + r() * 0.8,
      lean: (r() - 0.5) * 0.6,
      big: 0.85 + r() * 0.45,
      curvy: 0.8 + r() * 0.6,
      bridgeP: Math.min(0.95, 0.45 + r() * 0.35),
      w: 0.5,
    }
  }

  function grow(r, out, nextId, p, o) {
    const tip =
      o.tip || (r() < p.roseP ? 'rose' : r() < 0.45 ? 'fan' : r() < 0.6 ? 'leaf' : 'curl')

    let points =
      o.pts ||
      vine(
        o.base,
        o.dir,
        o.len,
        (0.35 + r() * 0.45) * p.curvy,
        1 + r() * 1.6,
        r() * 6.28,
        (r() - 0.5) * 1.2,
      )

    if (tip === 'curl') points = curl(points, r() < 0.5 ? -1 : 1, 0.05 + r() * 0.05)

    const segments = weave(r, o.layer0 != null ? o.layer0 : r() < 0.5 ? 0 : 1)
    const dur = Math.max(320, (o.len || 0.8) * 620)
    const thorns = []
    const thornCount = Math.floor(r() * 2.5)

    for (let i = 0; i < thornCount; i += 1) {
      thorns.push({ u: 0.15 + r() * 0.65, s: r() < 0.5 ? -1 : 1 })
    }

    out.push({
      t: 'stem',
      id: nextId(),
      pts: points,
      segs: segments,
      d0: o.d0,
      dur,
      w: o.depth ? 0.82 : 1,
      thorns,
    })

    const leafCount = Math.floor(r() * 2.8 * p.leafy)
    let side = r() < 0.5 ? -1 : 1

    for (let i = 0; i < leafCount; i += 1) {
      const u = 0.25 + r() * 0.6
      const [q, a] = along(points, u)
      side = -side
      out.push({
        t: 'leaf',
        id: nextId(),
        x: q[0],
        y: q[1],
        a: a + side * (0.55 + r() * 0.5),
        L: (0.14 + r() * 0.2) * (o.depth ? 0.8 : 1),
        bend: (r() - 0.5) * 1.2,
        layer: layerAt(segments, u),
        d0: o.d0 + dur * u,
      })
    }

    const [tp, ta] = along(points, 1)
    const td = o.d0 + dur * 0.8
    const tipLayer = layerAt(segments, 1)

    if (tip === 'rose') {
      const R = (0.13 + r() * 0.15) * p.big * (o.depth ? 0.75 : 1)
      const overGlyph = tp[1] > -0.78 && tp[1] < 0.05 && Math.abs(tp[0]) < p.w * 0.5
      const layer = overGlyph ? (r() < 0.22 ? 1 : 0) : r() < 0.6 ? 1 : tipLayer

      out.push({
        t: 'rose',
        id: nextId(),
        x: tp[0],
        y: tp[1],
        R,
        rot: (r() - 0.5) * 1.0,
        ph1: r() * 6.28,
        ph2: r() * 6.28,
        turns: 1.8 + r() * 1,
        layer,
        d0: td,
      })

      if (r() < 0.2) {
        const off = ta + (r() < 0.5 ? 1 : -1) * 1.3
        out.push({
          t: 'rose',
          id: nextId(),
          x: tp[0] + Math.cos(off) * R * 1.4,
          y: tp[1] + Math.sin(off) * R * 1.4,
          R: R * (0.6 + r() * 0.3),
          rot: (r() - 0.5) * 1.2,
          ph1: r() * 6.28,
          ph2: r() * 6.28,
          turns: 1.8 + r(),
          layer,
          d0: td + 120,
        })
      }
    } else if (tip === 'fan') {
      const spread = 0.6 + r() * 0.3
      for (let j = 0; j < 2; j += 1) {
        out.push({
          t: 'leaf',
          id: nextId(),
          x: tp[0],
          y: tp[1],
          a: ta + (j - 0.5) * spread,
          L: 0.2 + r() * 0.2,
          bend: (j - 0.5) * 0.8,
          layer: tipLayer,
          d0: td + j * 60,
        })
      }
    } else if (tip === 'leaf') {
      out.push({
        t: 'leaf',
        id: nextId(),
        x: tp[0],
        y: tp[1],
        a: ta + (r() - 0.5) * 0.3,
        L: 0.16 + r() * 0.16,
        bend: r() - 0.5,
        layer: tipLayer,
        d0: td,
      })
    }

    if (!o.depth && r() < 0.3) {
      const u = 0.35 + r() * 0.35
      const [q, a] = along(points, u)
      grow(r, out, nextId, p, {
        base: q,
        dir: a + (r() < 0.5 ? -1 : 1) * (0.7 + r() * 0.4),
        len: (o.len || 0.8) * (0.35 + r() * 0.2),
        d0: o.d0 + dur * u,
        depth: 1,
        layer0: layerAt(segments, u),
      })
    }
  }

  function populate(letter, noise) {
    const r = rng((letter.ws ^ Math.imul(letter.wi + 1, 2654435761)) + noise)
    const p = wordParams(letter.ws)
    const els = []
    let k = 0
    const nextId = () => letter.id * 100 + k++
    const w = measure(letter.ch)
    p.w = w
    const inX = () => (r() - 0.5) * w * 0.7

    const upward = 1 + (r() < 0.45 ? 1 : 0)
    for (let i = 0; i < upward; i += 1) {
      grow(r, els, nextId, p, {
        base: [inX(), -r() * 0.3],
        dir: -Math.PI / 2 + p.lean * 0.5 + (r() - 0.5) * 0.7,
        len: 0.6 + r() * 0.5,
        d0: 40 + i * 130,
        tip: letter.wi === 0 && i === 0 ? 'rose' : null,
      })
    }

    if (r() < 0.4) {
      grow(r, els, nextId, p, {
        base: [inX(), -0.1 - r() * 0.35],
        dir: Math.PI / 2 + (r() - 0.5) * 0.8,
        len: 0.35 + r() * 0.35,
        d0: 160,
      })
    }

    // A stem that reaches back to the previous letter, so words knit together.
    if (letter.prev && r() < p.bridgeP) {
      const px = -(measure(letter.prev.ch) + w) / 2
      const a = [inX(), -0.05 - r() * 0.55]
      const b = [px + (r() - 0.5) * 0.25, -0.05 - r() * 0.55]
      const bulge = (r() < 0.55 ? -1 : 1) * (0.4 + r() * 0.4)
      const dx = b[0] - a[0]
      let bridge = bezier(
        a,
        [a[0] + dx * 0.15, a[1] + bulge],
        [b[0] - dx * 0.15, b[1] + bulge * 0.9],
        b,
        40,
      )
      if (r() < 0.45) bridge = bridge.slice(0, Math.floor(bridge.length * (0.7 + r() * 0.2)))

      grow(r, els, nextId, p, {
        pts: bridge,
        len: Math.abs(dx) + Math.abs(bulge),
        d0: 90,
        tip: r() < 0.5 ? 'curl' : r() < 0.5 ? 'leaf' : 'rose',
      })
    }

    if (letter.wi === 0) {
      grow(r, els, nextId, p, {
        base: [-w * 0.3, -0.15 - r() * 0.4],
        dir: Math.PI + (r() - 0.5) * 1.2,
        len: 0.45 + r() * 0.3,
        d0: 120,
        tip: 'curl',
      })
    }

    letter.els = els

    const tendril = []
    const tr = rng(letter.id * 977 + noise)
    grow(tr, tendril, () => letter.id * 100 + 90 + tendril.length, p, {
      base: [w * 0.25, -0.1 - tr() * 0.45],
      dir: (tr() - 0.5) * 1.4,
      len: 0.45 + tr() * 0.25,
      d0: 0,
      tip: 'curl',
      depth: 1,
    })
    letter.tend = tendril.filter((e) => e.t === 'stem').slice(0, 1)
  }

  function build() {
    const noise = seed % 1000000
    letters = []
    let prev = null
    let id = 1

    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i]
      if (ch === ' ') {
        const space = { ch: ' ', id: id++, els: [] }
        letters.push(space)
        prev = space
        continue
      }

      const sameWord = prev && prev.ch !== ' '
      const letter = {
        ch,
        id: id++,
        ws: sameWord ? prev.ws : Math.floor(rng(seed + i * 131)() * 1e9),
        wi: sameWord ? prev.wi + 1 : 0,
        prev: sameWord ? prev : null,
      }
      populate(letter, noise + i * 7919)
      letters.push(letter)
      prev = letter
    }
  }

  function layout() {
    if (!W || !H) return

    const maxW = W * 0.86
    const widthsPx = letters.map((l) => measure(l.ch))
    const unit = widthsPx.reduce((sum, w) => sum + w, 0)

    // Capped against height as well as width: the stems climb roughly one
    // cap-height above the glyphs and would clip against the top otherwise.
    S = unit > 0 ? Math.min(H * 0.4, maxW / unit) : H * 0.4

    let x = W / 2 - (unit * S) / 2
    const y = H * 0.68

    letters.forEach((l, i) => {
      const w = widthsPx[i] * S
      l.tx = x + w / 2
      l.ty = y
      l.tw = w
      l.x = l.tx
      l.y = l.ty
      x += w
    })
  }

  function warpPoint(letter, x, y) {
    let px = x
    let py = y

    if (letter.birth != null) {
      const t = (now - letter.birth) / 1000
      if (t > 0 && t < 2.5) {
        const height = Math.max(0, (letter.y - y) / S)
        const damp = Math.exp(-t * 3.2)
        const dir = letter.id % 2 ? 1 : -1
        px += S * 0.07 * height * damp * Math.sin(t * 11) * dir
        py += S * 0.035 * height * damp * Math.sin(t * 11 + 1.2)
      }
    }

    if (letter.lean) {
      const height = Math.min(2.5, Math.max(0, (letter.y - y) / S))
      const f = height * height * 0.5 + height * 0.5
      px += letter.lean[0] * S * 0.1 * f
      py += letter.lean[1] * S * 0.05 * f
    }

    const height = Math.max(0, (letter.y - py) / S)
    const phase = reduceMotion ? 0 : (now / BREATHE_PERIOD) * Math.PI * 2
    px += Math.sin(phase + letter.x * 0.004 + height * 1.1) * S * 0.03 * height
    py += Math.cos(phase + px * 0.003) * S * 0.008 * height

    return [px, py]
  }

  function faceTurn(el, x, y) {
    let wx = 0
    let wy = 0

    if (pointer) {
      const dx = pointer[0] - x
      const dy = pointer[1] - y
      const d = Math.hypot(dx, dy)
      const reach = 300
      if (d < reach && d > 0.001) {
        const w = 1 - d / reach
        const s = w * w * (3 - 2 * w) * Math.min(1, d / 40)
        wx = (dx / d) * s
        wy = (dy / d) * s
      }
    }

    const c = faces[el.id] || [0, 0]
    c[0] += (wx - c[0]) * 0.09
    c[1] += (wy - c[1]) * 0.09
    faces[el.id] = c
    return c
  }

  function thorn(points, u, s) {
    const [p, a] = along(points, u)
    const d = a + s * 2.3
    const L = S * 0.045
    brush.stroke([p, [p[0] + Math.cos(d) * L, p[1] + Math.sin(d) * L]], colors.stem, S * 0.022)
  }

  function drawStem(el, letter, age, frameIndex, amp, layer, override) {
    const fr = override != null ? override : easeOut((age - el.d0) / el.dur)
    if (fr <= 0) return

    const j = boil(el.id, frameIndex, amp)
    const points = el.pts.map((p) =>
      warpPoint(letter, letter.x + p[0] * S + j[0], letter.y + p[1] * S + j[1]),
    )

    el.segs.forEach((seg) => {
      if (seg.layer !== layer) return
      const b = Math.min(seg.u1, fr)
      if (b <= seg.u0) return
      strokeRange(brush, points, seg.u0, b, colors.stem, S * 0.022 * (el.w || 1))
    })

    el.thorns.forEach((t) => {
      if (fr > t.u && layerAt(el.segs, t.u) === layer) thorn(points, t.u, t.s)
    })
  }

  function drawElement(el, letter, age, frameIndex, amp) {
    const j = boil(el.id, frameIndex, amp)
    const place = (x, y) => warpPoint(letter, letter.x + x * S + j[0], letter.y + y * S + j[1])
    const sway = reduceMotion ? 0 : Math.sin((now / BREATHE_PERIOD) * Math.PI * 2 + el.id * 0.7) * 0.12

    if (el.t === 'leaf') {
      const scale = spring((age - el.d0) / 1000, 7, 15)
      if (scale <= 0) return
      const p = place(el.x, el.y)
      leaf(brush, p[0], p[1], el.a + j[2] + sway, el.L * S * scale, el.bend, colors)
      return
    }

    if (el.t === 'rose') {
      const a = age - el.d0
      if (a < 0) return
      const p = place(el.x, el.y)
      const tilt = faceTurn(el, p[0], p[1])
      rose(brush, p[0], p[1], el.R * S, el.rot + j[2] + sway + tilt[0] * 0.22, el, a, tilt, colors)
    }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const frameIndex = reduceMotion ? 0 : Math.floor(now / 120)
    const amp = reduceMotion ? 0 : Math.max(0.8, S * 0.01)

    // Letters lean toward the cursor, which the stems inherit through warpPoint.
    letters.forEach((l) => {
      let tx = 0
      let ty = 0

      if (pointer && l.ch !== ' ') {
        const dx = pointer[0] - l.x
        const dy = pointer[1] - (l.y - S * 0.6)
        const d = Math.hypot(dx, dy)
        const reach = Math.max(260, S * 3.2)
        if (d < reach && d > 1) {
          const w = 1 - d / reach
          const s = w * w * (3 - 2 * w)
          tx = (dx / d) * s
          ty = (dy / d) * s
        }
      }

      const c = l.lean || (l.lean = [0, 0])
      c[0] += (tx - c[0]) * 0.07
      c[1] += (ty - c[1]) * 0.07
    })

    const paintLayer = (layer) => {
      letters.forEach((l) => {
        if (l.ch === ' ' || !l.els) return
        const age = l.birth == null ? -1e6 : now - l.birth

        l.els.forEach((el) => {
          if (el.t === 'stem') drawStem(el, l, age, frameIndex, amp, layer)
          else if (el.layer === layer) drawElement(el, l, age, frameIndex, amp)
        })

        const index = letters.indexOf(l)
        const next = letters[index + 1]
        if (l.tend && (!next || next.ch === ' ')) {
          const fr = easeOut((age - 150) / 450)
          l.tend.forEach((el) => drawStem(el, l, age, frameIndex, amp, layer, fr))
        }
      })
    }

    paintLayer(0)
    letters.forEach((l) => {
      if (l.ch !== ' ') brush.text(l.ch, l.x, l.y, S, colors.text)
    })
    paintLayer(1)
  }

  function tick() {
    now = performance.now()
    draw()
    frame = window.requestAnimationFrame(tick)
  }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    dpr = window.devicePixelRatio || 1
    W = rect.width
    H = rect.height
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    layout()

    if (!frame) {
      now = performance.now()
      draw()
    }
  }

  function handlePointer(event) {
    const rect = canvas.getBoundingClientRect()
    pointer = [event.clientX - rect.left, event.clientY - rect.top]
  }

  function clearPointer() {
    pointer = null
  }

  build()
  resize()

  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
  if (observer) observer.observe(canvas)
  else window.addEventListener('resize', resize)

  window.addEventListener('pointermove', handlePointer, { passive: true })
  window.addEventListener('pointerleave', clearPointer)

  return {
    // Starts the growth run. Repeat calls are ignored so the name only blooms once.
    bloom() {
      if (bloomAt != null) return
      bloomAt = performance.now() + 120
      let i = 0
      letters.forEach((l) => {
        if (l.ch === ' ') return
        l.birth = bloomAt + i * LETTER_STAGGER
        i += 1
      })
    },
    setColor(color) {
      if (color) colors = { ...colors, bloom: color }
    },
    remeasure() {
      Object.keys(widths).forEach((key) => delete widths[key])
      resize()
    },
    setRunning(running) {
      if (running && !frame) {
        frame = window.requestAnimationFrame(tick)
      } else if (!running && frame) {
        window.cancelAnimationFrame(frame)
        frame = null
      }
    },
    destroy() {
      if (frame) window.cancelAnimationFrame(frame)
      if (observer) observer.disconnect()
      else window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('pointerleave', clearPointer)
    },
  }
}
