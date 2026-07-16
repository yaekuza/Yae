import { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react'
import './App.css'

import img1 from './assets/img1.png'
import img2 from './assets/img2.png'
import img3 from './assets/img3.png'
import img4 from './assets/img4.png'
import img5 from './assets/img5.png'
import img6 from './assets/img6.png'
import img7 from './assets/img7.png'
import blackstar from './assets/blackstarr.png'
import starLogo from './assets/Star 33.png'

// img7 sits in the middle so it's framed by the fixed selector on load.
const images = [img1, img2, img3, img7, img4, img5, img6]
const loaderAssets = [starLogo, blackstar, ...images]
const DEFAULT_INDEX = 3
const N = images.length

// Thumbnail metrics (must match the CSS).
const ITEM_H = 225
const GAP = 18
const STEP = ITEM_H + GAP // vertical distance between two thumbnails
const SET_HEIGHT = N * STEP // height of one full set — the loop period

// The strip is rendered as several stacked copies so it can loop seamlessly;
// the scroll position is wrapped by one set height whenever it nears an end.
const COPIES = 5
const MIDDLE = 2 // copy we centre on initially
const loopImages = Array.from({ length: COPIES }, () => images).flat()

// Design canvas the composition is authored against.
const CANVAS_W = 1920
const CANVAS_H = 1080
const MIN_LOAD_TIME = 1800
const POST_LOAD_HOLD = 500

const loaderTiles = [
  { src: img1, className: 'loader-tile loader-tile--one', reveal: 6 },
  { src: img2, className: 'loader-tile loader-tile--two', reveal: 14 },
  { src: img3, className: 'loader-tile loader-tile--three', reveal: 22 },
  { src: img4, className: 'loader-tile loader-tile--four', reveal: 30 },
  { src: img5, className: 'loader-tile loader-tile--five', reveal: 38 },
  { src: img6, className: 'loader-tile loader-tile--six', reveal: 46 },
  { src: img7, className: 'loader-tile loader-tile--seven', reveal: 54 },
]

function useLoadingProgress(assets) {
  const [progress, setProgress] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    let cancelled = false
    let frame = 0
    let loaded = 0
    const started = performance.now()
    const total = Math.max(assets.length, 1)

    const completeAsset = () => {
      loaded += 1
    }

    const preloaders = assets.map((src) => {
      const image = new Image()
      image.onload = completeAsset
      image.onerror = completeAsset
      image.src = src
      return image
    })

    const tick = (now) => {
      if (cancelled) return

      const assetProgress = (loaded / total) * 100
      const timeProgress = Math.min(((now - started) / MIN_LOAD_TIME) * 100, 100)
      const nextProgress = Math.floor(Math.min(assetProgress, timeProgress))

      setProgress(nextProgress)

      if (assetProgress >= 100 && timeProgress >= 100) {
        setProgress(100)
        window.setTimeout(() => {
          if (!cancelled) setFinished(true)
        }, POST_LOAD_HOLD)
        return
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      preloaders.forEach((image) => {
        image.onload = null
        image.onerror = null
      })
    }
  }, [assets])

  return { progress, finished }
}

function LoadingScreen({ progress }) {
  return (
    <div className="loader" aria-label="Loading">
      <div className="loader-collage" aria-hidden="true">
        {loaderTiles.map((tile) => (
          <img
            key={tile.className}
            className={`${tile.className}${progress >= tile.reveal ? ' is-visible' : ''}`}
            src={tile.src}
            alt=""
          />
        ))}
        <img className="loader-logo" src={starLogo} alt="" />
      </div>
      <div className="loader-count" aria-live="polite" aria-atomic="true">
        {String(progress).padStart(2, '0')}
      </div>
    </div>
  )
}

