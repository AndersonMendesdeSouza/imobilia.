import { demoAccounts } from '../data/demo-accounts'
import type { UserRequestDTO } from '../dtos/request/user-request.dto'
import type { UserResponseDTO } from '../dtos/response/user-response.dto'
import { advertiserService } from './advertiser.service'

const sessionKey = 'imobilia.demo-session'

function getDemoUser(usuarioId: string): UserResponseDTO | null {
  const account = demoAccounts.find((account) => account.usuarioId === usuarioId && account.ativo)
  const usuario = advertiserService.getById(usuarioId)
  if (!account || !usuario) return null

  return {
    ...usuario,
    email: account.email,
    perfil: account.perfil,
    ativo: account.ativo,
    criadoEm: '2026-11-08T00:00:00.000Z',
    atualizadoEm: '2026-11-08T00:00:00.000Z',
  }
}

// Esta sessão serve apenas para demonstrar as telas. Não substitui autenticação no servidor.
export const authService = {
  getCurrentUser(): UserResponseDTO | null {
    try {
      const usuarioId = sessionStorage.getItem(sessionKey)
      return usuarioId ? getDemoUser(usuarioId) : null
    } catch {
      return null
    }
  },

  login(input: Pick<UserRequestDTO, 'email' | 'senha'>): { usuario: UserResponseDTO } {
    const email = input.email.trim().toLowerCase()
    const account = demoAccounts.find((account) => account.email === email && account.senha === input.senha)
    const usuario = account ? getDemoUser(account.usuarioId) : null

    if (!usuario) throw new Error('Email ou senha de demonstração incorretos.')

    try {
      sessionStorage.setItem(sessionKey, usuario.id)
    } catch {
      throw new Error('Não foi possível salvar a sessão neste navegador. Verifique se o armazenamento está habilitado.')
    }

    return { usuario }
  },

  logout() {
    try {
      sessionStorage.removeItem(sessionKey)
    } catch {
      throw new Error('Não foi possível encerrar a sessão. Tente novamente.')
    }
  },
}
