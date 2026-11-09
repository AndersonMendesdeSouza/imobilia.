import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import type { UserResponseDTO } from '../../dtos/response/user-response.dto'
import { productService } from '../../services/product.service'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import { Icon } from '../../components/Icon/Icon'
import { Avatar } from '../../components/Avatar/Avatar'
import '../Advertisers/Advertisers.css'
import '../Account.css'

interface ProfileProps {
  user: UserResponseDTO
  onLogout: () => void
  publishedProductId: string | null
}

export function Profile({ user, onLogout, publishedProductId }: ProfileProps) {
  const products = productService.listByAdvertiser(user.id)
  const publishedProduct = publishedProductId ? products.find((product) => product.id === publishedProductId) : null
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Meu perfil | Imobilia'
  }, [])

  function handleLogout() {
    try {
      onLogout()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível sair. Tente novamente.')
    }
  }

  return (
    <main id="main-content" className="directory-page container" tabIndex={-1}>
      <section className="owner-profile-header" aria-labelledby="my-profile-title">
        <div className="public-profile-identity">
          <Avatar className="public-profile-avatar profile-avatar-large" foto={user.foto} />
          <div>
            <span className="eyebrow">MINHA CONTA</span>
            <h1 id="my-profile-title">{user.nome}</h1>
            <p className="public-profile-location"><Icon name="pin" size={15} />{user.cidade}, {user.estado}</p>
          </div>
        </div>
        <div className="owner-profile-actions">
          <Link className="button button-primary owner-publish-button" to="/perfil/publicar"><Icon name="plus" size={19} /> Publicar imóvel</Link>
          <Link className="button owner-secondary-button" to={`/anunciantes/${user.id}`}><Icon name="share" size={17} /> Ver perfil público</Link>
          <button className="button owner-logout-button" type="button" onClick={handleLogout}><Icon name="logout" size={18} /> Sair</button>
        </div>
      </section>
      {error && <p className="account-alert" role="alert">{error}</p>}
      {publishedProduct && (
        <div className="publication-success" role="status">
          <Icon name="check" size={21} />
          <span>Imóvel publicado na demonstração.</span>
          <Link to={`/imoveis/${publishedProduct.id}`}>Ver anúncio <Icon name="arrow" size={16} /></Link>
        </div>
      )}
      <p className="account-demo-notice">Sessão de demonstração. Os novos anúncios ficam salvos apenas neste navegador.</p>
      <section className="profile-products" aria-labelledby="my-products-title">
        <div className="results-toolbar">
          <div className="results-summary">
            <h2 id="my-products-title">Meus imóveis</h2>
            <span className="results-count">{products.length} {products.length === 1 ? 'imóvel publicado' : 'imóveis publicados'}</span>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="products-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Icon name="home" size={30} /></span>
            <h3>Seu primeiro anúncio começa aqui.</h3>
            <p>Publique um imóvel para vê-lo na sua página e na busca da Imobilia.</p>
            <Link className="button button-primary" to="/perfil/publicar">Publicar meu primeiro imóvel</Link>
          </div>
        )}
      </section>
      <Link className="account-about-link" to="/perfil/sobre">Sobre a plataforma</Link>
    </main>
  )
}
