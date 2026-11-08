import { Link } from 'react-router'
import type { ProductDTO } from '../../dtos/product.dto'
import { Icon } from '../Icon/Icon'

const propertyLabels = { house: 'Casa', apartment: 'Apartamento', land: 'Lote' }

export function ProductCard({ product }: { product: ProductDTO }) {
  const isLand = product.type === 'land'
  const price = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  return (
    <article className="product-card">
      <Link
        className="product-card-link"
        to={`/imoveis/${product.id}`}
        aria-label={`Ver ${product.title}, ${price}${product.transaction === 'rent' ? ' por mês' : ''}`}
      >
        <div className="product-image">
          <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy" width="640" height="440" />
          <span className="property-tag">{propertyLabels[product.type]}</span>
          <span className="price-tag">{price}{product.transaction === 'rent' && <small>/mês</small>}</span>
        </div>
        <div className="product-content">
          <h2>{product.title}</h2>
          <p className="product-neighborhood">{product.neighborhood}</p>
          <p className="product-location"><Icon name="pin" size={14} />{product.city}, {product.state}</p>
          <div className={`product-features${isLand ? ' land-features' : ''}`}>
            <span>
              <Icon name="area" size={17} /><strong>{product.area} m²</strong>
              <small>{isLand ? 'Área total' : 'Área útil'}</small>
            </span>
            {!isLand && (
              <>
                <span>
                  <Icon name="bed" size={18} /><strong>{product.bedrooms}</strong><small>Quartos</small>
                </span>
                <span>
                  <Icon name="bath" size={18} /><strong>{product.bathrooms}</strong><small>Banheiros</small>
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
