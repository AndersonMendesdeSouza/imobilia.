function groupThousands(integer: string) {
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function formatCurrencyInput(value: string): string | null {
  const text = value.replace(/^\s*R\$\s*/, '').trim()
  if (!/^[\d.,\s]*$/.test(text)) return null

  const digits = text.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  if (!digits) return ''

  // Nos preços, os dois últimos dígitos representam os centavos.
  const padded = digits.padStart(3, '0')
  return `${groupThousands(padded.slice(0, -2))},${padded.slice(-2)}`
}

export function formatAreaInput(value: string, allowDecimalPoint = true): string | null {
  let text = value.replace(/\s/g, '')
  if (!/^[\d.,]*$/.test(text)) return null
  if (!text) return ''

  // Aceita também o ponto decimal de teclados que não oferecem vírgula.
  if (allowDecimalPoint && !text.includes(',') && /\.\d{0,2}$/.test(text)) {
    const decimalIndex = text.lastIndexOf('.')
    text = `${text.slice(0, decimalIndex)},${text.slice(decimalIndex + 1)}`
  }

  const parts = text.split(',')
  if (parts.length > 2 || (parts[1]?.length ?? 0) > 2) return null

  const integer = parts[0].replace(/\./g, '').replace(/^0+(?=\d)/, '') || '0'
  const fraction = parts.length === 2 ? `,${parts[1]}` : ''
  if (parts[1]?.includes('.')) return null

  return `${groupThousands(integer)}${fraction}`
}

export function parseDecimalInput(value: string): number {
  if (!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{0,2})?$/.test(value)) return NaN
  return Number(value.replace(/\./g, '').replace(',', '.'))
}
