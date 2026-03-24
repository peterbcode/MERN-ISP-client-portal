export function withSystemCursor<T>(fn: () => T): T {
  if (typeof document === 'undefined') return fn()

  return fn()
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
