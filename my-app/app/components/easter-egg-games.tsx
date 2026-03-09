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
  openLane: number
  passed: boolean
}

const NETWORK_W = 760
const NETWORK_H = 360
const PACKET_W = 760
const PACKET_H = 360
const PACKET_LANES = 4
const PACKET_PLAYER_X = 120
const GLOBAL_BEST_KEY = 'vc_global_game_best'
const NETWORK_BEST_KEY = 'vc_network_best'
const PACKET_BEST_KEY = 'vc_packet_best'

const EasterEggGames = () => {
  // Helper functions for lazy initialization
  const getInitialGameShow = (): boolean | null => {
    if (typeof window === 'undefined') return null
    const existingRoll = window.sessionStorage.getItem('vc_games_roll')
    if (existingRoll === 'show' || existingRoll === 'hide') {
      return existingRoll === 'show'
    }
    return null // Will be determined in useEffect
  }

  const getInitialScores = () => {
    if (typeof window === 'undefined') {
      return {
        networkBest: 0,
        packetBest: 0,
        packetGames: 0,
        globalBest: 0,
      }
    }
    return {
      networkBest: Number(window.localStorage.getItem(NETWORK_BEST_KEY) ?? '0'),
      packetBest: Number(window.localStorage.getItem(PACKET_BEST_KEY) ?? '0'),
      packetGames: Number(window.localStorage.getItem('vc_packet_games') ?? '0'),
      globalBest: Number(window.localStorage.getItem(GLOBAL_BEST_KEY) ?? '0'),
    }
  }

  const [activeGame, setActiveGame] = useState<GameMode>('network')
  const [touchDevice] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  )
  const [shouldRenderGames, setShouldRenderGames] = useState<boolean | null>(getInitialGameShow)

  const networkCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const packetCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [networkRunning, setNetworkRunning] = useState(false)
  const [networkScore, setNetworkScore] = useState(0)
  const initialScores = getInitialScores()
  const [networkBest, setNetworkBest] = useState(initialScores.networkBest)
  const [networkTime, setNetworkTime] = useState(30)

  const [packetRunning, setPacketRunning] = useState(false)
  const [packetScore, setPacketScore] = useState(0)
  const [packetBest, setPacketBest] = useState(initialScores.packetBest)
  const [packetGames, setPacketGames] = useState(initialScores.packetGames)
  const packetScoreRef = useRef(0)
  const packetGamesRef = useRef(initialScores.packetGames)
  const packetBestRef = useRef(initialScores.packetBest)
  const networkScoreRef = useRef(0)
  const [globalBest, setGlobalBest] = useState(initialScores.globalBest)
  const [beatPrompt, setBeatPrompt] = useState<{ open: boolean; score: number; game: string }>({
    open: false,
    score: 0,
    game: '',
  })

  const networkNodes = useRef<NodeItem[]>([])
  const networkMouse = useRef({ x: -999, y: -999 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const networkBreakTimer = useRef<any>(null)
  const networkFrame = useRef<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const networkCountdown = useRef<any>(null)

  const packetFrame = useRef<number | null>(null)
  const packetPlayerY = useRef(PACKET_H / 2)
  const packetLane = useRef(1)
  const packetTargetLane = useRef(1)
  const packetPulse = useRef(0)
  const packetObstacles = useRef<Obstacle[]>([])
  const packetSpeed = useRef(3.8)
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
          ? 'Tap upper/lower areas to reroute the packet through each green lane.'
          : 'Use Arrow Up/Down or W/S to reroute the packet through each open lane.'
        : touchDevice
          ? 'Tap Start, then route up or down to avoid blocked lanes.'
          : 'Click Start, then route with Arrow Up/Down or W/S.',
    [packetRunning, touchDevice],
  )

  useEffect(() => {
    // Only determine random show/hide if it wasn't already set
    if (shouldRenderGames === null) {
      const show = Math.random() < 0.5
      window.sessionStorage.setItem('vc_games_roll', show ? 'show' : 'hide')
      // Defer setState to avoid cascading renders
      setTimeout(() => setShouldRenderGames(show), 0)
    }
  }, [shouldRenderGames])

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
          // Save best score for network game
          setNetworkBest((best) => {
            const next = Math.max(best, networkScoreRef.current)
            window.localStorage.setItem(NETWORK_BEST_KEY, String(next))
            return next
          })
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

    const laneHeight = PACKET_H / PACKET_LANES
    const laneCenter = (lane: number) => lane * laneHeight + laneHeight / 2
    const clampLane = (lane: number) => Math.max(0, Math.min(PACKET_LANES - 1, lane))

    const reroute = (direction: -1 | 1) => {
      if (!packetRunning) return
      const next = clampLane(packetTargetLane.current + direction)
      packetTargetLane.current = next
      packetPulse.current = 8
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!packetRunning) return
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault()
        reroute(-1)
      }
      if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault()
        reroute(1)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    const draw = () => {
      ctx.clearRect(0, 0, PACKET_W, PACKET_H)
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, PACKET_W, PACKET_H)

      for (let i = 0; i <= PACKET_LANES; i += 1) {
        ctx.strokeStyle = 'rgba(249,115,22,0.12)'
        ctx.beginPath()
        ctx.moveTo(0, i * laneHeight)
        ctx.lineTo(PACKET_W, i * laneHeight)
        ctx.stroke()
      }

      for (let i = 0; i < 24; i += 1) {
        const x = i * 34
        ctx.strokeStyle = 'rgba(249,115,22,0.06)'
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, PACKET_H)
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(245,245,245,0.72)'
      ctx.font = 'bold 11px Arial'
      for (let lane = 0; lane < PACKET_LANES; lane += 1) {
        ctx.fillText(`Lane ${lane + 1}`, 16, laneCenter(lane) - 12)
      }

      if (packetRunning) {
        packetTick.current += 1
        packetSpeed.current = Math.min(6.2, packetSpeed.current + 0.0009)

        if (packetTick.current % 78 === 0) {
          const openLane = Math.floor(Math.random() * PACKET_LANES)
          packetObstacles.current.push({
            x: PACKET_W + 8,
            w: 70,
            openLane,
            passed: false,
          })
        }
      }

      const targetY = laneCenter(packetTargetLane.current)
      packetPlayerY.current += (targetY - packetPlayerY.current) * 0.24
      if (Math.abs(packetPlayerY.current - targetY) < 0.5) {
        packetPlayerY.current = targetY
      }

      if (packetPulse.current > 0) {
        packetPulse.current -= 0.35
      }

      const playerX = PACKET_PLAYER_X
      const playerY = packetPlayerY.current

      for (const obstacle of packetObstacles.current) {
        if (packetRunning) {
          obstacle.x -= packetSpeed.current
        }

        for (let lane = 0; lane < PACKET_LANES; lane += 1) {
          const y = lane * laneHeight
          if (lane === obstacle.openLane) {
            ctx.fillStyle = 'rgba(34,197,94,0.22)'
            ctx.fillRect(obstacle.x, y + 6, obstacle.w, laneHeight - 12)
            continue
          }
          ctx.fillStyle = '#b91c1c'
          ctx.fillRect(obstacle.x, y, obstacle.w, laneHeight)
        }

        ctx.fillStyle = 'rgba(248,113,113,0.5)'
        ctx.fillRect(obstacle.x - 2, 0, 2, PACKET_H)
        ctx.fillRect(obstacle.x + obstacle.w, 0, 2, PACKET_H)

        if (packetRunning && !obstacle.passed && obstacle.x + obstacle.w < playerX - 12) {
          obstacle.passed = true
          packetScoreRef.current += 1
          setPacketScore(packetScoreRef.current)
        }
      }

      packetObstacles.current = packetObstacles.current.filter((o) => o.x + o.w > -20)

      if (packetRunning) {
        const currentLane = clampLane(Math.floor(playerY / laneHeight))
        for (const obstacle of packetObstacles.current) {
          const hitX = playerX + 10 > obstacle.x && playerX - 10 < obstacle.x + obstacle.w
          const hit = hitX && currentLane !== obstacle.openLane
          if (hit) {
            registerGlobalScore(packetScoreRef.current, 'Packet Rush')
            setPacketRunning(false)
            break
          }
        }
      }

      ctx.fillStyle = '#f97316'
      ctx.beginPath()
      ctx.moveTo(playerX - 13, playerY - 9)
      ctx.lineTo(playerX + 11, playerY)
      ctx.lineTo(playerX - 13, playerY + 9)
      ctx.closePath()
      ctx.fill()

      if (packetPulse.current > 0) {
        ctx.strokeStyle = `rgba(249,115,22,${Math.min(0.75, packetPulse.current / 8)})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(playerX - 18, playerY, 11 + packetPulse.current * 1.2, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.fillStyle = '#f5f5f5'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(`Score: ${packetScoreRef.current}`, 20, 28)
      ctx.fillText('Mode: Routed Transit', 20, 48)

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

    // Use refs to avoid setState in useEffect
    const currentGames = packetGamesRef.current || packetGames
    const nextGames = currentGames + 1
    packetGamesRef.current = nextGames
    window.localStorage.setItem('vc_packet_games', String(nextGames))
    // Defer setState to avoid cascading renders
    setTimeout(() => setPacketGames(nextGames), 0)

    const currentBest = packetBestRef.current || packetBest
    const nextBest = Math.max(currentBest, packetScore)
    packetBestRef.current = nextBest
    window.localStorage.setItem(PACKET_BEST_KEY, String(nextBest))
    // Defer setState to avoid cascading renders
    setTimeout(() => setPacketBest(nextBest), 0)
  }, [packetRunning, packetScore, packetGames, packetBest])

  const startNetworkGame = () => {
    // Reset all nodes to working state
    networkNodes.current.forEach((n) => {
      n.broken = false
    })
    // Reset score - update ref FIRST before state
    networkScoreRef.current = 0
    setNetworkScore(0)
    setNetworkTime(30)
    setBeatPrompt({ open: false, score: 0, game: '' })
    // Clear any existing intervals to prevent race conditions
    if (networkBreakTimer.current) {
      clearInterval(networkBreakTimer.current)
      networkBreakTimer.current = null
    }
    if (networkCountdown.current) {
      clearInterval(networkCountdown.current)
      networkCountdown.current = null
    }
    setNetworkRunning(true)
  }

  const startPacketGame = () => {
    // Reset score - update ref FIRST before state
    packetScoreRef.current = 0
    setPacketScore(0)
    // Reset lane positions properly
    packetLane.current = 1
    packetTargetLane.current = 1
    // Calculate correct Y position based on lane (center of lane)
    const laneHeight = PACKET_H / PACKET_LANES
    packetPlayerY.current = (1 + 0.5) * laneHeight // Lane 1 center
    packetPulse.current = 0
    packetSpeed.current = 3.8
    packetTick.current = 0
    // Clear existing obstacles
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

  const routePacketUp = () => {
    if (!packetRunning) return
    packetTargetLane.current = Math.max(0, packetTargetLane.current - 1)
    packetPulse.current = 8
  }

  const routePacketDown = () => {
    if (!packetRunning) return
    packetTargetLane.current = Math.min(PACKET_LANES - 1, packetTargetLane.current + 1)
    packetPulse.current = 8
  }

  if (shouldRenderGames !== true) return null

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
                <span className="rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-1.5">Best: {networkBest}</span>
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
                  if (!packetRunning) return
                  event.preventDefault()
                  const touch = event.touches[0]
                  if (!touch) return
                  const rect = event.currentTarget.getBoundingClientRect()
                  const scaleY = PACKET_H / rect.height
                  const y = (touch.clientY - rect.top) * scaleY
                  const laneHeight = PACKET_H / PACKET_LANES
                  if (y < laneHeight * 2) {
                    routePacketUp()
                    return
                  }
                  routePacketDown()
                }}
                onClick={(event) => {
                  if (!packetRunning) return
                  const rect = event.currentTarget.getBoundingClientRect()
                  const scaleY = PACKET_H / rect.height
                  const y = (event.clientY - rect.top) * scaleY
                  const laneHeight = PACKET_H / PACKET_LANES
                  if (y < laneHeight * 2) {
                    routePacketUp()
                    return
                  }
                  routePacketDown()
                }}
              />
            </div>

            {touchDevice ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onTouchStart={routePacketUp}
                  onMouseDown={routePacketUp}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-3 text-sm font-bold text-zinc-100 active:scale-[0.98]"
                >
                  Route Up
                </button>
                <button
                  type="button"
                  onTouchStart={routePacketDown}
                  onMouseDown={routePacketDown}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-3 text-sm font-bold text-zinc-100 active:scale-[0.98]"
                >
                  Route Down
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
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const scoreMsg = `Hi Valley Computers! I just beat the global high score with ${beatPrompt.score} points on ${beatPrompt.game}.`
                  // Use WhatsApp API format with proper encoding
                  const whatsappUrl = `https://wa.me/27799381260?text=${encodeURIComponent(scoreMsg)}`
                  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
                }}
                className="rounded-lg bg-[#25D366] hover:bg-[#20BD5A] px-4 py-2 text-sm font-bold text-white transition"
              >
                Send via WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  const subject = encodeURIComponent('New high score submission')
                  const body = encodeURIComponent(
                    `Hi Valley Computers,%0D%0A%0D%0AI just beat the global high score with ${beatPrompt.score} points on ${beatPrompt.game}.`,
                  )
                  window.location.href = `mailto:info@valleycomputers.co.za?subject=${subject}&body=${body}`
                }}
                className="rounded-lg border border-zinc-600 bg-zinc-900/80 px-4 py-2 text-sm font-bold text-zinc-100 transition hover:border-zinc-500"
              >
                Send Score to Us
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default EasterEggGames
