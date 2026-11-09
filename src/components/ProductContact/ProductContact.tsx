import { Link } from 'react-router'
import { useState } from 'react'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import { Icon } from '../Icon/Icon'
import { Avatar } from '../Avatar/Avatar'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export function ProductContact({ product }: { product: ImovelResponseDTO }) {
  const [showContact, setShowContact] = useState(false)
  const isRent = product.finalidade === 'aluguel'
  const total = product.valor + product.condominioMensal + product.iptuMensal
  const { nome, telefone } = product.usuario

  return (
    <aside className="contact-card" aria-label="Preço e contato do imóvel">
      <span className="contact-label">{isRent ? 'Aluguel mensal' : 'Valor de venda'}</span>
      <p className="detail-price">
        {currency.format(product.valor)}{isRent && <small>/mês</small>}
      </p>
      <div className="price-breakdown">
        <p>
          <span>Condomínio</span>
          <strong>{product.condominioMensal ? `${currency.format(product.condominioMensal)}/mês` : 'Não se aplica'}</strong>
        </p>
        <p><span>IPTU mensal</span><strong>{currency.format(product.iptuMensal)}</strong></p>
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
        {telefone && <a href={`tel:${telefone}`}><Icon name="phone" size={16} />{telefone}</a>}
        {!telefone && <p>O telefone do anunciante ainda não foi informado.</p>}
      </div>
      <p className="contact-hint">Encontre os detalhes. Imagine as possibilidades.</p>
      <Link className="advertiser" to={`/anunciantes/${product.usuario.id}`} aria-label={`Ver perfil de ${nome}`}>
        <Avatar className="advertiser-avatar" foto={product.usuario.img?.url ?? null} icon="home" />
        <div><strong>{nome}</strong><span>Ver todos os anúncios</span></div>
        <Icon name="arrow" size={17} />
      </Link>
    </aside>
  )
}
