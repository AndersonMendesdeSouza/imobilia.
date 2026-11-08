import { demoAccounts } from '../data/demo-accounts'
import type { LoginDTO } from '../dtos/login.dto'
import { advertiserService } from './advertiser.service'

const sessionKey = 'imobilia.demo-session'

// Esta sessão serve apenas para demonstrar as telas. Não substitui autenticação no servidor.
export const authService = {
  getCurrentUser() {
    try {
      const advertiserId = sessionStorage.getItem(sessionKey)
      return advertiserId ? advertiserService.getById(advertiserId) ?? null : null
    } catch {
      return null
    }
  },

  login(input: LoginDTO) {
    const email = input.email.trim().toLowerCase()
    const account = demoAccounts.find((account) => account.email === email && account.password === input.password)
    const advertiser = account ? advertiserService.getById(account.advertiserId) : null

    if (!advertiser) {
      throw new Error('Email ou senha de demonstração incorretos.')
    }

    try {
      sessionStorage.setItem(sessionKey, advertiser.id)
    } catch {
      throw new Error('Não foi possível salvar a sessão neste navegador. Verifique se o armazenamento está habilitado.')
    }

    return advertiser
  },

  logout() {
    try {
      sessionStorage.removeItem(sessionKey)
    } catch {
      throw new Error('Não foi possível encerrar a sessão. Tente novamente.')
    }
  },
}
