export const TOKEN_KEY = 'imobilia.token'

interface SessaoToken {
  usuarioId: string
  expiraEm: number
}

export const authService = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  saveToken(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      throw new Error('Não foi possível salvar a sessão neste navegador.')
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
  },

  // Esta leitura controla a interface; verificar a assinatura é responsabilidade da API.
  getSession(token: string | null): SessaoToken | null {
    if (!token) return null

    try {
      const partes = token.split('.')
      if (partes.length !== 3 || !partes[0] || !partes[2]) return null
      const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/')
      const bytes = Uint8Array.from(atob(base64), (caractere) => caractere.charCodeAt(0))
      const payload: unknown = JSON.parse(new TextDecoder().decode(bytes))
      if (!payload || typeof payload !== 'object') return null
      if (!('sub' in payload) || typeof payload.sub !== 'string') return null
      if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(payload.sub)) return null
      if (!('exp' in payload) || typeof payload.exp !== 'number' || !Number.isSafeInteger(payload.exp)) return null
      const expiraEm = payload.exp * 1000
      if (expiraEm <= Date.now()) return null
      return { usuarioId: payload.sub, expiraEm }
    } catch {
      return null
    }
  },
}
