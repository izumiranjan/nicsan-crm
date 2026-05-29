import { useEffect, useRef } from 'react'

export default function PlasmaBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let t = 0

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (let wave = 0; wave < 4; wave++) {
        ctx.beginPath()
        for (let x = 0; x <= w; x += 3) {
          const y = h * 0.5 +
            Math.sin(x * 0.008 + t + wave * 0.8) * (h * 0.15) +
            Math.sin(x * 0.015 - t * 1.3 + wave) * (h * 0.08)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const colors = [
          'rgba(139,92,246,0.5)',
          'rgba(236,72,153,0.4)',
          'rgba(59,130,246,0.4)',
          'rgba(167,139,250,0.3)',
        ]
        ctx.strokeStyle = colors[wave]
        ctx.lineWidth = 3
        ctx.stroke()
      }

      for (let i = 0; i < 3; i++) {
        const x = w * (0.2 + 0.3 * Math.sin(t * 0.4 + i * 2.1))
        const y = h * (0.5 + 0.3 * Math.cos(t * 0.3 + i * 1.7))
        const grad = ctx.createRadialGradient(x, y, 0, x, y, w * 0.3)
        const glowColors = [
          ['rgba(139,92,246,0.3)', 'rgba(139,92,246,0)'],
          ['rgba(236,72,153,0.25)', 'rgba(236,72,153,0)'],
          ['rgba(59,130,246,0.25)', 'rgba(59,130,246,0)'],
        ]
        grad.addColorStop(0, glowColors[i][0])
        grad.addColorStop(1, glowColors[i][1])
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      t += 0.015
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}