import type { ImovelResponseDTO } from './imovel-response.dto'
import type { ImgResponseDTO } from './img-response.dto'
import type { PerfilUsuario } from '../enums'

export interface UserResponseDTO {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  ativo: boolean
  img: ImgResponseDTO | null
  imoveis: Omit<ImovelResponseDTO, 'usuario'>[]
  telefone: string | null
  descricao: string | null
  cidade: string
  estado: string
  criadoEm: string
  atualizadoEm: string
}

export type UsuarioPublico = Pick<
  UserResponseDTO,
  'id' | 'nome' | 'img' | 'telefone' | 'descricao' | 'cidade' | 'estado'
>
