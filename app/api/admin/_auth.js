import jwt from 'jsonwebtoken'
import User from '@/models/User'

const parseAllowlist = (raw) =>
  String(raw || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean)

const getObservedIp = (headers) => {
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

export async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user || user.role !== 'admin') return null

    const isActive = user.isActive ?? user.stats?.isActive ?? true
    if (!isActive) return null

    const allowlist = parseAllowlist(process.env.ADMIN_IP_ALLOWLIST)
    if (allowlist.length) {
      const ip = getObservedIp(request.headers)
      if (!ip || !allowlist.includes(ip)) return null
    }

    return user
  } catch {
    return null
  }
}
