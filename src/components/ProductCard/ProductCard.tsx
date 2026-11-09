import { Link } from 'react-router'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import { Icon } from '../Icon/Icon'

const propertyLabels = { casa: 'Casa', apartamento: 'Apartamento', lote: 'Lote' }

export function ProductCard({ product }: { product: ImovelResponseDTO }) {
  const isLand = product.tipo === 'lote'
  const valor = product.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  return (
    <article className="product-card">
      <Link
        className="product-card-link"
        to={`/imoveis/${product.id}`}
        aria-label={`Ver ${product.titulo}, ${valor}${product.finalidade === 'aluguel' ? ' por mês' : ''}`}
      >
        <div className="product-image">
          <img src={(product.imagens.find((imagem) => imagem.isPrimary) ?? product.imagens[0])?.url} alt={product.titulo} loading="lazy" width="640" height="440" />
          <span className="property-tag">{propertyLabels[product.tipo]}</span>
          <span className="price-tag">{valor}{product.finalidade === 'aluguel' && <small>/mês</small>}</span>
        </div>
        <div className="product-content">
          <h2>{product.titulo}</h2>
          <p className="product-neighborhood">{product.bairro}</p>
          <p className="product-location"><Icon name="pin" size={14} />{product.cidade}, {product.estado}</p>
          <div className={`product-features${isLand ? ' land-features' : ''}`}>
            <span>
              <Icon name="area" size={17} /><strong>{product.area} m²</strong>
              <small>{isLand ? 'Área total' : 'Área útil'}</small>
            </span>
            {!isLand && (
              <>
                <span>
                  <Icon name="bed" size={18} /><strong>{product.quartos}</strong><small>Quartos</small>
                </span>
                <span>
                  <Icon name="bath" size={18} /><strong>{product.banheiros}</strong><small>Banheiros</small>
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
