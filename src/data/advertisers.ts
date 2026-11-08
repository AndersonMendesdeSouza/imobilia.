import type { AdvertiserDTO } from '../dtos/advertiser.dto'

// Perfis ilustrativos para apresentar a navegação pública da plataforma.
export const imobiliaAdvertiser: AdvertiserDTO = {
  id: 'equipe-imobilia',
  name: 'Equipe Imobilia',
  kind: 'agency',
  city: 'Curitiba',
  state: 'PR',
  description: 'Casas, apartamentos e lotes selecionados para quem busca um novo endereço. Conheça os imóveis da nossa equipe e encontre um espaço que combine com a sua história.',
  phone: null,
  email: null,
}

export const auroraAdvertiser: AdvertiserDTO = {
  id: 'aurora-imoveis',
  name: 'Aurora Imóveis',
  kind: 'agency',
  city: 'Curitiba',
  state: 'PR',
  description: 'Uma seleção de imóveis para comprar e alugar em Curitiba e região. Explore os anúncios e conheça os detalhes de cada oportunidade.',
  phone: null,
  email: null,
}

export const marinaAdvertiser: AdvertiserDTO = {
  id: 'marina-costa',
  name: 'Marina Costa',
  kind: 'broker',
  city: 'São José dos Pinhais',
  state: 'PR',
  description: 'Um atendimento próximo para ajudar você a encontrar seu próximo imóvel. Confira as casas e os terrenos da minha seleção em Curitiba e região.',
  phone: null,
  email: null,
}

export const advertisers = [imobiliaAdvertiser, auroraAdvertiser, marinaAdvertiser]
