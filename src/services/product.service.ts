import { products } from '../data/products'
import type { ImovelRequestDTO } from '../dtos/request/imovel-request.dto'
import type { ImovelResponseDTO } from '../dtos/response/imovel-response.dto'
import type { FinalidadeImovel, TipoImovel } from '../dtos/enums'
import { brazilianStates } from '../data/states'
import { advertiserService } from './advertiser.service'
import { ImoveisService } from './imoveis.service'

export interface FiltrosImoveis {
  finalidade?: FinalidadeImovel
  localizacao?: string
  tipo?: TipoImovel
  valorMaximo?: number
  quartos?: number
  usuarioId?: string
}

const storageKey = 'imobilia.demo-products'

// Apenas a demonstração guarda as imagens como data URLs no navegador.
interface StoredProductInput extends ImovelRequestDTO {
  imagens: { url: string }[]
}

interface StoredProduct {
  id: string
  usuarioId: string
  entrada: StoredProductInput
  criadoEm: string
  atualizadoEm: string
}

// Compatibilidade apenas com os anúncios que já estavam salvos neste navegador.
interface LegacyStoredProduct {
  id: string
  advertiserId: string
  input: {
    title: string
    type: 'house' | 'apartment' | 'land'
    transaction: 'rent' | 'sale'
    price: number
    condominiumFee: number
    propertyTax: number
    city: string
    state: string
    neighborhood: string
    area: number
    bedrooms: number
    bathrooms: number
    parkingSpaces: number
    description: string
    image: string
  }
}

function convertLegacyProduct(record: LegacyStoredProduct): StoredProduct {
  const input = record.input
  const tipos = { house: 'casa', apartment: 'apartamento', land: 'lote' } as const
  const finalidades = { rent: 'aluguel', sale: 'venda' } as const

  return {
    id: record.id,
    usuarioId: record.advertiserId,
    // Os registros antigos não possuíam datas; usa a referência dos mocks.
    criadoEm: '2026-11-08T00:00:00.000Z',
    atualizadoEm: '2026-11-08T00:00:00.000Z',
    entrada: {
      titulo: input.title,
      descricao: input.description,
      tipo: tipos[input.type],
      finalidade: finalidades[input.transaction],
      valor: input.price,
      condominioMensal: input.condominiumFee,
      iptuMensal: input.propertyTax,
      cidade: input.city,
      estado: input.state,
      bairro: input.neighborhood,
      area: input.area,
      quartos: input.bedrooms,
      banheiros: input.bathrooms,
      vagasGaragem: input.parkingSpaces,
      imagens: [{ url: input.image }],
      comodidades: [],
    },
  }
}

function validateProduct(input: StoredProductInput) {
  if (!input || typeof input !== 'object') throw new Error('Os dados do imóvel são inválidos.')

  const textFields = [input.titulo, input.descricao, input.cidade, input.estado, input.bairro]
  if (textFields.some((value) => typeof value !== 'string')) throw new Error('Preencha os dados do imóvel corretamente.')
  if (input.titulo.trim().length < 3 || input.titulo.trim().length > 150) throw new Error('O título deve ter entre 3 e 150 caracteres.')
  if (input.descricao.trim().length < 30 || input.descricao.trim().length > 2500) throw new Error('A descrição deve ter entre 30 e 2.500 caracteres.')
  if (input.cidade.trim().length < 2 || input.cidade.trim().length > 100) throw new Error('Informe uma cidade válida.')
  if (input.bairro.trim().length < 2 || input.bairro.trim().length > 100) throw new Error('Informe um bairro válido.')
  if (!brazilianStates.includes(input.estado)) throw new Error('Selecione um estado válido.')
  if (!['casa', 'apartamento', 'lote'].includes(input.tipo)) throw new Error('Selecione um tipo de imóvel válido.')
  if (!['aluguel', 'venda'].includes(input.finalidade)) throw new Error('Selecione venda ou aluguel.')

  const decimals = [input.valor, input.area, input.condominioMensal, input.iptuMensal]
  if (decimals.some((value) => typeof value !== 'number' || !Number.isFinite(value) || value < 0 || Number(value.toFixed(2)) !== value)) {
    throw new Error('Informe valores válidos, não negativos e com até duas casas decimais.')
  }
  if (input.valor < 0.01 || input.area < 0.01) throw new Error('O valor e a área devem ser maiores que zero.')
  if (input.area > 9999999999.99 || [input.valor, input.condominioMensal, input.iptuMensal].some((value) => value > 999999999999.99)) {
    throw new Error('O valor ou a área ultrapassa o limite permitido.')
  }
  if (![input.quartos, input.banheiros, input.vagasGaragem].every((value) => Number.isInteger(value) && value >= 0 && value <= 2147483647)) {
    throw new Error('As quantidades de quartos, banheiros e vagas devem ser inteiras e não negativas.')
  }
  if (input.tipo !== 'lote' && (input.quartos < 1 || input.banheiros < 1)) {
    throw new Error('Informe pelo menos um quarto e um banheiro.')
  }
  if (!Array.isArray(input.imagens) || input.imagens.length < 1 || input.imagens.length > 20) {
    throw new Error('Informe de 1 a 20 fotos do imóvel.')
  }
  for (const foto of input.imagens) {
    if (!foto || typeof foto.url !== 'string' || foto.url.length > 1450000 || !/^(https?:\/\/\S+|\/(?!\/)\S+|data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2})$/.test(foto.url)) {
      throw new Error('Informe uma foto JPG, PNG ou WebP, ou um endereço de imagem válido.')
    }
  }
  if (!Array.isArray(input.comodidades) || input.comodidades.length > 50 || input.comodidades.some((item) => typeof item !== 'string' || item.length > 100)) {
    throw new Error('Informe até 50 comodidades, com no máximo 100 caracteres cada.')
  }
}

