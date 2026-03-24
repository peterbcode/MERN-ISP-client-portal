export function withSystemCursor<T>(fn: () => T): T {
  if (typeof document === 'undefined') return fn()

  const body = document.body
  const hadCustomCursor = body.classList.contains('custom-cursor-enabled')
  const hadInvertedCursor = body.classList.contains('inverted-cursor-enabled')
  const hadNoCustomCursor = body.classList.contains('no-custom-cursor')

  const previousBodyCursor = body.style.cursor
  const previousHtmlCursor = document.documentElement.style.cursor

  if (hadCustomCursor) body.classList.remove('custom-cursor-enabled')
  if (hadInvertedCursor) body.classList.remove('inverted-cursor-enabled')
  body.classList.add('no-custom-cursor')
  body.style.cursor = 'auto'
  document.documentElement.style.cursor = 'auto'

  try {
    return fn()
  } finally {
    if (!hadNoCustomCursor) body.classList.remove('no-custom-cursor')
    if (hadCustomCursor) body.classList.add('custom-cursor-enabled')
    if (hadInvertedCursor) body.classList.add('inverted-cursor-enabled')
    body.style.cursor = previousBodyCursor
    document.documentElement.style.cursor = previousHtmlCursor
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
