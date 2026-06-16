'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface Props {
  logos: string[]
}

export default function DraggableLogoField({ logos }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!containerRef.current || !canvasRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()

    const engine = Matter.Engine.create({ gravity: { y: 0.4 } })
    const runner = Matter.Runner.create()

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
      },
    })

    const wallOpts = { isStatic: true, render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 } }
    const walls = [
      Matter.Bodies.rectangle(width / 2, -25, width, 50, wallOpts),
      Matter.Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts),
      Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOpts),
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOpts),
    ]

    const bodies = logos.map((label) => {
      const w = label.length * 9 + 48
      const h = 36
      const x = Math.random() * (width - w) + w / 2
      const y = Math.random() * (height - h) + h / 2
      const body = Matter.Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: 18 },
        restitution: 0.6,
        friction: 0.05,
        frictionAir: 0.01,
        render: { fillStyle: '#141414', strokeStyle: '#FF4500', lineWidth: 1 },
      })
      ;(body as any).chipLabel = label
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
      })
      return body
    })

    Matter.Composite.add(engine.world, [...walls, ...bodies])

    const mouse = Matter.Mouse.create(canvasRef.current)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    Matter.Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse

    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context
      ctx.save()
      ctx.font = '700 11px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      bodies.forEach((body) => {
        ctx.fillStyle = '#FF4500'
        ctx.fillText((body as any).chipLabel, body.position.x, body.position.y)
      })
      ctx.restore()
    })

    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)

    return () => {
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      Matter.Events.off(render, 'afterRender', () => {})
    }
  }, [logos])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '320px', overflow: 'hidden', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}
