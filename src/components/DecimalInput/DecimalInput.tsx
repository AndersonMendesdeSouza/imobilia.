import { useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { formatAreaInput, formatCurrencyInput, parseDecimalInput } from '../../utils/decimal-input'

interface DecimalInputProps {
  name: string
  format?: 'currency' | 'area'
  defaultValue?: number
  min: number
  max: number
}

export function DecimalInput({ name, format = 'currency', defaultValue, min, max }: DecimalInputProps) {
  const [value, setValue] = useState(() => defaultValue?.toLocaleString('pt-BR', {
    minimumFractionDigits: format === 'currency' ? 2 : 0,
    maximumFractionDigits: 2,
  }) ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return

    const number = parseDecimalInput(value)
    let message = ''
    if (value && (!Number.isFinite(number) || number < min || number > max)) {
      message = `Informe um valor entre ${min.toLocaleString('pt-BR')} e ${max.toLocaleString('pt-BR')}.`
    }
    input.setCustomValidity(message)

    // Mantém o cursor na posição editada quando a máscara insere separadores.
    if (cursorRef.current !== null) {
      input.setSelectionRange(cursorRef.current, cursorRef.current)
      cursorRef.current = null
    }
  }, [value, min, max])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const isDeleting = event.nativeEvent instanceof InputEvent && event.nativeEvent.inputType.startsWith('delete')
    const formatted = format === 'currency' ? formatCurrencyInput(input.value) : formatAreaInput(input.value, !isDeleting)
    if (formatted === null) return

    const digitsAfterCursor = input.value.slice(input.selectionStart ?? input.value.length).replace(/\D/g, '').length
    let cursor = formatted.length
    let remainingDigits = digitsAfterCursor
    while (cursor > 0 && remainingDigits > 0) {
      cursor -= 1
      if (/\d/.test(formatted[cursor])) remainingDigits -= 1
    }

    if (formatted === value) {
      input.value = formatted
      input.setSelectionRange(cursor, cursor)
      return
    }

    cursorRef.current = cursor
    setValue(formatted)
  }

  return (
    <input
      ref={inputRef}
      name={name}
      type="text"
      inputMode={format === 'currency' ? 'numeric' : 'decimal'}
      required
      value={value}
      onChange={handleChange}
      onBlur={() => {
        if (value.endsWith(',')) setValue(value.slice(0, -1))
      }}
      placeholder={format === 'currency' ? '0,00' : '0'}
    />
  )
}
