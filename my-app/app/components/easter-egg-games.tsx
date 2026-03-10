'use client'

import { useEffect, useRef, useState } from 'react'

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

// ─── Logical (design) dimensions ─────────────────────────────────────────────
// All game coordinates are written against these values.
// At runtime we compute scale = containerWidth / BASE_W and multiply
// everything by it, so the game fills any screen width perfectly.
const BASE_W = 760
const BASE_H = 360
const PACKET_LANES    = 4
const PACKET_PLAYER_X = 120

const GLOBAL_BEST_KEY  = 'vc_global_game_best'
const NETWORK_BEST_KEY = 'vc_network_best'
const PACKET_BEST_KEY  = 'vc_packet_best'

function getInitialScores() {
  if (typeof window === 'undefined') return { networkBest: 0, packetBest: 0, packetGames: 0, globalBest: 0 }
  return {
    networkBest: Number(window.localStorage.getItem(NETWORK_BEST_KEY) ?? '0'),
    packetBest:  Number(window.localStorage.getItem(PACKET_BEST_KEY)  ?? '0'),
    packetGames: 0,
    globalBest:  Number(window.localStorage.getItem(GLOBAL_BEST_KEY)  ?? '0'),
  }
}

/** Resize canvas pixel buffer to match its CSS width, keeping BASE aspect ratio. Returns scale factor. */
function fitCanvas(canvas: HTMLCanvasElement): number {
  const w = canvas.clientWidth || BASE_W
  const h = Math.round(w * (BASE_H / BASE_W))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width  = w
    canvas.height = h
  }
  return w / BASE_W
}

// ─── Static preview renderers ─────────────────────────────────────────────────

function drawNetworkPreview(canvas: HTMLCanvasElement, nodes: NodeItem[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const s = fitCanvas(canvas)
  const W = canvas.width, H = canvas.height

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#09090b'
  ctx.fillRect(0, 0, W, H)

  // connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      if (Math.hypot(a.x - b.x, a.y - b.y) < 190) {
        ctx.strokeStyle = 'rgba(161,161,170,0.18)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(a.x * s, a.y * s)
        ctx.lineTo(b.x * s, b.y * s)
        ctx.stroke()
      }
    }
  }

  // nodes
  const brokenIdxs = [1, 4, 7, 11, 15]
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i], broken = brokenIdxs.includes(i)
    ctx.fillStyle   = broken ? '#ef4444' : '#22c55e'
    ctx.strokeStyle = broken ? '#fecaca' : '#dcfce7'
    ctx.lineWidth   = 2.2 * s
    ctx.shadowColor = broken ? 'rgba(239,68,68,0.8)' : 'rgba(34,197,94,0.7)'
    ctx.shadowBlur  = (broken ? 22 : 18) * s
    ctx.beginPath(); ctx.arc(node.x * s, node.y * s, 11.5 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
    ctx.shadowBlur = 0
    ctx.fillStyle = broken ? '#7f1d1d' : '#14532d'
    ctx.beginPath(); ctx.arc(node.x * s, node.y * s, 3.6 * s, 0, Math.PI * 2); ctx.fill()
  }

  // overlay
  ctx.fillStyle = 'rgba(9,9,11,0.55)'; ctx.fillRect(0, 0, W, H)

  // pill badge
  const bw = 220 * s, bh = 36 * s
  ctx.fillStyle = 'rgba(249,115,22,0.15)'; ctx.strokeStyle = 'rgba(249,115,22,0.5)'; ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, H / 2 - 64 * s, bw, bh, 18 * s); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#f97316'; ctx.font = `bold ${13 * s}px Arial`; ctx.textAlign = 'center'
  ctx.fillText('NETWORK REPAIR', W / 2, H / 2 - 41 * s)
  ctx.fillStyle = 'rgba(245,245,245,0.95)'; ctx.font = `bold ${26 * s}px Arial`
  ctx.fillText('Tap Start to Play', W / 2, H / 2 + 8 * s)
  ctx.fillStyle = 'rgba(161,161,170,0.85)'; ctx.font = `${14 * s}px Arial`
  ctx.fillText('Touch red nodes to repair them!', W / 2, H / 2 + 36 * s)
  ctx.textAlign = 'left'
}

