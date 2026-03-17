export const runtime = 'nodejs'

export function GET() {
  return Response.json(
    { ok: true, now: Date.now() },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

