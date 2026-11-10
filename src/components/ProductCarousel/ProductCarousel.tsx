import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import { Icon, type IconName } from '../Icon/Icon'
import { ProductCard } from '../ProductCard/ProductCard'
import './ProductCarousel.css'

interface ProductCarouselProps {
  title: string
  label: string
  icon: IconName
  products: ImovelResponseDTO[]
  onEdit?: (product: ImovelResponseDTO) => void
  onDelete?: (product: ImovelResponseDTO) => void
  disabled?: boolean
}

export function ProductCarousel({ title, label, icon, products, onEdit, onDelete, disabled }: ProductCarouselProps) {
  const id = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const [navigation, setNavigation] = useState({ previous: false, next: false })

  function updateNavigation() {
    const track = trackRef.current
    if (!track) return

    setNavigation({
      previous: track.scrollLeft > 1,
      next: track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const observer = new ResizeObserver(updateNavigation)
    observer.observe(track)
    return () => observer.disconnect()
  }, [products])

  function scrollTo(left: number) {
    const track = trackRef.current
    if (!track) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left, behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  function move(direction: number) {
    const track = trackRef.current
    if (track) scrollTo(track.scrollLeft + direction * track.clientWidth)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      scrollTo(event.key === 'Home' ? 0 : (trackRef.current?.scrollWidth ?? 0))
    }
  }

  return (
    <section className="product-carousel" aria-label={label} aria-roledescription="carrossel">
      <div className="product-carousel-header">
        <div className="product-carousel-summary">
          <span className="product-carousel-icon" aria-hidden="true"><Icon name={icon} size={21} /></span>
          <div>
            <h3>{title}</h3>
            <span>{products.length} {products.length === 1 ? 'imóvel' : 'imóveis'}</span>
          </div>
        </div>
        {(navigation.previous || navigation.next) && (
          <div className="product-carousel-controls">
            <button
              type="button"
              aria-label={`Anteriores: ${label}`}
              aria-controls={id}
              disabled={!navigation.previous}
              onClick={() => move(-1)}
            >
              <Icon name="back" size={18} />
            </button>
            <button
              type="button"
              aria-label={`Próximos: ${label}`}
              aria-controls={id}
              disabled={!navigation.next}
              onClick={() => move(1)}
            >
              <Icon name="arrow" size={18} />
            </button>
          </div>
        )}
      </div>
      <div
        className="product-carousel-track"
        id={id}
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label={`${label}. Use as setas para navegar.`}
        onScroll={updateNavigation}
        onKeyDown={handleKeyDown}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit ? () => onEdit(product) : undefined}
            onDelete={onDelete ? () => onDelete(product) : undefined}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  )
}
