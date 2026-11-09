import { Link } from 'react-router'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import { Icon } from '../Icon/Icon'
import './FeaturedProducts.css'

export function FeaturedProducts({ products }: { products: ImovelResponseDTO[] }) {
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
        aria-label="Imóveis em destaque. Use as setas para navegar."
      >
        {products.map((product, index) => (
          <article
            className="featured-slide"
            key={product.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${products.length}: ${product.titulo}`}
          >
            <img
              className="featured-image"
              src={product.fotos[0].url}
              alt={product.fotos[0].textoAlternativo}
              width="1200"
              height="800"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <span className="featured-transaction">{product.finalidade === 'aluguel' ? 'Para alugar' : 'À venda'}</span>
            <div className="featured-content">
              <span className="featured-label">Vitrine de imóveis</span>
              <h2>{product.titulo}</h2>
              <p className="featured-location">
                <Icon name="pin" size={16} /> {product.bairro} · {product.cidade}, {product.estado}
              </p>
              <div className="featured-action">
                <p className="featured-price">
                  {product.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  {product.finalidade === 'aluguel' && <small>/mês</small>}
                </p>
                <Link className="button featured-link" to={`/imoveis/${product.id}`} tabIndex={index === activeIndex ? 0 : -1}>
                  Ver detalhes <Icon name="arrow" size={17} />
                </Link>
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
                aria-label={`Mostrar ${product.titulo}`}
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
            <button type="button" aria-label="Imóvel anterior" aria-controls="featured-track" onClick={() => goToSlide(activeIndex - 1)}>
              <Icon name="back" size={19} />
            </button>
            <button type="button" aria-label="Próximo imóvel" aria-controls="featured-track" onClick={() => goToSlide(activeIndex + 1)}>
              <Icon name="arrow" size={19} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
