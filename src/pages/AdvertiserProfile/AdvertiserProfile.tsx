import { Link, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { UserService } from '../../services/user.service'
import type { UserResponseDTO } from '../../dtos/response/user-response.dto'
import { isAxiosError } from 'axios'
import { ProductCarousels } from '../../components/ProductCarousel/ProductCarousels'
import { Icon } from '../../components/Icon/Icon'
import { Avatar } from '../../components/Avatar/Avatar'
import '../Advertisers/Advertisers.css'

export function AdvertiserProfile() {
  const { usuarioId = '' } = useParams()
  const [usuario, setUsuario] = useState<UserResponseDTO | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [shareUrl, setShareUrl] = useState('')
  const [shareStatus, setShareStatus] = useState('')

  useEffect(() => {
    let ativo = true

    UserService.findOne(usuarioId)
      .then((usuario) => {
        if (ativo) setUsuario(usuario)
      })
      .catch((error: unknown) => {
        if (!ativo) return
        if (isAxiosError(error) && error.response?.status === 404) {
          setUsuario(null)
        } else {
          setErro('Não foi possível carregar o perfil. Tente novamente.')
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [usuarioId, tentativa])

  useEffect(() => {
    if (carregando) {
      document.title = 'Perfil do anunciante | Imobilia'
    } else if (usuario) {
      document.title = `${usuario.nome} | Imobilia`
    } else {
      document.title = 'Perfil indisponível | Imobilia'
    }
  }, [usuario, carregando])

  function recarregar() {
    setCarregando(true)
    setErro('')
    setTentativa((atual) => atual + 1)
  }

  async function copyProfileLink() {
    if (!usuario) return

    const url = `${window.location.origin}${window.location.pathname}#/anunciantes/${usuario.id}`
    setShareUrl(url)

    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('Link copiado! Agora você pode enviá-lo para outra pessoa.')
    } catch {
      setShareStatus('Selecione e copie o link abaixo para compartilhar este perfil.')
    }
  }

  if (carregando) {
    return <main id="main-content" className="container not-found" tabIndex={-1} aria-busy="true"><p role="status">Carregando perfil…</p></main>
  }

  if (erro) {
    return (
      <main id="main-content" className="container not-found" tabIndex={-1}>
        <h1>Não foi possível carregar o perfil.</h1>
        <p role="alert">{erro}</p>
        <button type="button" className="button button-primary" onClick={recarregar}>Tentar novamente</button>
      </main>
    )
  }

  if (!usuario) {
    return (
      <main id="main-content" className="container not-found" tabIndex={-1}>
        <span className="empty-icon"><Icon name="building" size={30} /></span>
        <h1>Anunciante não encontrado</h1>
        <p>Este perfil não está disponível. Conheça os outros anunciantes da plataforma.</p>
        <Link className="button button-primary" to="/anunciantes">Ver anunciantes</Link>
      </main>
    )
  }

  const products = usuario.imoveis.map((imovel) => ({ ...imovel, usuario }))

  return (
    <main id="main-content" className="directory-page container" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Caminho da página">
        <Link to="/anunciantes"><Icon name="back" size={16} /> Voltar aos anunciantes</Link>
      </nav>
      <section className="public-profile-header" aria-labelledby="profile-title">
        <div className="public-profile-identity">
          <Avatar className="public-profile-avatar profile-avatar-large" foto={usuario.img?.url ?? null} icon="building" />
          <div>
            <span className="eyebrow">ANUNCIANTE</span>
            <h1 id="profile-title">{usuario.nome}</h1>
            <p className="public-profile-location"><Icon name="pin" size={15} />{usuario.cidade}, {usuario.estado}</p>
          </div>
        </div>
        <button className="button profile-share-button" type="button" onClick={copyProfileLink}>
          <Icon name="share" size={18} /> Compartilhar perfil
        </button>
        <p className="public-profile-description">{usuario.descricao}</p>
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
          <ProductCarousels products={products} />
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Icon name="home" size={30} /></span>
            <h3>Nenhum imóvel publicado ainda</h3>
            <p>Os imóveis deste anunciante aparecerão aqui quando forem publicados.</p>
            <Link className="button button-primary" to="/imoveis">Explorar outros imóveis</Link>
          </div>
        )}
      </section>
    </main>
  )
}
