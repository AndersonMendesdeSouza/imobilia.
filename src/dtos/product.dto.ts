import type { AdvertiserDTO } from './advertiser.dto'

export type TransactionType = 'rent' | 'sale'
export type PropertyType = 'house' | 'apartment' | 'land'

export interface ProductDTO {
  id: string
  title: string
  type: PropertyType
  transaction: TransactionType
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
  amenities: string[]
  images: { src: string; alt: string }[]
  advertiser: AdvertiserDTO
}

export interface ProductFiltersDTO {
  transaction: TransactionType
  location: string
  type: PropertyType | ''
  maxPrice: number | null
  bedrooms: number | null
}

export interface CreateProductDTO {
  title: string
  type: PropertyType
  transaction: TransactionType
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

