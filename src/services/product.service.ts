import { products } from '../data/products'
import type { ProductFiltersDTO } from '../dtos/product.dto'

function normalizeLocation(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export const productService = {
  list(filters: ProductFiltersDTO) {
    const location = normalizeLocation(filters.location)

    return products.filter((product) => {
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
    return products.find((product) => product.id === id)
  },
}
