import type { TipoImovel } from '../../dtos/enums'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import type { IconName } from '../Icon/Icon'
import { ProductCarousel } from './ProductCarousel'

const propertyTypes: { value: TipoImovel; label: string; icon: IconName }[] = [
  { value: 'casa', label: 'Casas', icon: 'home' },
  { value: 'apartamento', label: 'Apartamentos', icon: 'building' },
  { value: 'lote', label: 'Lotes', icon: 'area' },
]

interface ProductCarouselsProps {
  products: ImovelResponseDTO[]
  onEdit?: (product: ImovelResponseDTO) => void
  onDelete?: (product: ImovelResponseDTO) => void
  disabled?: boolean
}

export function ProductCarousels({ products, onEdit, onDelete, disabled }: ProductCarouselsProps) {
  return (
    <div className="property-categories">
      {propertyTypes.map((type) => {
        const categoryProducts = products.filter((product) => product.tipo === type.value)
        if (categoryProducts.length === 0) return null

        return (
          <ProductCarousel
            key={type.value}
            title={type.label}
            label={type.label}
            icon={type.icon}
            products={categoryProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            disabled={disabled}
          />
        )
      })}
    </div>
  )
}
