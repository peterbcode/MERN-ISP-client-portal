export function withSystemCursor<T>(fn: () => T): T {
  if (typeof document === 'undefined') return fn()

  const body = document.body
  const hadEnhancedCursor = body.classList.contains('cursor-enhanced')

  if (hadEnhancedCursor) {
    body.classList.remove('cursor-enhanced')
  }

  try {
    return fn()
  } finally {
    if (hadEnhancedCursor) {
      body.classList.add('cursor-enhanced')
    }
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
