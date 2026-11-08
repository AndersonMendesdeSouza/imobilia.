import { products } from '../data/products'
import type { CreateProductDTO, ProductDTO, ProductFiltersDTO } from '../dtos/product.dto'
import { brazilianStates } from '../data/states'
import { advertiserService } from './advertiser.service'
import { authService } from './auth.service'

const storageKey = 'imobilia.demo-products'

interface StoredProduct {
  id: string
  advertiserId: string
  input: CreateProductDTO
}

function validateProduct(input: CreateProductDTO) {
  if (!input || typeof input !== 'object') throw new Error('Os dados do imóvel são inválidos.')

  const textFields = [input.title, input.description, input.city, input.state, input.neighborhood, input.image]
  if (textFields.some((value) => typeof value !== 'string')) throw new Error('Preencha os dados do imóvel corretamente.')
  if (input.title.trim().length < 3 || input.title.trim().length > 100) throw new Error('O título deve ter entre 3 e 100 caracteres.')
  if (input.description.trim().length < 30 || input.description.trim().length > 2500) throw new Error('A descrição deve ter entre 30 e 2.500 caracteres.')
  if (input.city.trim().length < 2 || input.city.trim().length > 80) throw new Error('Informe uma cidade válida.')
  if (input.neighborhood.trim().length < 2 || input.neighborhood.trim().length > 80) throw new Error('Informe um bairro válido.')
  if (!brazilianStates.includes(input.state)) throw new Error('Selecione um estado válido.')
  if (!['house', 'apartment', 'land'].includes(input.type)) throw new Error('Selecione um tipo de imóvel válido.')
  if (!['rent', 'sale'].includes(input.transaction)) throw new Error('Selecione venda ou aluguel.')

  const values = [input.price, input.area, input.condominiumFee, input.propertyTax, input.bedrooms, input.bathrooms, input.parkingSpaces]
  if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
    throw new Error('Os valores e as quantidades devem ser números válidos e não negativos.')
  }
  if (input.price <= 0 || input.area <= 0) throw new Error('O valor e a área devem ser maiores que zero.')
  if (![input.bedrooms, input.bathrooms, input.parkingSpaces].every(Number.isInteger)) {
    throw new Error('As quantidades de quartos, banheiros e vagas devem ser inteiras.')
  }
  if (input.type !== 'land' && (input.bedrooms < 1 || input.bathrooms < 1)) {
    throw new Error('Informe pelo menos um quarto e um banheiro.')
  }
  if (input.image.length > 1450000 || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(input.image)) {
    throw new Error('Selecione uma foto JPG, PNG ou WebP de até 1 MB.')
  }
}

function buildProduct(record: StoredProduct): ProductDTO {
  const advertiser = advertiserService.getById(record.advertiserId)
  if (!advertiser) throw new Error('O anunciante deste imóvel não foi encontrado.')

  const { image, ...input } = record.input
  const isLand = input.type === 'land'

  return {
    ...input,
    id: record.id,
    title: input.title.trim(),
    description: input.description.trim(),
    city: input.city.trim(),
    neighborhood: input.neighborhood.trim(),
    bedrooms: isLand ? 0 : input.bedrooms,
    bathrooms: isLand ? 0 : input.bathrooms,
    parkingSpaces: isLand ? 0 : input.parkingSpaces,
    amenities: [],
    images: [{ src: image, alt: input.title.trim() }],
    advertiser,
  }
}

function readPublishedProducts(): StoredProduct[] {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return []

  try {
    const records = JSON.parse(raw) as StoredProduct[]
    if (!Array.isArray(records)) throw new Error('Formato inválido.')

    for (const record of records) {
      if (!record || typeof record.id !== 'string' || !/^[a-f0-9-]{36}$/.test(record.id)) throw new Error('Identificador inválido.')
      if (typeof record.advertiserId !== 'string' || !advertiserService.getById(record.advertiserId)) throw new Error('Anunciante inválido.')
      validateProduct(record.input)
    }
    return records
  } catch {
    throw new Error('Não foi possível ler os anúncios salvos neste navegador. Os dados existentes foram preservados.')
  }
}

function getAllProducts() {
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
  list(filters: ProductFiltersDTO) {
    const location = normalizeLocation(filters.location)

    return getAllProducts().filter((product) => {
      const address = normalizeLocation(`${product.neighborhood} ${product.city} ${product.state}`)
      if (product.transaction !== filters.transaction) return false
      if (location && !address.includes(location)) return false
      if (filters.type && product.type !== filters.type) return false
      if (filters.maxPrice !== null && product.price > filters.maxPrice) return false
      if (filters.bedrooms !== null && product.bedrooms < filters.bedrooms) return false
      return true
    })
  },

  getById(id: string) {
    return getAllProducts().find((product) => product.id === id)
  },

  listByAdvertiser(advertiserId: string) {
    return getAllProducts().filter((product) => product.advertiser.id === advertiserId)
  },

  create(input: CreateProductDTO) {
    const advertiser = authService.getCurrentUser()
    if (!advertiser) throw new Error('Entre na sua conta para publicar um imóvel.')
    validateProduct(input)

    const records = readPublishedProducts()
    const record: StoredProduct = { id: crypto.randomUUID(), advertiserId: advertiser.id, input }
    const product = buildProduct(record)

    try {
      localStorage.setItem(storageKey, JSON.stringify([record, ...records]))
    } catch {
      throw new Error('Não foi possível salvar o anúncio. O armazenamento do navegador pode estar cheio ou indisponível.')
    }

    return product
  },
}
