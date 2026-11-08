import { Link } from 'react-router'
import { useEffect } from 'react'
import { Icon } from '../../components/Icon/Icon'
import './More.css'

export function More({ isLoggedIn }: { isLoggedIn: boolean }) {
  useEffect(() => {
    document.title = 'Mais sobre a plataforma | Imobilia'
  }, [])

  return (
    <main id="main-content" className="more-page container" tabIndex={-1}>
      <div className="more-heading">
        <span className="eyebrow">SOBRE A IMOBILIA</span>
        <h1>Seu próximo endereço começa por aqui.</h1>
        <p>Um espaço para reunir imóveis, conectar pessoas e conhecer quem está por trás de cada anúncio.</p>
      </div>
      {!isLoggedIn && (
        <section className="more-access" aria-label="Acesso à conta">
          <div>
            <strong>Acesse sua conta</strong>
            <p>Gerencie seus anúncios e publique novos imóveis.</p>
          </div>
          <Link className="button button-primary more-login-button" to="/mais/login">
            Entrar <Icon name="arrow" size={18} />
          </Link>
        </section>
      )}
      <div className="more-links">
        {isLoggedIn && (
          <Link to="/perfil">
            <span className="more-link-icon"><Icon name="user" size={23} /></span>
            <span><strong>Gerenciar meu perfil</strong><small>Acesse seus imóveis e publique um novo anúncio.</small></span>
            <Icon name="arrow" size={19} />
          </Link>
        )}
        <Link to="/imoveis">
          <span className="more-link-icon"><Icon name="home" size={23} /></span>
          <span><strong>Encontrar um imóvel</strong><small>Explore casas, apartamentos e lotes.</small></span>
          <Icon name="arrow" size={19} />
        </Link>
        <Link to="/anunciantes">
          <span className="more-link-icon"><Icon name="building" size={23} /></span>
          <span><strong>Conhecer os anunciantes</strong><small>Veja perfis e todos os imóveis publicados por eles.</small></span>
          <Icon name="arrow" size={19} />
        </Link>
      </div>
      <section className="more-questions" aria-labelledby="more-questions-title">
        <h2 id="more-questions-title">Como funciona</h2>
        <details>
          <summary>Como vejo os imóveis de uma imobiliária ou corretor?</summary>
          <p>Abra a aba Anunciantes e escolha um perfil. Você encontrará todos os imóveis desse anunciante e poderá abrir os detalhes de cada um.</p>
        </details>
        <details>
          <summary>Posso compartilhar o perfil de um anunciante?</summary>
          <p>Sim. Entre no perfil, toque em Compartilhar perfil e envie o link para a pessoa que você quiser. Ela poderá consultar os anúncios daquele perfil.</p>
        </details>
        <details>
          <summary>Como funciona a publicação de imóveis?</summary>
          <p>Entre com uma conta de demonstração e abra seu Perfil para publicar um imóvel. Nesta versão, os novos anúncios ficam salvos apenas no navegador utilizado.</p>
        </details>
      </section>
    </main>
  )
}
