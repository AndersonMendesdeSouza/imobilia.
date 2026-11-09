import { createContext } from 'react'
import type { LoginRequestDTO } from '../dtos/request/login-request.dto'
import type { UserResponseDTO } from '../dtos/response/user-response.dto'

interface AuthContextValue {
  usuario: UserResponseDTO | null
  carregando: boolean
  erroSessao: string
  login: (dto: LoginRequestDTO) => Promise<void>
  logout: () => void
  recarregarSessao: () => void
  atualizarUsuario: () => Promise<void>
  atualizarFoto: (file: File) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