function App() {
  const [active, setActive] = useState(DEFAULT_INDEX)
  const { progress, finished } = useLoadingProgress(loaderAssets)

  const listRef = useRef(null)
  const listRef2 = useRef(null)
  const selectorRef = useRef(null)
  const thumbRefs = useRef([])

  const target = useRef(0)
  const current = useRef(0)
  const raf = useRef(0)

  // Scale the composition canvas uniformly to fit the viewport, and expose
  // the horizontal letterbox (in canvas units) so right-edge elements can be
  // pushed out to the true viewport border.
  useLayoutEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H)
      const edgeX = Math.max(0, (window.innerWidth / s - CANVAS_W) / 2)
      const root = document.documentElement
      root.style.setProperty('--scale', s)
      root.style.setProperty('--edge-x', edgeX + 'px')
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  // Whichever thumbnail is closest to the (fixed) selector centre is active.
  const updateActive = useCallback(() => {
    const sel = selectorRef.current
    if (!sel) return
    const selCenter = sel.getBoundingClientRect().top + sel.offsetHeight / 2
    let best = 0
    let bestDist = Infinity
    thumbRefs.current.forEach((el, i) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      const dist = Math.abs(r.top + r.height / 2 - selCenter)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    setActive(best % N)
  }, [])

  // Keep both strips (the visible one and the inverted overlay) in sync.
  const setScroll = (v) => {
    if (listRef.current) listRef.current.scrollTop = v
    if (listRef2.current) listRef2.current.scrollTop = v
  }

  // Lerp the scroll toward the target, wrapping by one set for an endless loop.
  const animate = useCallback(function runScrollAnimation() {
    const list = listRef.current
    if (!list) return

    // Seamless wrap: shift both current and target by a whole set when we
    // approach either end (the content one set away is identical).
    const max = list.scrollHeight - list.clientHeight
    if (current.current < SET_HEIGHT) {
      current.current += SET_HEIGHT
      target.current += SET_HEIGHT
    } else if (current.current > max - SET_HEIGHT) {
      current.current -= SET_HEIGHT
      target.current -= SET_HEIGHT
    }

    const diff = target.current - current.current
    if (Math.abs(diff) < 0.4) {
      current.current = target.current
      setScroll(current.current)
      updateActive()
      raf.current = 0
      return
    }
    current.current += diff * 0.06
    setScroll(current.current)
    updateActive()
    raf.current = requestAnimationFrame(runScrollAnimation)
  }, [updateActive])

  const ensureRaf = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(animate)
  }, [animate])

  // Centre a given (DOM) thumbnail under the fixed selector.
  const scrollToDom = useCallback((j) => {
    const list = listRef.current
    const el = thumbRefs.current[j]
    if (!list || !el) return
    target.current = el.offsetTop + el.offsetHeight / 2 - list.clientHeight / 2
    ensureRaf()
  }, [ensureRaf])

  // Wheel drives the smooth scroll target. Attached natively (non-passive)
  // so preventDefault works; also sets the initial centred position.
  useLayoutEffect(() => {
    const list = listRef.current
    const el = thumbRefs.current[MIDDLE * N + DEFAULT_INDEX]
    if (!list || !el) return

    const start = el.offsetTop + el.offsetHeight / 2 - list.clientHeight / 2
    target.current = start
    current.current = start
    setScroll(start)
    updateActive()

    const onWheel = (e) => {
      e.preventDefault()
      target.current += e.deltaY
      ensureRaf()
    }
    list.addEventListener('wheel', onWheel, { passive: false })
    return () => list.removeEventListener('wheel', onWheel)
  }, [ensureRaf, updateActive])

  return (
    <>
      <div className={`viewport${finished ? ' is-loaded' : ''}`}>
        {/* Logo + headline pinned to the real viewport edges (outside the
            scaled canvas) so they reach the true page border. */}
        <img className="star" src={blackstar} alt="yae logo" />
        <h1 className="webdesign">WEB DESIGN</h1>

        <div className="stage">
          <figure className="feature">
            <img src={images[active]} alt="" />
          </figure>

          <div className="thumbs" ref={listRef}>
            {loopImages.map((src, i) => (
              <button
                key={i}
                ref={(el) => (thumbRefs.current[i] = el)}
                className={`thumb${i % N === active ? ' is-active' : ''}`}
                onClick={() => scrollToDom(i)}
                aria-label={`Select image ${(i % N) + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>

          {/* Inverted copy of the strip, masked to the circle. Only the images
              exist here (gaps are transparent), so only images get the effect. */}
          <div className="thumbs thumbs--invert" ref={listRef2} aria-hidden="true">
            {loopImages.map((src, i) => (
              <div key={i} className="thumb">
                <img src={src} alt="" />
              </div>
            ))}
          </div>

          {/* Fixed selector frame: cut-corner black square with a circular
              hole, pinned over the column centre. */}
          <div className="selector" aria-hidden="true" ref={selectorRef} />
        </div>
      </div>
      {!finished && <LoadingScreen progress={progress} />}
    </>
  )
}

export default App
