export function withSystemCursor<T>(fn: () => T): T {
  if (typeof document === 'undefined') return fn()

  const body = document.body
  const hadCustomCursor = body.classList.contains('custom-cursor-enabled')
  const hadNoCustomCursor = body.classList.contains('no-custom-cursor')

  if (hadCustomCursor) body.classList.remove('custom-cursor-enabled')
  body.classList.add('no-custom-cursor')

  try {
    return fn()
  } finally {
    if (!hadNoCustomCursor) body.classList.remove('no-custom-cursor')
    if (hadCustomCursor) body.classList.add('custom-cursor-enabled')
  }
}

export function safeAlert(message: string) {
  withSystemCursor(() => {
    window.alert(message)
  })
}

export function safeConfirm(message: string) {
  return withSystemCursor(() => window.confirm(message))
}

export function safePrompt(message: string, defaultValue?: string) {
  return withSystemCursor(() => window.prompt(message, defaultValue))
}

