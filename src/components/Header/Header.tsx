import type { TransactionType } from '../../dtos/product.dto'
import { Icon } from '../Icon/Icon'

export function Header({ transaction, isDetails }: { transaction: TransactionType; isDetails: boolean }) {
  const isBuying = !isDetails && transaction === 'sale'
  const isRenting = !isDetails && transaction === 'rent'

  return (
    <header className="site-header">
      <div className="header-inner container">
        <a className="brand" href="#/imoveis" aria-label="Imobilia, página inicial">
          <span className="brand-symbol"><Icon name="home" size={25} /></span>
          <span>imobilia<span className="brand-dot">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#/imoveis?finalidade=venda" className={isBuying ? 'active' : ''} aria-current={isBuying ? 'page' : undefined}>
            Comprar
          </a>
          <a href="#/imoveis" className={isRenting ? 'active' : ''} aria-current={isRenting ? 'page' : undefined}>
            Alugar
          </a>
        </nav>
        <span className="header-note"><span className="status-dot" /> Seu próximo lar está aqui.</span>
      </div>
    </header>
  )
}
