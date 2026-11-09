import type { UsuarioPublico } from '../dtos/response/user-response.dto'
import { demoAccounts } from './demo-accounts'

// Perfis ilustrativos para apresentar a navegação pública da plataforma.
export const imobiliaAdvertiser: UsuarioPublico = {
  id: 'equipe-imobilia',
  foto: demoAccounts.find((account) => account.usuarioId === 'equipe-imobilia')?.foto ?? null,
  nome: 'Equipe Imobilia',
  cidade: 'Curitiba',
  estado: 'PR',
  descricao: 'Casas, apartamentos e lotes selecionados para quem busca um novo endereço. Conheça os imóveis da nossa equipe e encontre um espaço que combine com a sua história.',
  telefone: null,
}

export const auroraAdvertiser: UsuarioPublico = {
  id: 'aurora-imoveis',
  foto: demoAccounts.find((account) => account.usuarioId === 'aurora-imoveis')?.foto ?? null,
  nome: 'Aurora Imóveis',
  cidade: 'Curitiba',
  estado: 'PR',
  descricao: 'Uma seleção de imóveis para comprar e alugar em Curitiba e região. Explore os anúncios e conheça os detalhes de cada oportunidade.',
  telefone: null,
}

export const marinaAdvertiser: UsuarioPublico = {
  id: 'marina-costa',
  foto: demoAccounts.find((account) => account.usuarioId === 'marina-costa')?.foto ?? null,
  nome: 'Marina Costa',
  cidade: 'São José dos Pinhais',
  estado: 'PR',
  descricao: 'Um atendimento próximo para ajudar você a encontrar seu próximo imóvel. Confira as casas e os terrenos da minha seleção em Curitiba e região.',
  telefone: null,
}

export const advertisers = [imobiliaAdvertiser, auroraAdvertiser, marinaAdvertiser]
