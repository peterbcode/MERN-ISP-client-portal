export const runtime = 'nodejs'

export async function POST(request) {
  const body = await request.arrayBuffer()
  return Response.json(
    { ok: true, bytes: body.byteLength },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

