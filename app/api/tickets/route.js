export const runtime = 'nodejs'

function getObservedIp(headers) {
  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp.trim()

  const xRealIp = headers.get('x-real-ip')
  if (xRealIp) return xRealIp.trim()

  const xForwardedFor = headers.get('x-forwarded-for')
  if (xForwardedFor) {
    const first = xForwardedFor.split(',')[0]?.trim()
    if (first) return first
  }

  return null
}

export async function POST(request) {
  const observedIp = getObservedIp(request.headers)

  // This endpoint currently does not persist tickets; it only returns what the server
  // observes so the frontend can include it in the support message.
  return Response.json(
    {
      success: true,
      observedIp,
      userAgent: request.headers.get('user-agent') || null,
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

