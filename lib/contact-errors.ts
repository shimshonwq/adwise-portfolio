/** Map internal delivery errors to visitor-safe messages. */
export function friendlyContactError(message: string): string {
  const m = String(message || '').trim()
  const lower = m.toLowerCase()

  if (lower.includes('bad credentials') || lower.includes('401')) {
    return 'We could not deliver your message right now. Please email us directly.'
  }
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Too many messages in a short time. Please wait a few minutes and try again.'
  }
  if (lower.includes('forbidden') || lower.includes('403')) {
    return 'Message delivery is temporarily unavailable. Please email us directly.'
  }
  if (lower.includes('network') || lower.includes('fetch failed')) {
    return 'Network error while sending. Check your connection and try again.'
  }

  return m || 'Could not send your message right now. Please try again or email us directly.'
}
