'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type GameMode = 'network' | 'packet'

type NodeItem = {
  x: number
  y: number
  broken: boolean
}

type Obstacle = {
  x: number
  w: number
  gapY: number
  gapH: number
  passed: boolean
}

const NETWORK_W = 760
const NETWORK_H = 360
const PACKET_W = 760
const PACKET_H = 360
const GLOBAL_BEST_KEY = 'vc_global_game_best'

const EasterEggGames = () => {
  const [activeGame, setActiveGame] = useState<GameMode>('network')
  const [touchDevice, setTouchDevice] = useState(false)
  const [shouldRenderGames, setShouldRenderGames] = useState<boolean | null>(null)

  const networkCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const packetCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [networkRunning, setNetworkRunning] = useState(false)
  const [networkScore, setNetworkScore] = useState(0)
  const [networkTime, setNetworkTime] = useState(30)

  const [packetRunning, setPacketRunning] = useState(false)
  const [packetScore, setPacketScore] = useState(0)
  const [packetBest, setPacketBest] = useState(0)
  const [packetGames, setPacketGames] = useState(0)
  const packetScoreRef = useRef(0)
  const networkScoreRef = useRef(0)
  const [globalBest, setGlobalBest] = useState(0)
  const [beatPrompt, setBeatPrompt] = useState<{ open: boolean; score: number; game: string }>({
    open: false,
    score: 0,
    game: '',
  })

  const networkNodes = useRef<NodeItem[]>([])
  const networkMouse = useRef({ x: -999, y: -999 })
  const networkBreakTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const networkFrame = useRef<number | null>(null)
  const networkCountdown = useRef<ReturnType<typeof setInterval> | null>(null)

  const packetFrame = useRef<number | null>(null)
  const packetPlayerY = useRef(PACKET_H / 2)
  const packetVel = useRef(0)
  const packetObstacles = useRef<Obstacle[]>([])
  const packetSpeed = useRef(3.4)
  const packetTick = useRef(0)

  const canShowNetwork = activeGame === 'network'
  const canShowPacket = activeGame === 'packet'

  const networkInstructions = useMemo(
    () =>
      networkRunning
        ? touchDevice
          ? 'Drag your finger across red nodes to repair them before time runs out.'
          : 'Move your mouse over red nodes to repair them before time runs out.'
        : touchDevice
          ? 'Tap Start and swipe across red nodes to repair your network.'
          : 'Click Start and hover over red nodes to repair your network.',
    [networkRunning, touchDevice],
  )

  const packetInstructions = useMemo(
    () =>
      packetRunning
        ? touchDevice
          ? 'Tap the canvas or Flap button to stay airborne and pass through gaps.'
          : 'Press Space or Arrow Up to flap and pass through the pipe gaps.'
        : touchDevice
          ? 'Tap Start, then tap to flap.'
          : 'Click Start, then use Space / Arrow Up to flap.',
    [packetRunning, touchDevice],
  )

  useEffect(() => {
    const existingRoll = window.sessionStorage.getItem('vc_games_roll')
    if (existingRoll === 'show' || existingRoll === 'hide') {
      setShouldRenderGames(existingRoll === 'show')
    } else {
      const show = Math.random() < 0.5
      window.sessionStorage.setItem('vc_games_roll', show ? 'show' : 'hide')
      setShouldRenderGames(show)
    }

    setTouchDevice(window.matchMedia('(pointer: coarse)').matches)
    const storedBest = Number(window.localStorage.getItem('vc_packet_best') ?? '0')
    const storedGames = Number(window.localStorage.getItem('vc_packet_games') ?? '0')
    const storedGlobal = Number(window.localStorage.getItem(GLOBAL_BEST_KEY) ?? '0')
    setPacketBest(storedBest)
    setPacketGames(storedGames)
    setGlobalBest(storedGlobal)
  }, [])

  if (shouldRenderGames !== true) return null

  const registerGlobalScore = (score: number, game: string) => {
    if (score <= 0) return
    const stored = Number(window.localStorage.getItem(GLOBAL_BEST_KEY) ?? '0')
    if (score > stored) {
      window.localStorage.setItem(GLOBAL_BEST_KEY, String(score))
      setGlobalBest(score)
      setBeatPrompt({ open: true, score, game })
      return
    }
    setGlobalBest(stored)
  }

  useEffect(() => {
    if (!networkCanvasRef.current) return
    const canvas = networkCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (networkNodes.current.length === 0) {
      networkNodes.current = Array.from({ length: 18 }).map((_, idx) => {
        const col = idx % 6
        const row = Math.floor(idx / 6)
        return {
          x: 80 + col * 120 + Math.random() * 10,
          y: 70 + row * 100 + Math.random() * 12,
          broken: false,
        }
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, NETWORK_W, NETWORK_H)

      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, NETWORK_W, NETWORK_H)

      for (let i = 0; i < networkNodes.current.length; i += 1) {
        const nodeA = networkNodes.current[i]
        for (let j = i + 1; j < networkNodes.current.length; j += 1) {
          const nodeB = networkNodes.current[j]
          const dx = nodeA.x - nodeB.x
          const dy = nodeA.y - nodeB.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 190) {
            ctx.strokeStyle = 'rgba(161,161,170,0.18)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.stroke()
          }
        }
      }

      for (const node of networkNodes.current) {
        const dx = networkMouse.current.x - node.x
        const dy = networkMouse.current.y - node.y
        const hovering = Math.sqrt(dx * dx + dy * dy) < 30
        const pulsePhase = Date.now() * 0.008 + node.x * 0.03 + node.y * 0.02
        const pulse = node.broken ? (Math.sin(pulsePhase) + 1) * 0.5 : 0

        if (node.broken && hovering && networkRunning) {
          node.broken = false
          setNetworkScore((s) => {
            const next = s + 1
            networkScoreRef.current = next
            return next
          })
        }

        ctx.fillStyle = node.broken ? '#ef4444' : '#22c55e'
        ctx.strokeStyle = node.broken ? '#fecaca' : '#dcfce7'
        ctx.lineWidth = 2.2
        ctx.shadowColor = node.broken ? 'rgba(239,68,68,0.98)' : 'rgba(34,197,94,0.9)'
        ctx.shadowBlur = node.broken ? 18 + pulse * 18 : 20
        const nodeRadius = node.broken ? 10.5 + pulse * 3.2 : 11.5
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = node.broken ? '#7f1d1d' : '#14532d'
        ctx.arc(node.x, node.y, 3.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      networkFrame.current = window.requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (networkFrame.current) window.cancelAnimationFrame(networkFrame.current)
    }
  }, [networkRunning])

  useEffect(() => {
    if (!networkRunning) return

    networkBreakTimer.current = window.setInterval(() => {
      const idx = Math.floor(Math.random() * networkNodes.current.length)
      networkNodes.current[idx].broken = true
    }, 680)

    networkCountdown.current = window.setInterval(() => {
      setNetworkTime((t) => {
        if (t <= 1) {
          registerGlobalScore(networkScoreRef.current, 'Network Repair')
          setNetworkRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      if (networkBreakTimer.current) window.clearInterval(networkBreakTimer.current)
      if (networkCountdown.current) window.clearInterval(networkCountdown.current)
    }
  }, [networkRunning])

  useEffect(() => {
    if (!packetCanvasRef.current) return
    const canvas = packetCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const flap = () => {
      if (!packetRunning) return
      packetVel.current = -5.15
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!packetRunning) return
      if (event.key === 'ArrowUp' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault()
        flap()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    const draw = () => {
      ctx.clearRect(0, 0, PACKET_W, PACKET_H)
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, PACKET_W, PACKET_H)

      for (let i = 0; i < 22; i += 1) {
        ctx.strokeStyle = 'rgba(249,115,22,0.06)'
        ctx.beginPath()
        ctx.moveTo(i * 38, 0)
        ctx.lineTo(i * 38, PACKET_H)
        ctx.stroke()
      }

      for (let i = 0; i < 12; i += 1) {
        ctx.strokeStyle = 'rgba(249,115,22,0.05)'
        ctx.beginPath()
        ctx.moveTo(0, i * 34)
        ctx.lineTo(PACKET_W, i * 34)
        ctx.stroke()
      }

      if (packetRunning) {
        packetTick.current += 1
        packetVel.current += 0.28
        packetPlayerY.current += packetVel.current

        if (packetTick.current % 90 === 0) {
          const gapH = 100
          const gapY = 55 + Math.random() * (PACKET_H - 150)
          packetObstacles.current.push({
            x: PACKET_W + 8,
            w: 54,
            gapY,
            gapH,
            passed: false,
          })
        }
      }

      const playerX = 120
      const playerY = packetPlayerY.current

      for (const obstacle of packetObstacles.current) {
        obstacle.x -= packetSpeed.current
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(obstacle.x, 0, obstacle.w, obstacle.gapY)
        ctx.fillRect(obstacle.x, obstacle.gapY + obstacle.gapH, obstacle.w, PACKET_H - (obstacle.gapY + obstacle.gapH))

        ctx.fillStyle = '#b91c1c'
        ctx.fillRect(obstacle.x - 2, obstacle.gapY - 10, obstacle.w + 4, 10)
        ctx.fillRect(obstacle.x - 2, obstacle.gapY + obstacle.gapH, obstacle.w + 4, 10)

        if (!obstacle.passed && obstacle.x + obstacle.w < playerX) {
          obstacle.passed = true
          packetScoreRef.current += 1
          setPacketScore(packetScoreRef.current)
        }
      }

      packetObstacles.current = packetObstacles.current.filter((o) => o.x + o.w > -20)

      if (packetRunning) {
        if (playerY < 10 || playerY > PACKET_H - 10) {
          registerGlobalScore(packetScoreRef.current, 'Packet Rush')
          setPacketRunning(false)
        }

        for (const obstacle of packetObstacles.current) {
          const hit =
            playerX + 10 > obstacle.x &&
            playerX - 11 < obstacle.x + obstacle.w &&
            (playerY - 10 < obstacle.gapY || playerY + 10 > obstacle.gapY + obstacle.gapH)
          if (hit) {
            registerGlobalScore(packetScoreRef.current, 'Packet Rush')
            setPacketRunning(false)
            break
          }
        }
      }

      ctx.fillStyle = '#f97316'
      ctx.beginPath()
      ctx.arc(playerX, playerY, 11, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#f5f5f5'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(`Score: ${packetScoreRef.current}`, 20, 28)
      ctx.fillText('Mode: Flap', 20, 48)

      packetFrame.current = window.requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (packetFrame.current) window.cancelAnimationFrame(packetFrame.current)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [packetRunning])

  useEffect(() => {
    if (packetRunning) return
    if (packetScore <= 0) return

    setPacketGames((games) => {
      const next = games + 1
      window.localStorage.setItem('vc_packet_games', String(next))
      return next
    })
    setPacketBest((best) => {
      const next = Math.max(best, packetScore)
      window.localStorage.setItem('vc_packet_best', String(next))
      return next
    })
  }, [packetRunning, packetScore])

  const startNetworkGame = () => {
    networkNodes.current.forEach((n) => {
      n.broken = false
    })
    networkScoreRef.current = 0
    setNetworkScore(0)
    setNetworkTime(30)
    setBeatPrompt({ open: false, score: 0, game: '' })
    setNetworkRunning(true)
  }

  const startPacketGame = () => {
    packetScoreRef.current = 0
    setPacketScore(0)
    packetPlayerY.current = PACKET_H / 2
    packetVel.current = 0
    packetSpeed.current = 3.4
    packetTick.current = 0
    packetObstacles.current = []
    setBeatPrompt({ open: false, score: 0, game: '' })
    setPacketRunning(true)
  }

  const setNetworkPointer = (
    clientX: number,
    clientY: number,
    target: EventTarget & HTMLCanvasElement,
  ) => {
    const rect = target.getBoundingClientRect()
    const scaleX = NETWORK_W / rect.width
    const scaleY = NETWORK_H / rect.height
    networkMouse.current.x = (clientX - rect.left) * scaleX
    networkMouse.current.y = (clientY - rect.top) * scaleY
  }

  const moveUp = () => {
    if (!packetRunning) return
    packetVel.current = -5.15
  }

  const stopMove = () => {
    return
  }

  return (
    <section className="relative overflow-hidden border-y border-zinc-900 bg-[radial-gradient(circle_at_16%_15%,rgba(249,115,22,0.12),transparent_38%),radial-gradient(circle_at_82%_80%,rgba(249,115,22,0.09),transparent_36%),linear-gradient(to_bottom,#070708,#0a0a0c)] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Easter Eggs</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Play While You Wait</h2>
          <p className="mt-4 text-zinc-300">Two lightweight mini games inspired by your original site.</p>
          <p className="mt-4 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/90 px-4 py-1.5 text-sm font-bold text-zinc-200">
            Global High Score: <span className="ml-2 text-[#f97316]">{globalBest}</span>
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => setActiveGame('network')}
            className={`w-1/2 rounded-lg px-3 py-2 text-sm font-bold transition ${
              canShowNetwork ? 'bg-[#f97316] text-white' : 'text-zinc-300 hover:text-white'
            }`}
          >
            Network Repair
          </button>
          <button
            type="button"
            onClick={() => setActiveGame('packet')}
            className={`w-1/2 rounded-lg px-3 py-2 text-sm font-bold transition ${
              canShowPacket ? 'bg-[#f97316] text-white' : 'text-zinc-300 hover:text-white'
            }`}
          >
            Packet Rush
          </button>
        </div>

        {canShowNetwork ? (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-[linear-gradient(145deg,rgba(15,15,16,0.92),rgba(8,8,9,0.98))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.42)] sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-300">{networkInstructions}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-1.5">Time: {networkTime}s</span>
                <span className="rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-1.5">Score: {networkScore}</span>
                <button
                  type="button"
                  onClick={startNetworkGame}
                  className="rounded-md bg-[#f97316] px-3 py-1.5 font-bold text-white hover:brightness-110"
                >
                  {networkRunning ? 'Restart' : 'Start'}
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <canvas
                ref={networkCanvasRef}
                width={NETWORK_W}
                height={NETWORK_H}
                className="block h-auto w-full"
                onMouseMove={(event) => {
                  setNetworkPointer(event.clientX, event.clientY, event.target as HTMLCanvasElement)
                }}
                onMouseLeave={() => {
                  networkMouse.current.x = -999
                  networkMouse.current.y = -999
                }}
                onTouchStart={(event) => {
                  const touch = event.touches[0]
                  if (!touch) return
                  setNetworkPointer(touch.clientX, touch.clientY, event.currentTarget)
                }}
                onTouchMove={(event) => {
                  const touch = event.touches[0]
                  if (!touch) return
                  setNetworkPointer(touch.clientX, touch.clientY, event.currentTarget)
                }}
                onTouchEnd={() => {
                  networkMouse.current.x = -999
                  networkMouse.current.y = -999
                }}
              />
            </div>
          </div>
        ) : null}

        {canShowPacket ? (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-[linear-gradient(145deg,rgba(15,15,16,0.92),rgba(8,8,9,0.98))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.42)] sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-300">{packetInstructions}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-1.5">Score: {packetScore}</span>
                <span className="rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-1.5">Best: {packetBest}</span>
                <span className="rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-1.5">Games: {packetGames}</span>
                <button
                  type="button"
                  onClick={startPacketGame}
                  className="rounded-md bg-[#f97316] px-3 py-1.5 font-bold text-white hover:brightness-110"
                >
                  {packetRunning ? 'Restart' : 'Start'}
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <canvas
                ref={packetCanvasRef}
                width={PACKET_W}
                height={PACKET_H}
                className="block h-auto w-full"
                onTouchStart={(event) => {
                  if (!touchDevice || !packetRunning) return
                  event.preventDefault()
                  moveUp()
                }}
                onClick={() => {
                  if (!packetRunning) return
                  moveUp()
                }}
              />
            </div>

            {touchDevice ? (
              <div className="mt-4 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onTouchStart={moveUp}
                  onTouchEnd={stopMove}
                  onMouseDown={moveUp}
                  onMouseUp={stopMove}
                  onMouseLeave={stopMove}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-3 text-sm font-bold text-zinc-100 active:scale-[0.98]"
                >
                  Flap
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {beatPrompt.open ? (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
            <p className="text-sm font-bold text-emerald-300">
              New Global High Score! {beatPrompt.score} on {beatPrompt.game}
            </p>
            <button
              type="button"
              onClick={() => {
                const msg = encodeURIComponent(
                  `Hi Valley Computers! I just beat the global high score with ${beatPrompt.score} points on ${beatPrompt.game}.`,
                )
                window.open(`https://wa.me/27799381260?text=${msg}`, '_blank', 'noopener,noreferrer')
              }}
              className="mt-3 rounded-lg bg-[#f97316] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
            >
              Let you know on WhatsApp
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default EasterEggGames
