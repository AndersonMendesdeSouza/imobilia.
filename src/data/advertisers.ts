import type { ImgResponseDTO } from '../dtos/response/img-response.dto'
import type { UsuarioPublico } from '../dtos/response/user-response.dto'
import { demoAccounts } from './demo-accounts'

function getDemoImage(usuarioId: string): ImgResponseDTO | null {
  const foto = demoAccounts.find((account) => account.usuarioId === usuarioId)?.foto
  if (!foto) return null

  return {
    id: `${usuarioId}-perfil`,
    url: foto,
    publicUrlId: `demo/perfis/${usuarioId}`,
    isPrimary: true,
    usuarioId,
    imovelId: null,
  }
}

// Perfis ilustrativos para apresentar a navegação pública da plataforma.
export const imobiliaAdvertiser: UsuarioPublico = {
  id: 'equipe-imobilia',
  img: getDemoImage('equipe-imobilia'),
  nome: 'Equipe Imobilia',
  cidade: 'Curitiba',
  estado: 'PR',
  descricao: 'Casas, apartamentos e lotes selecionados para quem busca um novo endereço. Conheça os imóveis da nossa equipe e encontre um espaço que combine com a sua história.',
  telefone: null,
}

export const auroraAdvertiser: UsuarioPublico = {
  id: 'aurora-imoveis',
  img: getDemoImage('aurora-imoveis'),
  nome: 'Aurora Imóveis',
  cidade: 'Curitiba',
  estado: 'PR',
  descricao: 'Uma seleção de imóveis para comprar e alugar em Curitiba e região. Explore os anúncios e conheça os detalhes de cada oportunidade.',
  telefone: null,
}

export const marinaAdvertiser: UsuarioPublico = {
  id: 'marina-costa',
  img: getDemoImage('marina-costa'),
  nome: 'Marina Costa',
  cidade: 'São José dos Pinhais',
  estado: 'PR',
  descricao: 'Um atendimento próximo para ajudar você a encontrar seu próximo imóvel. Confira as casas e os terrenos da minha seleção em Curitiba e região.',
  telefone: null,
}

export const advertisers = [imobiliaAdvertiser, auroraAdvertiser, marinaAdvertiser]
