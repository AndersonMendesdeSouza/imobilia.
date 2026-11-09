import type { FinalidadeImovel, TipoImovel } from '../enums'

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
  comodidades: string[]
}
