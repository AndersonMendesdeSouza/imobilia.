import type { FinalidadeImovel, TipoImovel } from '../enums'
import type { ImgRequestDTO } from './img-request.dto'

export interface ImovelRequestDTO {
  titulo: string
  descricao: string
  tipo: TipoImovel
  finalidade: FinalidadeImovel
  valor: number
  condominioMensal: number
  iptuMensal: number
  cidade: string
  estado: string
  bairro: string
  area: number
  quartos: number
  banheiros: number
  vagasGaragem: number
  imgs: ImgRequestDTO[]
  comodidades: string[]
}