function drawPacketPreview(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const s = fitCanvas(canvas)
  const W = canvas.width, H = canvas.height
  const lh = (BASE_H / PACKET_LANES) * s
  const lc = (l: number) => l * lh + lh / 2

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, W, H)

  // lane lines
  for (let i = 0; i <= PACKET_LANES; i++) {
    ctx.strokeStyle = 'rgba(249,115,22,0.12)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, i * lh); ctx.lineTo(W, i * lh); ctx.stroke()
  }
  const gs = 34 * s
  for (let x = 0; x < W; x += gs) {
    ctx.strokeStyle = 'rgba(249,115,22,0.06)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  ctx.fillStyle = 'rgba(245,245,245,0.72)'; ctx.font = `bold ${11 * s}px Arial`; ctx.textAlign = 'left'
  for (let l = 0; l < PACKET_LANES; l++) ctx.fillText(`Lane ${l + 1}`, 16 * s, lc(l) - 12 * s)

  // obstacles
  for (const o of [{ x: 280, ol: 2 }, { x: 460, ol: 0 }, { x: 620, ol: 3 }]) {
    for (let l = 0; l < PACKET_LANES; l++) {
      if (l === o.ol) { ctx.fillStyle = 'rgba(34,197,94,0.22)'; ctx.fillRect(o.x * s, l * lh + 6 * s, 70 * s, lh - 12 * s) }
      else            { ctx.fillStyle = '#b91c1c';               ctx.fillRect(o.x * s, l * lh, 70 * s, lh) }
    }
    ctx.fillStyle = 'rgba(248,113,113,0.5)'
    ctx.fillRect(o.x * s - 2, 0, 2, H); ctx.fillRect((o.x + 70) * s, 0, 2, H)
  }

  // player
  const px = PACKET_PLAYER_X * s, py = lc(1)
  ctx.fillStyle = '#f97316'; ctx.shadowColor = 'rgba(249,115,22,0.7)'; ctx.shadowBlur = 12 * s
  ctx.beginPath(); ctx.moveTo(px - 13 * s, py - 9 * s); ctx.lineTo(px + 11 * s, py); ctx.lineTo(px - 13 * s, py + 9 * s); ctx.closePath(); ctx.fill()
  ctx.shadowBlur = 0

  // overlay + badge
  ctx.fillStyle = 'rgba(9,9,11,0.55)'; ctx.fillRect(0, 0, W, H)
  const bw = 180 * s, bh = 36 * s
  ctx.fillStyle = 'rgba(249,115,22,0.15)'; ctx.strokeStyle = 'rgba(249,115,22,0.5)'; ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, H / 2 - 64 * s, bw, bh, 18 * s); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#f97316'; ctx.font = `bold ${13 * s}px Arial`; ctx.textAlign = 'center'
  ctx.fillText('PACKET RUSH', W / 2, H / 2 - 41 * s)
  ctx.fillStyle = 'rgba(245,245,245,0.95)'; ctx.font = `bold ${26 * s}px Arial`
  ctx.fillText('Tap Start to Play', W / 2, H / 2 + 8 * s)
  ctx.fillStyle = 'rgba(161,161,170,0.85)'; ctx.font = `${14 * s}px Arial`
  ctx.fillText('Dodge red walls — go through the green gap!', W / 2, H / 2 + 36 * s)
  ctx.textAlign = 'left'
}

