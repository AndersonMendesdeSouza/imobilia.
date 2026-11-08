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
  advertiser: { name: string; phone: string | null; email: string | null }
}

export interface ProductFiltersDTO {
  transaction: TransactionType
  location: string
  type: PropertyType | ''
  maxPrice: number | null
  bedrooms: number | null
}
