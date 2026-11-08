import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { ProductDTO } from '../../dtos/product.dto'
import { Icon } from '../Icon/Icon'
import './FeaturedProducts.css'

export function FeaturedProducts({ products }: { products: ProductDTO[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  if (products.length === 0) return null

  function goToSlide(index: number) {
    const track = trackRef.current
    if (!track) return

    const nextIndex = (index + products.length) % products.length
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    track.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }

  function handleScroll() {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return

    const index = Math.round(track.scrollLeft / track.clientWidth)
    setActiveIndex(Math.max(0, Math.min(index, products.length - 1)))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToSlide(activeIndex - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToSlide(activeIndex + 1)
    }
  }

  return (
    <section className="featured-products" aria-label="Imóveis em destaque" aria-roledescription="carrossel">
      <div
        className="featured-track"
        id="featured-track"
        ref={trackRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Casas em destaque. Use as setas para navegar."
      >
        {products.map((product, index) => (
          <article
            className="featured-slide"
            key={product.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${products.length}: ${product.title}`}
          >
            <img
              className="featured-image"
              src={product.images[0].src}
              alt={product.images[0].alt}
              width="1200"
              height="800"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <span className="featured-transaction">{product.transaction === 'rent' ? 'Para alugar' : 'À venda'}</span>
            <div className="featured-content">
              <span className="featured-eyebrow"><span /> IMÓVEIS EM DESTAQUE</span>
              <h2>{product.title}</h2>
              <p className="featured-location">
                <Icon name="pin" size={16} /> {product.neighborhood} · {product.city}, {product.state}
              </p>
              <div className="featured-features">
                <span><Icon name="area" size={17} />{product.area} m²</span>
                <span><Icon name="bed" size={18} />{product.bedrooms} quartos</span>
                <span><Icon name="car" size={18} />{product.parkingSpaces} vagas</span>
              </div>
              <div className="featured-action">
                <p className="featured-price">
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  {product.transaction === 'rent' && <small>/mês</small>}
                </p>
                <a className="button featured-link" href={`#/imoveis/${product.id}`} tabIndex={index === activeIndex ? 0 : -1}>
                  Conhecer imóvel <Icon name="arrow" size={17} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      {products.length > 1 && (
        <div className="featured-controls">
          <div className="featured-pagination" aria-label="Selecionar destaque">
            {products.map((product, index) => (
              <button
                key={product.id}
                className={`featured-dot${index === activeIndex ? ' active' : ''}`}
                type="button"
                aria-label={`Mostrar ${product.title}`}
                aria-pressed={index === activeIndex}
                aria-controls="featured-track"
                onClick={() => goToSlide(index)}
              >
                <span />
              </button>
            ))}
            <span className="featured-counter" aria-live="polite" aria-atomic="true">{activeIndex + 1} de {products.length}</span>
          </div>
          <div className="featured-arrows">
            <button type="button" aria-label="Casa anterior" aria-controls="featured-track" onClick={() => goToSlide(activeIndex - 1)}>
              <Icon name="back" size={19} />
            </button>
            <button type="button" aria-label="Próxima casa" aria-controls="featured-track" onClick={() => goToSlide(activeIndex + 1)}>
              <Icon name="arrow" size={19} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
