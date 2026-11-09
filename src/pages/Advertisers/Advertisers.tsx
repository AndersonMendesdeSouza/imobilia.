import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import { UserService } from '../../services/user.service'
import type { UserResponseDTO } from '../../dtos/response/user-response.dto'
import { Icon } from '../../components/Icon/Icon'
import { Avatar } from '../../components/Avatar/Avatar'
import './Advertisers.css'

export function Advertisers() {
  const [usuarios, setUsuarios] = useState<UserResponseDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const advertisers = usuarios.filter((usuario) => usuario.perfil === 'anunciante')

  useEffect(() => {
    document.title = 'Imobiliárias e corretores | Imobilia'
  }, [])

  useEffect(() => {
    let ativo = true

    UserService.findAll()
      .then((usuarios) => {
        if (ativo) setUsuarios(usuarios)
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar os anunciantes. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [tentativa])

  function recarregar() {
    setCarregando(true)
    setErro('')
    setTentativa((atual) => atual + 1)
  }

  return (
    <main id="main-content" className="directory-page container" tabIndex={-1} aria-busy={carregando}>
      <div className="directory-heading">
        <span className="eyebrow">CONHEÇA QUEM ANUNCIA</span>
        <h1>Imobiliárias e corretores</h1>
        <p>Encontre profissionais, conheça seus perfis e explore os imóveis de cada anunciante.</p>
      </div>
      {carregando && <div className="empty-state" role="status"><p>Carregando anunciantes…</p></div>}
      {!carregando && erro && (
        <div className="empty-state">
          <h2>Não foi possível carregar os anunciantes.</h2>
          <p role="alert">{erro}</p>
          <button type="button" className="button button-primary" onClick={recarregar}>Tentar novamente</button>
        </div>
      )}
      {!carregando && !erro && advertisers.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon"><Icon name="building" size={30} /></span>
          <h2>Nenhum anunciante cadastrado.</h2>
          <p>Os anunciantes aparecerão aqui quando forem cadastrados.</p>
        </div>
      )}
      {!carregando && !erro && advertisers.length > 0 && (
        <div className="advertisers-grid">
          {advertisers.map((usuario) => {
            const count = usuario.imoveis.length

            return (
              <Link className="advertiser-list-card" to={`/anunciantes/${usuario.id}`} key={usuario.id}>
                <div className="advertiser-card-heading">
                  <Avatar className="public-profile-avatar" foto={usuario.img?.url ?? null} icon="building" />
                  <span className="advertiser-kind">Anunciante</span>
                </div>
                <h2>{usuario.nome}</h2>
                <p className="public-profile-location"><Icon name="pin" size={15} />{usuario.cidade}, {usuario.estado}</p>
                <p className="advertiser-card-description">{usuario.descricao}</p>
                <div className="advertiser-card-footer">
                  <span><strong>{count}</strong> {count === 1 ? 'imóvel publicado' : 'imóveis publicados'}</span>
                  <span className="advertiser-card-action">Ver perfil <Icon name="arrow" size={17} /></span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
