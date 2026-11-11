import { useEffect, useRef } from 'react'
import { createGarden } from './garden'

export default function GardenName({ text, color, active }) {
  const canvasRef = useRef()
  const gardenRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const garden = createGarden(canvas, { text })
    gardenRef.current = garden

    // The serif is measured on the canvas, so a late webfont swap needs a relayout.
    document.fonts.ready.then(() => {
      if (gardenRef.current === garden) {
        garden.remeasure()
      }
    })

    return () => {
      garden.destroy()
      gardenRef.current = null
    }
  }, [text])

  useEffect(() => {
    gardenRef.current?.setColor(color)
  }, [color])

  useEffect(() => {
    const garden = gardenRef.current

    if (!garden) {
      return undefined
    }

    garden.setRunning(active)

    if (active) {
      garden.bloom()
    }

    return () => garden.setRunning(false)
  }, [active])

  return (
    <canvas className="home-footer-canvas" ref={canvasRef} role="img" aria-label={text} />
  )
}
