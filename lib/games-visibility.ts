const VISITOR_ID_KEY = 'vc_visitor_id'
const GAMES_SHOW_THRESHOLD = 0.5

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''

  let id = window.localStorage.getItem(VISITOR_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    window.localStorage.setItem(VISITOR_ID_KEY, id)
  }

  return id
}

function getUserKeyFromToken(): string | null {
  if (typeof window === 'undefined') return null

  const token = window.localStorage.getItem('token')
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    ) as { id?: string }

    return decoded.id ? String(decoded.id) : null
  } catch {
    return null
  }
}

function hashStringToUnit(value: string): number {
  let hash = 2166136261

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0) / 4294967295
}

export function shouldShowEasterEggGames(): boolean {
  return true
}
