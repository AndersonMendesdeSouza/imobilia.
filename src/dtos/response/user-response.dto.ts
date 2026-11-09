import type { PerfilUsuario } from '../enums'

export interface UserResponseDTO {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  ativo: boolean
  foto: string | null
  telefone: string | null
  descricao: string | null
  cidade: string
  estado: string
  criadoEm: string
  atualizadoEm: string
}

export type UsuarioPublico = Pick<
  UserResponseDTO,
  'id' | 'nome' | 'foto' | 'telefone' | 'descricao' | 'cidade' | 'estado'
>
