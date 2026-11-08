import { Link } from 'react-router'
import { useState } from 'react'
import type { ProductDTO } from '../../dtos/product.dto'
import { Icon } from '../Icon/Icon'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export function ProductContact({ product }: { product: ProductDTO }) {
  const [showContact, setShowContact] = useState(false)
  const isRent = product.transaction === 'rent'
  const total = product.price + product.condominiumFee + product.propertyTax
  const { name, phone, email } = product.advertiser

  return (
    <aside className="contact-card" aria-label="Preço e contato do imóvel">
      <span className="contact-label">{isRent ? 'Aluguel mensal' : 'Valor de venda'}</span>
      <p className="detail-price">
        {currency.format(product.price)}{isRent && <small>/mês</small>}
      </p>
      <div className="price-breakdown">
        <p>
          <span>Condomínio</span>
          <strong>{product.condominiumFee ? `${currency.format(product.condominiumFee)}/mês` : 'Não se aplica'}</strong>
        </p>
        <p><span>IPTU mensal</span><strong>{currency.format(product.propertyTax)}</strong></p>
        {isRent && (
          <p className="total-price"><span>Total mensal</span><strong>{currency.format(total)}</strong></p>
        )}
      </div>
      <button
        className="button button-primary contact-button"
        type="button"
        onClick={() => setShowContact(!showContact)}
        aria-expanded={showContact}
        aria-controls="advertiser-contact"
      >
        <Icon name="phone" size={18} />
        {showContact ? 'Ocultar contato' : 'Falar com o anunciante'}
        <Icon name="arrow" size={18} />
      </button>
      <div className="advertiser-contact" id="advertiser-contact" hidden={!showContact}>
        {phone && <a href={`tel:${phone}`}><Icon name="phone" size={16} />{phone}</a>}
        {email && <a href={`mailto:${email}`}><Icon name="mail" size={16} />{email}</a>}
        {!phone && !email && <p>Este é um anúncio ilustrativo. O contato do anunciante ainda não foi informado.</p>}
      </div>
      <p className="contact-hint">Encontre os detalhes. Imagine as possibilidades.</p>
      <Link className="advertiser" to={`/anunciantes/${product.advertiser.id}`} aria-label={`Ver perfil de ${name}`}>
        <span className="advertiser-avatar"><Icon name="home" size={22} /></span>
        <div><strong>{name}</strong><span>Ver todos os anúncios</span></div>
        <Icon name="arrow" size={17} />
      </Link>
      <small className="demo-note">Anúncio de demonstração. Fotos e valores ilustrativos.</small>
    </aside>
  )
}
