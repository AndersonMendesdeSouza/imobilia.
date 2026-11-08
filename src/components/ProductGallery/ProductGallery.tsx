import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { ProductDTO } from '../../dtos/product.dto'
import { Icon } from '../Icon/Icon'

export function ProductGallery({ product }: { product: ProductDTO }) {
  const [activeImage, setActiveImage] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)

  function openGallery(index: number) {
    setActiveImage(index)
    dialogRef.current?.showModal()
  }

  function changeImage(direction: number) {
    setActiveImage((current) => (current + direction + product.images.length) % product.images.length)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'ArrowRight') changeImage(1)
    if (event.key === 'ArrowLeft') changeImage(-1)
  }

  return (
    <>
      <section className={`property-gallery property-gallery-${product.images.length}`} aria-label="Fotos do imóvel">
        {product.images.slice(0, 3).map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className={`gallery-tile gallery-tile-${index}`}
            onClick={() => openGallery(index)}
            aria-label={`Ampliar foto: ${photo.alt}`}
          >
            <img src={photo.src} alt={photo.alt} width="1000" height="700" />
            <span className="gallery-expand"><Icon name="expand" size={20} /></span>
          </button>
        ))}
        <button className="gallery-all button" type="button" onClick={() => openGallery(0)}>
          <Icon name="images" size={17} /> Ver {product.images.length} {product.images.length === 1 ? 'foto' : 'fotos'}
        </button>
      </section>

      <dialog
        className="gallery-dialog"
        ref={dialogRef}
        aria-label={`Galeria de ${product.title}`}
        onKeyDown={handleKeyDown}
      >
        <div className="gallery-dialog-header">
          <span>{activeImage + 1} / {product.images.length}</span>
          <button
            className="icon-button"
            type="button"
            autoFocus
            aria-label="Fechar galeria"
            onClick={() => dialogRef.current?.close()}
          >
            <Icon name="close" size={23} />
          </button>
        </div>
        <div className="gallery-stage">
          {product.images.length > 1 && (
            <button className="icon-button gallery-previous" type="button" aria-label="Foto anterior" onClick={() => changeImage(-1)}>
              <Icon name="back" size={23} />
            </button>
          )}
          <img src={product.images[activeImage].src} alt={product.images[activeImage].alt} />
          {product.images.length > 1 && (
            <button className="icon-button gallery-next" type="button" aria-label="Próxima foto" onClick={() => changeImage(1)}>
              <Icon name="arrow" size={23} />
            </button>
          )}
        </div>
        <p>{product.images[activeImage].alt}</p>
        <div className="gallery-thumbnails">
          {product.images.map((photo, index) => (
            <button
              type="button"
              key={photo.src}
              className={index === activeImage ? 'selected' : ''}
              onClick={() => setActiveImage(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-pressed={index === activeImage}
            >
              <img src={photo.src} alt="" />
            </button>
          ))}
        </div>
      </dialog>
    </>
  )
}
