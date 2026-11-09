import type { PerfilUsuario } from '../enums'
import type { ImgRequestDTO } from './img-request.dto'

export interface UserRequestDTO {
  nome: string
  email: string
  senha: string
  cidade: string
  estado: string
  imgs?: ImgRequestDTO[]
  telefone?: string | null
  descricao?: string | null
  perfil?: PerfilUsuario
  ativo?: boolean
}
