import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import { Icon } from '../Icon/Icon'

export function ProductGallery({ product }: { product: ImovelResponseDTO }) {
  const [activeImage, setActiveImage] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)

  function openGallery(index: number) {
    setActiveImage(index)
    dialogRef.current?.showModal()
  }

  function changeImage(direction: number) {
    setActiveImage((current) => (current + direction + product.fotos.length) % product.fotos.length)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'ArrowRight') changeImage(1)
    if (event.key === 'ArrowLeft') changeImage(-1)
  }

  return (
    <>
      <section className={`property-gallery property-gallery-${product.fotos.length}`} aria-label="Fotos do imóvel">
        {product.fotos.slice(0, 3).map((foto, index) => (
          <button
            key={foto.url}
            type="button"
            className={`gallery-tile gallery-tile-${index}`}
            onClick={() => openGallery(index)}
            aria-label={`Ampliar foto: ${foto.textoAlternativo}`}
          >
            <img src={foto.url} alt={foto.textoAlternativo} width="1000" height="700" />
            <span className="gallery-expand"><Icon name="expand" size={20} /></span>
          </button>
        ))}
        <button className="gallery-all button" type="button" onClick={() => openGallery(0)}>
          <Icon name="images" size={17} /> Ver {product.fotos.length} {product.fotos.length === 1 ? 'foto' : 'fotos'}
        </button>
      </section>

      <dialog
        className="gallery-dialog"
        ref={dialogRef}
        aria-label={`Galeria de ${product.titulo}`}
        onKeyDown={handleKeyDown}
      >
        <div className="gallery-dialog-header">
          <span>{activeImage + 1} / {product.fotos.length}</span>
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
          {product.fotos.length > 1 && (
            <button className="icon-button gallery-previous" type="button" aria-label="Foto anterior" onClick={() => changeImage(-1)}>
              <Icon name="back" size={23} />
            </button>
          )}
          <img src={product.fotos[activeImage].url} alt={product.fotos[activeImage].textoAlternativo} />
          {product.fotos.length > 1 && (
            <button className="icon-button gallery-next" type="button" aria-label="Próxima foto" onClick={() => changeImage(1)}>
              <Icon name="arrow" size={23} />
            </button>
          )}
        </div>
        <p>{product.fotos[activeImage].textoAlternativo}</p>
        <div className="gallery-thumbnails">
          {product.fotos.map((foto, index) => (
            <button
              type="button"
              key={foto.url}
              className={index === activeImage ? 'selected' : ''}
              onClick={() => setActiveImage(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-pressed={index === activeImage}
            >
              <img src={foto.url} alt="" />
            </button>
          ))}
        </div>
      </dialog>
    </>
  )
}
