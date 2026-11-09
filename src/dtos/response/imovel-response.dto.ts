import type { ImovelRequestDTO } from '../request/imovel-request.dto'
import type { UsuarioPublico } from './user-response.dto'

export interface ImovelResponseDTO extends Omit<ImovelRequestDTO, 'imgs'> {
  id: string
  usuarioId: string
  usuario: UsuarioPublico
  destaque: boolean
  criadoEm: string
  atualizadoEm: string
  fotos: { url: string; textoAlternativo: string }[]
}
