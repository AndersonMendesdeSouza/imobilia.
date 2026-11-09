import { Link } from 'react-router'
import type { FinalidadeImovel } from '../../dtos/enums'
import { Icon } from '../Icon/Icon'

export function Header({ finalidade, isListing }: { finalidade: FinalidadeImovel; isListing: boolean }) {
  const isBuying = isListing && finalidade === 'venda'
  const isRenting = isListing && finalidade === 'aluguel'

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link className="brand" to="/imoveis" aria-label="Imobilia, página inicial">
          <span className="brand-symbol"><Icon name="home" size={25} /></span>
          <span>imobilia<span className="brand-dot">.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Comprar ou alugar">
          <Link to="/imoveis?finalidade=venda" className={isBuying ? 'active' : ''} aria-current={isBuying ? 'page' : undefined}>
            Comprar
          </Link>
          <Link to="/imoveis" className={isRenting ? 'active' : ''} aria-current={isRenting ? 'page' : undefined}>
            Alugar
          </Link>
        </nav>
        <span className="header-note"><span className="status-dot" /> Seu próximo lar está aqui.</span>
      </div>
    </header>
  )
}
