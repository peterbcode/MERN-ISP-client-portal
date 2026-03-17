export const runtime = 'nodejs'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export function GET(request) {
  const { searchParams } = new URL(request.url)
  const requested = Number.parseInt(searchParams.get('bytes') || '0', 10)
  const bytes = clamp(Number.isFinite(requested) ? requested : 0, 1024, 8 * 1024 * 1024)

  const buffer = new Uint8Array(bytes)
  // Non-zero pattern so intermediaries don't compress to nothing.
  for (let index = 0; index < buffer.length; index += 1024) buffer[index] = 1

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store',
    },
  })
}

