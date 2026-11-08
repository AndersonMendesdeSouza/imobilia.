import { Link, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { advertiserService } from '../../services/advertiser.service'
import { productService } from '../../services/product.service'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import { Icon } from '../../components/Icon/Icon'
import '../Advertisers/Advertisers.css'

export function AdvertiserProfile() {
  const { advertiserId = '' } = useParams()
  const advertiser = advertiserService.getById(advertiserId)
  const [shareUrl, setShareUrl] = useState('')
  const [shareStatus, setShareStatus] = useState('')

  useEffect(() => {
    document.title = advertiser ? `${advertiser.name} | Imobilia` : 'Anunciante não encontrado | Imobilia'
  }, [advertiser])

  async function copyProfileLink() {
    if (!advertiser) return

    const url = `${window.location.origin}${window.location.pathname}#/anunciantes/${advertiser.id}`
    setShareUrl(url)

    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('Link copiado! Agora você pode enviá-lo para outra pessoa.')
    } catch {
      setShareStatus('Selecione e copie o link abaixo para compartilhar este perfil.')
    }
  }

  if (!advertiser) {
    return (
      <main id="main-content" className="container not-found" tabIndex={-1}>
        <span className="empty-icon"><Icon name="building" size={30} /></span>
        <h1>Anunciante não encontrado</h1>
        <p>Este perfil não está disponível. Conheça os outros anunciantes da plataforma.</p>
        <Link className="button button-primary" to="/anunciantes">Ver anunciantes</Link>
      </main>
    )
  }

  const products = productService.listByAdvertiser(advertiser.id)

  return (
    <main id="main-content" className="directory-page container" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Caminho da página">
        <Link to="/anunciantes"><Icon name="back" size={16} /> Voltar aos anunciantes</Link>
      </nav>
      <section className="public-profile-header" aria-labelledby="profile-title">
        <div className="public-profile-identity">
          <span className="public-profile-avatar profile-avatar-large"><Icon name="building" size={32} /></span>
          <div>
            <span className="eyebrow">{advertiser.kind === 'agency' ? 'IMOBILIÁRIA' : 'CORRETAGEM INDEPENDENTE'}</span>
            <h1 id="profile-title">{advertiser.name}</h1>
            <p className="public-profile-location"><Icon name="pin" size={15} />{advertiser.city}, {advertiser.state}</p>
          </div>
        </div>
        <button className="button profile-share-button" type="button" onClick={copyProfileLink}>
          <Icon name="share" size={18} /> Compartilhar perfil
        </button>
        <p className="public-profile-description">{advertiser.description}</p>
      </section>
      {shareUrl && (
        <div className="profile-share-result">
          <p role="status">{shareStatus}</p>
          <label htmlFor="profile-share-url">Link público do perfil</label>
          <input id="profile-share-url" type="url" readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} />
        </div>
      )}
      <section className="profile-products" aria-labelledby="profile-products-title">
        <div className="results-toolbar">
          <div className="results-summary">
            <h2 id="profile-products-title">Imóveis deste anunciante</h2>
            <span className="results-count">{products.length} {products.length === 1 ? 'imóvel publicado' : 'imóveis publicados'}</span>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Icon name="home" size={30} /></span>
            <h3>Nenhum imóvel publicado ainda</h3>
            <p>Os imóveis deste anunciante aparecerão aqui quando forem publicados.</p>
            <Link className="button button-primary" to="/imoveis">Explorar outros imóveis</Link>
          </div>
        )}
      </section>
      <p className="public-demo-note">Perfil e anúncios de demonstração.</p>
    </main>
  )
}
