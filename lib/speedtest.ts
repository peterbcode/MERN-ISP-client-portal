type SpeedTestResult = {
  downloadMbps: number
  uploadMbps: number
  latencyMs: number
}

type SpeedTestOptions = {
  onProgress?: (message: string) => void
}

const SPEEDTEST_BASE = '/api/speedtest'

const round3 = (value: number) => Math.round(value * 1000) / 1000

async function pingOnce() {
  const start = performance.now()
  await fetch(`${SPEEDTEST_BASE}/ping?ts=${Date.now()}`, { cache: 'no-store' })
  return performance.now() - start
}

async function downloadOnce(bytes: number) {
  const start = performance.now()
  const res = await fetch(`${SPEEDTEST_BASE}/download?bytes=${bytes}&ts=${Date.now()}`, {
    cache: 'no-store',
  })
  const buffer = await res.arrayBuffer()
  const durationS = (performance.now() - start) / 1000
  const sizeBytes = buffer.byteLength
  const mbps = (sizeBytes / durationS) * 8 / 1024 / 1024
  return { mbps, durationS, sizeBytes }
}

async function uploadOnce(bytes: number) {
  const payload = new Uint8Array(bytes)
  // Small non-zero pattern to avoid any accidental all-zero compression.
  for (let index = 0; index < payload.length; index += 1024) payload[index] = 1

  const start = performance.now()
  const res = await fetch(`${SPEEDTEST_BASE}/upload?ts=${Date.now()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: payload,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
  const durationS = (performance.now() - start) / 1000
  const mbps = (bytes / durationS) * 8 / 1024 / 1024
  return { mbps, durationS, sizeBytes: bytes }
}

export async function runSpeedTest(options: SpeedTestOptions = {}): Promise<SpeedTestResult> {
  options.onProgress?.('Testing latency...')
  // Latency (average of 5 pings)
  const pingSamples = await Promise.all(Array.from({ length: 5 }, () => pingOnce()))
  const latencyMs = pingSamples.reduce((sum, ms) => sum + ms, 0) / pingSamples.length

  options.onProgress?.('Testing download speed...')
  // Download (3 concurrent ~2MB downloads)
  const downloadBytes = 2 * 1024 * 1024
  const downloadResults = await Promise.all([
    downloadOnce(downloadBytes),
    downloadOnce(downloadBytes),
    downloadOnce(downloadBytes),
  ])
  const totalDownloadBytes = downloadResults.reduce((sum, r) => sum + r.sizeBytes, 0)
  const longestDownloadDurationS = Math.max(...downloadResults.map((r) => r.durationS))
  const downloadMbps = (totalDownloadBytes / longestDownloadDurationS) * 8 / 1024 / 1024

  options.onProgress?.('Testing upload speed...')
  // Upload (2 concurrent ~512KB uploads)
  const uploadBytes = 512 * 1024
  const uploadResults = await Promise.all([uploadOnce(uploadBytes), uploadOnce(uploadBytes)])
  const totalUploadBytes = uploadResults.reduce((sum, r) => sum + r.sizeBytes, 0)
  const longestUploadDurationS = Math.max(...uploadResults.map((r) => r.durationS))
  const uploadMbps = (totalUploadBytes / longestUploadDurationS) * 8 / 1024 / 1024

  options.onProgress?.('Finalizing results...')
  return {
    downloadMbps: round3(downloadMbps),
    uploadMbps: round3(uploadMbps),
    latencyMs: Math.round(latencyMs),
  }
}

export function speedRating(kind: 'download' | 'upload', mbps: number) {
  if (kind === 'download') {
    if (mbps >= 50) return 'Excellent'
    if (mbps >= 25) return 'Good'
    if (mbps >= 10) return 'Fair'
    return 'Poor'
  }

  if (mbps >= 20) return 'Excellent'
  if (mbps >= 10) return 'Good'
  if (mbps >= 5) return 'Fair'
  return 'Poor'
}

export function speedColor(kind: 'download' | 'upload', mbps: number) {
  const rating = speedRating(kind, mbps)
  if (rating === 'Excellent') return 'text-green-400'
  if (rating === 'Good') return 'text-yellow-400'
  if (rating === 'Fair') return 'text-orange-400'
  return 'text-red-400'
}