// ─── Component ────────────────────────────────────────────────────────────────
const EasterEggGames = () => {
  const [activeGame, setActiveGame] = useState<GameMode>('network')
  const [touchDevice] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false)
  const [shouldRenderGames, setShouldRenderGames] = useState<boolean | null>(null)
  const [isClient, setIsClient] = useState(false)

  const networkCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const packetCanvasRef  = useRef<HTMLCanvasElement | null>(null)

  const initialScores = getInitialScores()

  const [networkRunning, setNetworkRunning] = useState(false)
  const [networkScore,   setNetworkScore]   = useState(0)
  const [networkBest,    setNetworkBest]    = useState(initialScores.networkBest)
  const [networkTime,    setNetworkTime]    = useState(30)

  const [packetRunning, setPacketRunning] = useState(false)
  const [packetScore,   setPacketScore]   = useState(0)
  const [packetBest,    setPacketBest]    = useState(initialScores.packetBest)
  const [packetGames,   setPacketGames]   = useState(initialScores.packetGames)
  const [globalBest,    setGlobalBest]    = useState(initialScores.globalBest)
  const [beatPrompt, setBeatPrompt] = useState<{ open: boolean; score: number; game: string }>({
    open: false, score: 0, game: '',
  })

  const packetScoreRef  = useRef(0)
  const packetGamesRef  = useRef(initialScores.packetGames)
  const packetBestRef   = useRef(initialScores.packetBest)
  const networkScoreRef = useRef(0)

  const networkNodes      = useRef<NodeItem[]>([])
  const networkMouse      = useRef({ x: -999, y: -999 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const networkBreakTimer = useRef<any>(null)
  const networkFrame      = useRef<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const networkCountdown  = useRef<any>(null)

  const packetFrame      = useRef<number | null>(null)
  const packetTargetLane = useRef(1)
  const packetPlayerY    = useRef((BASE_H / PACKET_LANES) * 1.5)
  const packetPulse      = useRef(0)
  const packetObstacles  = useRef<Obstacle[]>([])
  const packetSpeed      = useRef(3.8)
  const packetTick       = useRef(0)

  const canShowNetwork = shouldRenderGames === true && activeGame === 'network'
  const canShowPacket  = shouldRenderGames === true && activeGame === 'packet'

  // ── hydration ──────────────────────────────────────────────────────────────
  useEffect(() => { setIsClient(true) }, [])

  useEffect(() => {
    if (!isClient) return
    const isHomepage = window.location.pathname === '/' || window.location.pathname === ''
    const roll = window.sessionStorage.getItem('vc_games_roll')
    let show: boolean
    if (roll === 'show' || roll === 'hide') {
      show = roll === 'show'
    } else {
      show = Math.random() < 0.5
      window.sessionStorage.setItem('vc_games_roll', show ? 'show' : 'hide')
    }
    setTimeout(() => setShouldRenderGames(show && isHomepage), 0)
  }, [isClient])

  // ── draw / redraw previews ─────────────────────────────────────────────────
  useEffect(() => {
    if (shouldRenderGames !== true) return
    const id = setTimeout(() => {
      if (networkCanvasRef.current && !networkRunning) {
        if (networkNodes.current.length === 0) seedNetworkNodes()
        drawNetworkPreview(networkCanvasRef.current, networkNodes.current)
      }
      if (packetCanvasRef.current && !packetRunning) {
        drawPacketPreview(packetCanvasRef.current)
      }
    }, 50)
    return () => clearTimeout(id)
  }, [shouldRenderGames, activeGame, networkRunning, packetRunning])

  // ── resize observer: redraws previews on container width change ───────────
  useEffect(() => {
    if (shouldRenderGames !== true) return
    const entries = [
      { ref: networkCanvasRef, running: () => networkRunning, redraw: () => { if (networkCanvasRef.current) drawNetworkPreview(networkCanvasRef.current, networkNodes.current) } },
      { ref: packetCanvasRef,  running: () => packetRunning,  redraw: () => { if (packetCanvasRef.current)  drawPacketPreview(packetCanvasRef.current) } },
    ]
    const observers: ResizeObserver[] = []
    for (const e of entries) {
      if (!e.ref.current) continue
      const ro = new ResizeObserver(() => { if (!e.running()) e.redraw() })
      ro.observe(e.ref.current)
      observers.push(ro)
    }
    return () => observers.forEach(o => o.disconnect())
  }, [shouldRenderGames, networkRunning, packetRunning])

  // ── seed nodes ─────────────────────────────────────────────────────────────
  const seedNetworkNodes = () => {
    networkNodes.current = Array.from({ length: 18 }).map((_, idx) => {
      const col = idx % 6, row = Math.floor(idx / 6)
      return { x: 80 + col * 120 + Math.random() * 10, y: 70 + row * 100 + Math.random() * 12, broken: false }
    })
  }

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

  // ── Network Repair – animation loop ───────────────────────────────────────
  useEffect(() => {
    const canvas = networkCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (networkNodes.current.length === 0) seedNetworkNodes()

    const draw = () => {
      const s = fitCanvas(canvas)
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, W, H)

      // connections
      for (let i = 0; i < networkNodes.current.length; i++) {
        for (let j = i + 1; j < networkNodes.current.length; j++) {
          const a = networkNodes.current[i], b = networkNodes.current[j]
          if (Math.hypot(a.x - b.x, a.y - b.y) < 190) {
            ctx.strokeStyle = 'rgba(161,161,170,0.18)'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(a.x * s, a.y * s); ctx.lineTo(b.x * s, b.y * s); ctx.stroke()
          }
        }
      }

      if (!networkRunning) return   // static preview handles idle state

      for (const node of networkNodes.current) {
        const hovering = Math.hypot(networkMouse.current.x - node.x, networkMouse.current.y - node.y) < 30
        const phase = Date.now() * 0.008 + node.x * 0.03 + node.y * 0.02
        const pulse = node.broken ? (Math.sin(phase) + 1) * 0.5 : 0

        if (node.broken && hovering) {
          node.broken = false
          setNetworkScore(sc => { const n = sc + 1; networkScoreRef.current = n; return n })
        }

        ctx.fillStyle   = node.broken ? '#ef4444' : '#22c55e'
        ctx.strokeStyle = node.broken ? '#fecaca' : '#dcfce7'
        ctx.lineWidth   = 2.2 * s
        ctx.shadowColor = node.broken ? 'rgba(239,68,68,0.98)' : 'rgba(34,197,94,0.9)'
        ctx.shadowBlur  = (node.broken ? 18 + pulse * 18 : 20) * s
        const r = (node.broken ? 10.5 + pulse * 3.2 : 11.5) * s
        ctx.beginPath(); ctx.arc(node.x * s, node.y * s, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.shadowBlur = 0
        ctx.fillStyle = node.broken ? '#7f1d1d' : '#14532d'
        ctx.beginPath(); ctx.arc(node.x * s, node.y * s, 3.6 * s, 0, Math.PI * 2); ctx.fill()
      }

      networkFrame.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { if (networkFrame.current) cancelAnimationFrame(networkFrame.current) }
  }, [networkRunning])

  // ── Network Repair – timers ────────────────────────────────────────────────
  useEffect(() => {
    if (!networkRunning) return
    networkBreakTimer.current = setInterval(() => {
      const idx = Math.floor(Math.random() * networkNodes.current.length)
      networkNodes.current[idx].broken = true
    }, 680)
    networkCountdown.current = setInterval(() => {
      setNetworkTime(t => {
        if (t <= 1) {
          registerGlobalScore(networkScoreRef.current, 'Network Repair')
          setNetworkBest(best => {
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
    return () => { clearInterval(networkBreakTimer.current); clearInterval(networkCountdown.current) }
  }, [networkRunning])

  // ── Packet Rush – animation loop ──────────────────────────────────────────
  useEffect(() => {
    const canvas = packetCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lh    = BASE_H / PACKET_LANES
    const lc    = (l: number) => l * lh + lh / 2
    const clamp = (l: number) => Math.max(0, Math.min(PACKET_LANES - 1, l))

    const reroute = (dir: -1 | 1) => {
      if (!packetRunning) return
      packetTargetLane.current = clamp(packetTargetLane.current + dir)
      packetPulse.current = 8
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (!packetRunning) return
      if (e.key === 'ArrowUp'   || e.key === 'w' || e.key === 'W') { e.preventDefault(); reroute(-1) }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); reroute(1)  }
    }
    window.addEventListener('keydown', onKeyDown)

    const draw = () => {
      const s = fitCanvas(canvas)
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, W, H)

      // lane lines
      for (let i = 0; i <= PACKET_LANES; i++) {
        ctx.strokeStyle = 'rgba(249,115,22,0.12)'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(0, i * lh * s); ctx.lineTo(W, i * lh * s); ctx.stroke()
      }
      const gs = 34 * s
      for (let x = 0; x < W; x += gs) {
        ctx.strokeStyle = 'rgba(249,115,22,0.06)'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      ctx.fillStyle = 'rgba(245,245,245,0.72)'; ctx.font = `bold ${11 * s}px Arial`; ctx.textAlign = 'left'
      for (let l = 0; l < PACKET_LANES; l++) ctx.fillText(`Lane ${l + 1}`, 16 * s, lc(l) * s - 12 * s)

      if (!packetRunning) {
        if (packetScoreRef.current > 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H)
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(239,68,68,0.9)'; ctx.font = `bold ${28 * s}px Arial`
          ctx.fillText('GAME OVER', W / 2, H / 2 - 50 * s)
          ctx.fillStyle = 'rgba(245,245,245,0.9)'; ctx.font = `bold ${20 * s}px Arial`
          ctx.fillText(`Final Score: ${packetScoreRef.current}`, W / 2, H / 2)
          ctx.fillStyle = 'rgba(249,115,22,0.8)'; ctx.font = `${16 * s}px Arial`
          ctx.fillText('Tap Start to play again', W / 2, H / 2 + 40 * s)
          ctx.textAlign = 'left'
        }
        return
      }

      // ── game logic ──
      packetTick.current += 1
      packetSpeed.current = Math.min(6.2, packetSpeed.current + 0.0009)
      if (packetTick.current % 60 === 0) {
        packetObstacles.current.push({ x: BASE_W + 8, w: 70, openLane: Math.floor(Math.random() * PACKET_LANES), passed: false })
      }

      const targetY = lc(packetTargetLane.current)
      packetPlayerY.current += (targetY - packetPlayerY.current) * 0.24
      if (Math.abs(packetPlayerY.current - targetY) < 0.5) packetPlayerY.current = targetY
      if (packetPulse.current > 0) packetPulse.current -= 0.35

      const playerX = PACKET_PLAYER_X, playerY = packetPlayerY.current
      const curLane = clamp(Math.floor(playerY / lh))
      let gameOver = false

      for (const obs of packetObstacles.current) {
        obs.x -= packetSpeed.current
        for (let l = 0; l < PACKET_LANES; l++) {
          if (l === obs.openLane) {
            ctx.fillStyle = 'rgba(34,197,94,0.22)'
            ctx.fillRect(obs.x * s, l * lh * s + 6 * s, obs.w * s, lh * s - 12 * s)
          } else {
            ctx.fillStyle = '#b91c1c'
            ctx.fillRect(obs.x * s, l * lh * s, obs.w * s, lh * s)
          }
        }
        ctx.fillStyle = 'rgba(248,113,113,0.5)'
        ctx.fillRect(obs.x * s - 2, 0, 2, H)
        ctx.fillRect((obs.x + obs.w) * s, 0, 2, H)

        const hitX = (playerX + 12) > obs.x && (playerX - 12) < (obs.x + obs.w)
        if (hitX) {
          if (curLane !== obs.openLane) {
            registerGlobalScore(packetScoreRef.current, 'Packet Rush')
            setPacketRunning(false); gameOver = true; break
          } else if (!obs.passed) {
            obs.passed = true; packetScoreRef.current += 1; setPacketScore(packetScoreRef.current)
          }
        }
      }
      if (gameOver) return

      packetObstacles.current = packetObstacles.current.filter(o => o.x + o.w > -20)

      const px = playerX * s, py = playerY * s
      ctx.fillStyle = '#f97316'; ctx.shadowColor = 'rgba(249,115,22,0.7)'; ctx.shadowBlur = 14 * s
      ctx.beginPath()
      ctx.moveTo(px - 13 * s, py - 9 * s); ctx.lineTo(px + 11 * s, py); ctx.lineTo(px - 13 * s, py + 9 * s)
      ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0

      if (packetPulse.current > 0) {
        ctx.strokeStyle = `rgba(249,115,22,${Math.min(0.75, packetPulse.current / 8)})`
        ctx.lineWidth = 2 * s
        ctx.beginPath(); ctx.arc(px - 18 * s, py, (11 + packetPulse.current * 1.2) * s, 0, Math.PI * 2); ctx.stroke()
      }

      ctx.fillStyle = '#f5f5f5'; ctx.font = `bold ${14 * s}px Arial`; ctx.textAlign = 'left'
      ctx.fillText(`Score: ${packetScoreRef.current}`, 20 * s, 28 * s)

      packetFrame.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(packetFrame.current!); window.removeEventListener('keydown', onKeyDown) }
  }, [packetRunning])

  // ── Packet Rush – end-of-game bookkeeping ─────────────────────────────────
  useEffect(() => {
    if (packetRunning) return
    if (packetScoreRef.current <= 0) return
    const nextGames = packetGamesRef.current + 1
    packetGamesRef.current = nextGames; setPacketGames(nextGames)
    const nextBest = Math.max(packetBestRef.current, packetScoreRef.current)
    packetBestRef.current = nextBest
    window.localStorage.setItem(PACKET_BEST_KEY, String(nextBest)); setPacketBest(nextBest)
  }, [packetRunning])

  // ── pointer (converts CSS px → logical coords) ────────────────────────────
  const setNetworkPointer = (clientX: number, clientY: number, target: HTMLCanvasElement) => {
    const rect = target.getBoundingClientRect()
    networkMouse.current.x = (clientX - rect.left) * (BASE_W / rect.width)
    networkMouse.current.y = (clientY - rect.top)  * (BASE_W / rect.width)
  }

  const routePacketUp   = () => { if (!packetRunning) return; packetTargetLane.current = Math.max(0, packetTargetLane.current - 1); packetPulse.current = 8 }
  const routePacketDown = () => { if (!packetRunning) return; packetTargetLane.current = Math.min(PACKET_LANES - 1, packetTargetLane.current + 1); packetPulse.current = 8 }

  // ── game starters ──────────────────────────────────────────────────────────
  const startNetworkGame = () => {
    networkNodes.current.forEach(n => { n.broken = false })
    networkScoreRef.current = 0; setNetworkScore(0); setNetworkTime(30)
    setBeatPrompt({ open: false, score: 0, game: '' })
    clearInterval(networkBreakTimer.current); clearInterval(networkCountdown.current)
    setNetworkRunning(true)
  }

  const startPacketGame = () => {
    packetScoreRef.current = 0; setPacketScore(0)
    packetTargetLane.current = 1
    packetPlayerY.current    = (BASE_H / PACKET_LANES) * 1.5
    packetPulse.current = 0; packetSpeed.current = 3.8; packetTick.current = 0
    packetObstacles.current = []
    setBeatPrompt({ open: false, score: 0, game: '' })
    setPacketRunning(true)
  }

  if (shouldRenderGames !== true) return null

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <section className="relative overflow-hidden border-y border-zinc-900 bg-[radial-gradient(circle_at_16%_15%,rgba(249,115,22,0.12),transparent_38%),radial-gradient(circle_at_82%_80%,rgba(249,115,22,0.09),transparent_36%),linear-gradient(to_bottom,#070708,#0a0a0c)] py-10 sm:py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Easter Eggs</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Play While You Wait</h2>
          <p className="mt-3 text-sm text-zinc-300 sm:text-base">Two mini games hidden in the site.</p>
          <p className="mt-3 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/90 px-4 py-1.5 text-sm font-bold text-zinc-200">
            Global Best: <span className="ml-2 text-[#f97316]">{globalBest}</span>
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mx-auto mt-6 flex max-w-xs rounded-xl border border-zinc-700 bg-zinc-900 p-1">
          <button type="button" onClick={() => setActiveGame('network')}
            className={`w-1/2 rounded-lg px-3 py-2 text-sm font-bold transition ${canShowNetwork ? 'bg-[#f97316] text-white' : 'text-zinc-300'}`}>
            Network Repair
          </button>
          <button type="button" onClick={() => setActiveGame('packet')}
            className={`w-1/2 rounded-lg px-3 py-2 text-sm font-bold transition ${canShowPacket ? 'bg-[#f97316] text-white' : 'text-zinc-300'}`}>
            Packet Rush
          </button>
        </div>

        {/* ── Network Repair ── */}
        {canShowNetwork ? (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-[linear-gradient(145deg,rgba(15,15,16,0.92),rgba(8,8,9,0.98))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.42)] sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 shrink-0 rounded-full ${networkRunning ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-zinc-300">
                  {networkRunning ? 'Fix the red nodes!' : touchDevice ? 'Touch red nodes to fix them' : 'Hover red nodes to fix them'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="rounded border border-zinc-700 bg-zinc-900/90 px-2 py-1">⏱ {networkTime}s</span>
                <span className="rounded border border-zinc-700 bg-zinc-900/90 px-2 py-1">{networkScore}</span>
                <span className="rounded border border-zinc-700 bg-zinc-900/90 px-2 py-1 text-zinc-400">Best {networkBest}</span>
                <button type="button" onClick={startNetworkGame}
                  className="rounded bg-[#f97316] px-3 py-1 font-bold text-white">
                  {networkRunning ? 'Restart' : 'Start'}
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <canvas
                ref={networkCanvasRef}
                className="block h-auto w-full touch-none"
                onMouseMove={e => setNetworkPointer(e.clientX, e.clientY, e.currentTarget)}
                onMouseLeave={() => { networkMouse.current = { x: -999, y: -999 } }}
                onTouchStart={e => { const t = e.touches[0]; if (t) setNetworkPointer(t.clientX, t.clientY, e.currentTarget) }}
                onTouchMove={e  => { const t = e.touches[0]; if (t) setNetworkPointer(t.clientX, t.clientY, e.currentTarget) }}
                onTouchEnd={() => { networkMouse.current = { x: -999, y: -999 } }}
              />
            </div>
          </div>
        ) : null}

        {/* ── Packet Rush ── */}
        {canShowPacket ? (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-[linear-gradient(145deg,rgba(15,15,16,0.92),rgba(8,8,9,0.98))] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.42)] sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 shrink-0 rounded-full ${packetRunning ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-zinc-300">
                  {packetRunning ? 'Dodge the walls!' : touchDevice ? 'Use buttons below' : 'Arrow Keys / W · S'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="rounded border border-zinc-700 bg-zinc-900/90 px-2 py-1">{packetScore}</span>
                <span className="rounded border border-zinc-700 bg-zinc-900/90 px-2 py-1 text-zinc-400">Best {packetBest}</span>
                <span className="rounded border border-zinc-700 bg-zinc-900/90 px-2 py-1 text-zinc-400">{packetGames}×</span>
                <button type="button" onClick={startPacketGame}
                  className="rounded bg-[#f97316] px-3 py-1 font-bold text-white">
                  {packetRunning ? 'Restart' : 'Start'}
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <canvas
                ref={packetCanvasRef}
                className="block h-auto w-full touch-none"
                onTouchStart={e => {
                  if (!packetRunning) return
                  e.preventDefault()
                  const t = e.touches[0]; if (!t) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  if ((t.clientY - rect.top) / rect.height < 0.5) routePacketUp(); else routePacketDown()
                }}
                onClick={e => {
                  if (!packetRunning) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  if ((e.clientY - rect.top) / rect.height < 0.5) routePacketUp(); else routePacketDown()
                }}
              />
            </div>
            {touchDevice ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button type="button" onTouchStart={routePacketUp} onMouseDown={routePacketUp}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/90 py-5 text-lg font-bold text-zinc-100 active:bg-zinc-800">
                  ▲ Up
                </button>
                <button type="button" onTouchStart={routePacketDown} onMouseDown={routePacketDown}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/90 py-5 text-lg font-bold text-zinc-100 active:bg-zinc-800">
                  ▼ Down
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Beat prompt */}
        {beatPrompt.open ? (
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
            <p className="text-sm font-bold text-emerald-300">
              🏆 New Global High Score! {beatPrompt.score} on {beatPrompt.game}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <button type="button"
                onClick={() => {
                  const msg = `Hi Valley Computers! I just beat the global high score with ${beatPrompt.score} points on ${beatPrompt.game}.`
                  window.open(`https://wa.me/27799381260?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
                }}
                className="rounded-lg bg-[#25D366] px-4 py-2 text-sm font-bold text-white">
                Send via WhatsApp
              </button>
              <button type="button"
                onClick={() => {
                  const sub  = encodeURIComponent('New high score submission')
                  const body = encodeURIComponent(`Hi Valley Computers,\n\nI just beat the global high score with ${beatPrompt.score} points on ${beatPrompt.game}.`)
                  window.location.href = `mailto:info@valleycomputers.co.za?subject=${sub}&body=${body}`
                }}
                className="rounded-lg border border-zinc-600 bg-zinc-900/80 px-4 py-2 text-sm font-bold text-zinc-100">
                Send Score via Email
              </button>
            </div>
          </div>
        ) : null}

      </div>
    </section>
  )
}

export default EasterEggGames
