import fs from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import ts from 'typescript'

const source = fs.readFileSync(new URL('../src/utils/decimal-input.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
})
const { formatCurrencyInput, formatAreaInput, parseDecimalInput } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)

test('preço é formatado em centavos a cada tecla e enviado como número', () => {
  let display = ''
  const expected = ['0,01', '0,10', '1,00', '10,00', '100,00', '1.000,00']
  for (const [index, digit] of [...'100000'].entries()) {
    display = formatCurrencyInput(display + digit)
    assert.equal(display, expected[index])
  }
  assert.equal(parseDecimalInput(display), 1000)
})

test('preço aceita colagem em reais, centavos e zero sem perder precisão', () => {
  assert.equal(formatCurrencyInput('R$ 1.234,56'), '1.234,56')
  assert.equal(formatCurrencyInput('30'), '0,30')
  assert.equal(formatCurrencyInput('000000'), '0,00')
  assert.equal(formatCurrencyInput('99999999999999'), '999.999.999.999,99')
  assert.equal(formatCurrencyInput(''), '')
  assert.equal(parseDecimalInput('1.234,56'), 1234.56)
})

test('metragem mantém os metros inteiros e usa a vírgula para os decimais', () => {
  let display = ''
  for (const digit of '1000,30') display = formatAreaInput(display + digit)
  assert.equal(display, '1.000,30')
  assert.equal(parseDecimalInput(display), 1000.3)
  assert.equal(formatAreaInput('1000'), '1.000')
  assert.equal(formatAreaInput('1000.30'), '1.000,30')
  assert.equal(formatAreaInput(',5'), '0,5')
})

test('apagar a metragem não interpreta o ponto de milhar como decimal', () => {
  let display = '1.000'
  for (const expected of ['100', '10', '1', '']) {
    display = formatAreaInput(display.slice(0, -1), false)
    assert.equal(display, expected)
  }
  assert.equal(formatAreaInput('1.000,3', false), '1.000,3')
  assert.equal(formatAreaInput('1.000,', false), '1.000,')
})

test('rejeita sinais, letras e excesso de casas decimais da área', () => {
  for (const value of ['-100', '1e3', 'abc', 'Infinity']) {
    assert.equal(formatCurrencyInput(value), null)
    assert.equal(formatAreaInput(value), null)
  }
  for (const value of ['1,234', '1,2,3', '1,2.3']) {
    assert.equal(formatAreaInput(value), null)
  }
})

test('conversão preserva os valores existentes ao abrir e salvar a edição', () => {
  for (const value of [0, 0.01, 0.3, 1000, 1000.3, 1234567.89, 999999999999.99]) {
    const display = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    assert.equal(parseDecimalInput(display), value)
    assert.equal(formatCurrencyInput(display), display)
  }
  assert.equal(parseDecimalInput('9.999.999.999,99'), 9999999999.99)
  assert.equal(parseDecimalInput('1.000,'), 1000)
  for (const value of ['', ' ', '-1,00', '1.2', '1,234', 'NaN']) {
    assert.ok(Number.isNaN(parseDecimalInput(value)))
  }
})
