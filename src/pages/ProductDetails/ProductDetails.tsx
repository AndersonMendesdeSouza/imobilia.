import { Link, useParams } from 'react-router'
import { useEffect } from 'react'
import { productService } from '../../services/product.service'
import { ProductGallery } from '../../components/ProductGallery/ProductGallery'
import { ProductContact } from '../../components/ProductContact/ProductContact'
import { Icon } from '../../components/Icon/Icon'

const propertyLabels = { casa: 'Casa', apartamento: 'Apartamento', lote: 'Lote' }

export function ProductDetails() {
  const { productId = '' } = useParams()
  const product = productService.getById(productId)

  useEffect(() => {
    document.title = product ? `${product.titulo} | Imobilia` : 'Imóvel não encontrado | Imobilia'
  }, [product])

  if (!product) {
    return (
      <main id="main-content" className="container not-found" tabIndex={-1}>
        <span className="empty-icon"><Icon name="home" size={30} /></span>
        <h1>Imóvel não encontrado</h1>
        <p>Este anúncio não está disponível. Conheça os outros imóveis da nossa seleção.</p>
        <Link className="button button-primary" to="/imoveis">
          <Icon name="back" size={18} /> Voltar aos imóveis
        </Link>
      </main>
    )
  }

  const backLink = product.finalidade === 'venda' ? '/imoveis?finalidade=venda' : '/imoveis'
  const isLand = product.tipo === 'lote'

  return (
    <main id="main-content" className="detail-page container" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Caminho da página">
        <Link to={backLink}><Icon name="back" size={16} /> Voltar aos imóveis</Link>
        <span>/</span><span>{product.titulo}</span>
      </nav>
      <div className="detail-heading">
        <div>
          <span className="eyebrow">
            {propertyLabels[product.tipo].toUpperCase()} PARA {product.finalidade === 'aluguel' ? 'ALUGAR' : 'COMPRAR'}
          </span>
          <h1>{product.titulo}</h1>
          <p><Icon name="pin" size={17} />{product.bairro}, {product.cidade} — {product.estado}</p>
        </div>
        <span className="detail-reference">Anúncio ilustrativo</span>
      </div>

      <ProductGallery product={product} />

      <div className="details-layout">
        <div className="property-information">
          <section className={`detail-features${isLand ? ' land-features' : ''}`} aria-label="Características do imóvel">
            <div>
              <Icon name="area" size={25} />
              <strong>{product.area} m²</strong><span>{isLand ? 'Área total' : 'Área útil'}</span>
            </div>
            {!isLand && (
              <>
                <div>
                  <Icon name="bed" size={26} />
                  <strong>{product.quartos} quartos</strong><span>Dormitórios</span>
                </div>
                <div>
                  <Icon name="bath" size={26} />
                  <strong>{product.banheiros} banheiros</strong><span>Banheiros</span>
                </div>
                <div>
                  <Icon name="car" size={26} />
                  <strong>{product.vagasGaragem} {product.vagasGaragem === 1 ? 'vaga' : 'vagas'}</strong>
                  <span>Garagem</span>
                </div>
              </>
            )}
          </section>
          <section className="information-section">
            <span className="eyebrow">CONHEÇA SEU PRÓXIMO LAR</span>
            <h2>Espaço para a sua nova história.</h2>
            <p>{product.descricao}</p>
          </section>
          {product.comodidades.length > 0 && (
            <section className="information-section">
              <h2>O que este imóvel oferece</h2>
              <ul className="amenities-list">
                {product.comodidades.map((amenity) => (
                  <li key={amenity}><span><Icon name="check" size={15} /></span>{amenity}</li>
                ))}
              </ul>
            </section>
          )}
          <section className="location-section">
            <div className="location-mark"><Icon name="pin" size={25} /></div>
            <div>
              <h2>Uma boa história começa pelo bairro.</h2>
              <p>{product.bairro} · {product.cidade}, {product.estado}</p>
              <small>Localização aproximada. Endereço completo sob consulta.</small>
            </div>
          </section>
        </div>
        <ProductContact product={product} />
      </div>
    </main>
  )
}
