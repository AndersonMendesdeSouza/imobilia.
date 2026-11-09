import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { after, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import ts from 'typescript'

// Executa os services TypeScript usando apenas dependências que o projeto já possui.
const root = path.resolve(import.meta.dirname, '..')
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'imobilia-auth-test-'))
const compiled = new Map()
function compile(file) {
  if (compiled.has(file)) return compiled.get(file)
  const destination = path.join(temp, path.relative(root, file).replace(/\.ts$/, '.mjs'))
  compiled.set(file, destination)
  let code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText.replace('import.meta.env.VITE_API_URL', 'undefined')
  code = code.replace(/(from\s*['"])([^'"]+)(['"])/g, (_match, prefix, name, suffix) => {
    const url = name.startsWith('.')
      ? pathToFileURL(compile(path.resolve(path.dirname(file), `${name}.ts`))).href
      : import.meta.resolve(name)
    return prefix + url + suffix
  })
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, code)
  return destination
}
const load = (file) => import(pathToFileURL(compile(path.join(root, file))))
const { authService, TOKEN_KEY } = await load('src/services/auth.service.ts')
const { UserService } = await load('src/services/user.service.ts')
const { default: api } = await load('src/services/axios.ts')
const storage = new Map()
let bloquearLeitura = false
let bloquearGravacao = false
let chamada
const usuarioId = '991c7dcb-499b-4071-9fe5-aa5792cb336a'
const usuario = { id: usuarioId, nome: 'Conta da API', ativo: true, imoveis: [], img: null }

function token(payload = { sub: usuarioId, exp: Math.floor(Date.now() / 1000) + 3600 }) {
  // Fixture somente para leitura de sub/exp, sem simular validação da assinatura.
  return `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.assinatura`
}

globalThis.localStorage = {
  getItem(key) { if (bloquearLeitura) throw new Error('Bloqueado'); return storage.get(key) ?? null },
  setItem(key, value) { if (bloquearGravacao) throw new Error('Bloqueado'); storage.set(key, value) },
  removeItem(key) { storage.delete(key) },
}

beforeEach(() => {
  storage.clear()
  bloquearLeitura = bloquearGravacao = false
  chamada = undefined
  api.defaults.env.FormData = globalThis.FormData
  api.defaults.adapter = async (config) => {
    chamada = config
    return { data: config.url === '/user/login' ? { token: token() } : usuario, status: 200, statusText: 'OK', headers: {}, config }
  }
})
after(() => fs.rmSync(temp, { recursive: true, force: true }))

test('guarda somente o token e lê sub/exp da sessão', () => {
  const jwt = token()
  authService.saveToken(jwt)
  assert.equal(authService.getToken(), jwt)
  assert.equal(storage.size, 1)
  assert.ok(storage.has(TOKEN_KEY))
  const sessao = authService.getSession(jwt)
  assert.equal(sessao.usuarioId, usuarioId)
  assert.ok(sessao.expiraEm > Date.now())
})

test('rejeita tokens expirados, incompletos ou com payload inválido', () => {
  const invalidos = [null, '', 'token-invalido', 'abc.def.ghi', token({ sub: usuarioId }), token({ sub: 'id-invalido', exp: 9999999999 }), token({ sub: usuarioId, exp: '9999999999' }), token({ sub: usuarioId, exp: Math.floor(Date.now() / 1000) - 1 })]
  for (const jwt of invalidos) assert.equal(authService.getSession(jwt), null)
})

test('logout remove o token e preserva outros dados do navegador', () => {
  storage.set('preferencias', 'tema-claro')
  authService.saveToken(token())
  authService.logout()
  assert.equal(authService.getToken(), null)
  assert.equal(storage.get('preferencias'), 'tema-claro')
})

test('trata armazenamento bloqueado sem expor credenciais', () => {
  bloquearLeitura = true
  assert.equal(authService.getToken(), null)
  bloquearGravacao = true
  assert.throws(() => authService.saveToken(token()), /salvar a sessão/)
})

test('login envia usuario e senha em JSON para /user/login', async () => {
  const dto = { usuario: 'conta@example.com', senha: 'SenhaTeste123!' }
  const response = await UserService.login(dto)
  assert.equal(chamada.url, '/user/login')
  assert.equal(chamada.method, 'post')
  assert.deepEqual(JSON.parse(chamada.data), dto)
  assert.equal(typeof response.token, 'string')
  assert.equal(storage.size, 0, 'O provider é responsável por persistir a sessão')
})

test('Axios envia o Bearer nos pedidos da API', async () => {
  const jwt = token()
  authService.saveToken(jwt)
  await UserService.findOne(usuarioId)
  assert.equal(chamada.url, `/user/${usuarioId}`)
  assert.equal(chamada.headers.get('Authorization'), `Bearer ${jwt}`)
})

test('Axios não envia token vencido', async () => {
  authService.saveToken(token({ sub: usuarioId, exp: 1 }))
  await UserService.findAll()
  assert.equal(chamada.headers.get('Authorization'), undefined)
})

test('o upload de foto continua usando somente o campo file', async () => {
  const file = new File(['foto'], 'perfil.png', { type: 'image/png' })
  await UserService.updateImg(usuarioId, file)
  assert.equal(chamada.url, `/user/${usuarioId}/img`)
  assert.equal(chamada.method, 'put')
  assert.ok(chamada.data instanceof FormData)
  assert.deepEqual([...chamada.data.keys()], ['file'])
  assert.equal(chamada.data.get('file').name, 'perfil.png')
})
