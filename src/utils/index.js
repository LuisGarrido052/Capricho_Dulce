export const PRICE_FORMATTER = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
})

export function formatCLP(value) {
  return PRICE_FORMATTER.format(Math.round(Number(value) || 0))
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.trim().length >= 8
}

export function isValidText(text, min = 3) {
  return typeof text === 'string' && text.trim().length >= min
}

export function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