function buildProduct(record: StoredProduct): ImovelResponseDTO {
  const usuario = advertiserService.getById(record.usuarioId)
  if (!usuario) throw new Error('O anunciante deste imóvel não foi encontrado.')

  const input = record.entrada
  const isLand = input.tipo === 'lote'

  return {
    ...input,
    imagens: input.imagens.map((imagem, index) => ({
      id: `${record.id}-imagem-${index + 1}`,
      url: imagem.url,
      publicUrlId: `demo/${record.id}/${index + 1}`,
      isPrimary: index === 0,
      imovelId: record.id,
      usuarioId: null,
    })),
    id: record.id,
    usuarioId: record.usuarioId,
    usuario,
    destaque: false,
    criadoEm: record.criadoEm,
    atualizadoEm: record.atualizadoEm,
    titulo: input.titulo.trim(),
    descricao: input.descricao.trim(),
    cidade: input.cidade.trim(),
    bairro: input.bairro.trim(),
    quartos: isLand ? 0 : input.quartos,
    banheiros: isLand ? 0 : input.banheiros,
    vagasGaragem: isLand ? 0 : input.vagasGaragem,
  }
}

function readPublishedProducts(): StoredProduct[] {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return []

  try {
    const records: unknown = JSON.parse(raw)
    if (!Array.isArray(records)) throw new Error('Formato inválido.')

    return records.map((saved: unknown) => {
      if (!saved || typeof saved !== 'object') throw new Error('Registro inválido.')
      let record = 'input' in saved
        ? convertLegacyProduct(saved as LegacyStoredProduct)
        : saved as StoredProduct

      // Compatibilidade com anúncios salvos antes da troca de fotos por imagens.
      if (record.entrada && 'fotos' in record.entrada) {
        const { fotos, ...entrada } = record.entrada as StoredProductInput & { fotos: { url: string }[] }
        record = { ...record, entrada: { ...entrada, imagens: fotos.map((foto) => ({ url: foto.url })) } }
      }

      if (typeof record.id !== 'string' || !/^[a-f0-9-]{36}$/.test(record.id)) throw new Error('Identificador inválido.')
      if (typeof record.usuarioId !== 'string' || !advertiserService.getById(record.usuarioId)) throw new Error('Anunciante inválido.')
      if ([record.criadoEm, record.atualizadoEm].some((date) => typeof date !== 'string' || !Number.isFinite(Date.parse(date)))) throw new Error('Data inválida.')
      validateProduct(record.entrada)
      return record
    })
  } catch {
    throw new Error('Não foi possível ler os anúncios salvos neste navegador. Os dados existentes foram preservados.')
  }
}

function getAllProducts(): ImovelResponseDTO[] {
  try {
    return [...readPublishedProducts().map(buildProduct), ...products]
  } catch (error) {
    console.error('Falha ao carregar os anúncios de demonstração:', error)
    return products
  }
}

function normalizeLocation(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export const productService = {
  list(filters: FiltrosImoveis = {}): ImovelResponseDTO[] {
    const localizacao = normalizeLocation(filters.localizacao ?? '')

    return getAllProducts().filter((product) => {
      const address = normalizeLocation(`${product.bairro} ${product.cidade} ${product.estado}`)
      if (filters.finalidade && product.finalidade !== filters.finalidade) return false
      if (localizacao && !address.includes(localizacao)) return false
      if (filters.tipo && product.tipo !== filters.tipo) return false
      if (filters.valorMaximo !== undefined && product.valor > filters.valorMaximo) return false
      if (filters.quartos !== undefined && product.quartos < filters.quartos) return false
      if (filters.usuarioId && product.usuarioId !== filters.usuarioId) return false
      return true
    })
  },

  getById(id: string): ImovelResponseDTO | undefined {
    return getAllProducts().find((product) => product.id === id)
  },

  listByAdvertiser(usuarioId: string): ImovelResponseDTO[] {
    return this.list({ usuarioId })
  },

  async create(input: ImovelRequestDTO, files: File[] = []): Promise<ImovelResponseDTO> {
    return ImoveisService.create(input, files)
  },
}
