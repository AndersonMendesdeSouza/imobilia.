import { Link } from 'react-router'
import { Icon } from '../Icon/Icon'

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link className="brand" to="/imoveis" aria-label="Imobilia, página inicial">
          <span className="brand-symbol"><Icon name="home" size={25} /></span>
          <span>imobilia<span className="brand-dot">.</span></span>
        </Link>
        <span className="header-note"><span className="status-dot" /> Seu próximo lar está aqui.</span>
      </div>
    </header>
  )
}
