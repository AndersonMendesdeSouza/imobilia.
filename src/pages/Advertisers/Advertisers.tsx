import { Link } from 'react-router'
import { useEffect } from 'react'
import { advertiserService } from '../../services/advertiser.service'
import { productService } from '../../services/product.service'
import { Icon } from '../../components/Icon/Icon'
import './Advertisers.css'

export function Advertisers() {
  const advertisers = advertiserService.list()

  useEffect(() => {
    document.title = 'Imobiliárias e corretores | Imobilia'
  }, [])

  return (
    <main id="main-content" className="directory-page container" tabIndex={-1}>
      <div className="directory-heading">
        <span className="eyebrow">CONHEÇA QUEM ANUNCIA</span>
        <h1>Imobiliárias e corretores</h1>
        <p>Encontre profissionais, conheça seus perfis e explore os imóveis de cada anunciante.</p>
      </div>
      <div className="advertisers-grid">
        {advertisers.map((advertiser) => {
          const count = productService.listByAdvertiser(advertiser.id).length

          return (
            <Link className="advertiser-list-card" to={`/anunciantes/${advertiser.id}`} key={advertiser.id}>
              <div className="advertiser-card-heading">
                <span className="public-profile-avatar"><Icon name="building" size={28} /></span>
                <span className="advertiser-kind">{advertiser.kind === 'agency' ? 'Imobiliária' : 'Corretagem independente'}</span>
              </div>
              <h2>{advertiser.name}</h2>
              <p className="public-profile-location"><Icon name="pin" size={15} />{advertiser.city}, {advertiser.state}</p>
              <p className="advertiser-card-description">{advertiser.description}</p>
              <div className="advertiser-card-footer">
                <span><strong>{count}</strong> {count === 1 ? 'imóvel publicado' : 'imóveis publicados'}</span>
                <span className="advertiser-card-action">Ver perfil <Icon name="arrow" size={17} /></span>
              </div>
            </Link>
          )
        })}
      </div>
      <p className="public-demo-note">Perfis e anúncios ilustrativos para conhecer a plataforma.</p>
    </main>
  )
}
