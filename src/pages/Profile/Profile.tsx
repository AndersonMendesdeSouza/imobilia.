import { Link, useNavigate } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { isAxiosError } from 'axios'
import type { UserResponseDTO } from '../../dtos/response/user-response.dto'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import { ImoveisService } from '../../services/imoveis.service'
import { useAuth } from '../../hooks/useAuth'
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
  const navigate = useNavigate()
  const { atualizarUsuario, atualizarFoto } = useAuth()
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState('')
  const products = user.imoveis.filter((imovel) => !deletedIds.includes(imovel.id)).map((imovel) => ({ ...imovel, usuario: user }))
  const publishedProduct = publishedProductId ? products.find((product) => product.id === publishedProductId) : null
  const [error, setError] = useState('')
  const [atualizandoFoto, setAtualizandoFoto] = useState(false)
  const [fotoAtualizada, setFotoAtualizada] = useState(false)
  const fotoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = 'Meu perfil | Imobilia'
    let ativo = true
    atualizarUsuario().catch(() => {
      if (ativo) setError('Não foi possível atualizar seus imóveis. Tente novamente mais tarde.')
    })
    return () => { ativo = false }
  }, [atualizarUsuario])

  async function handleDelete(product: ImovelResponseDTO) {
    if (deletingId) return
    if (!window.confirm(`Excluir "${product.titulo}" e todas as suas fotos? Esta ação não pode ser desfeita.`)) return

    setError('')
    setDeleteSuccess('')
    setDeletingId(product.id)
    try {
      await ImoveisService.remove(product.id)
      setDeletedIds((current) => [...current, product.id])
      setDeleteSuccess('Imóvel excluído com sucesso.')
      await atualizarUsuario().catch(() => {
        setError('O imóvel foi excluído, mas não foi possível recarregar seu perfil. Atualize a página para tentar novamente.')
      })
    } catch (error) {
      if (isAxiosError<{ message?: string | string[] }>(error)) {
        const mensagem = error.response?.data?.message
        setError(Array.isArray(mensagem) ? mensagem.join(' ') : mensagem || 'Não foi possível excluir o imóvel. Tente novamente.')
      } else {
        setError(error instanceof Error ? error.message : 'Não foi possível excluir o imóvel. Tente novamente.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file || atualizandoFoto) return
    setError('')
    setFotoAtualizada(false)

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 1048576) {
      setError('Escolha uma foto JPG, PNG ou WebP de até 1 MB.')
      return
    }

    setAtualizandoFoto(true)
    try {
      await atualizarFoto(file)
      setFotoAtualizada(true)
    } catch (error) {
      if (isAxiosError<{ message?: string | string[] }>(error)) {
        const mensagem = error.response?.data?.message
        setError(Array.isArray(mensagem) ? mensagem.join(' ') : mensagem || 'Não foi possível atualizar sua foto. Tente novamente.')
      } else {
        setError(error instanceof Error ? error.message : 'Não foi possível atualizar sua foto. Tente novamente.')
      }
    } finally {
      setAtualizandoFoto(false)
    }
  }

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
          <div className="profile-photo-control">
            <Avatar className="public-profile-avatar profile-avatar-large" foto={user.img?.url ?? null} />
            <input ref={fotoInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={atualizandoFoto} onChange={handlePhoto} aria-label="Selecionar nova foto do perfil" />
            <button className="profile-photo-button" type="button" onClick={() => fotoInputRef.current?.click()} disabled={atualizandoFoto} aria-busy={atualizandoFoto} title="JPG, PNG ou WebP de até 1 MB">
              <Icon name="images" size={14} /> {atualizandoFoto ? 'Atualizando…' : 'Atualizar foto'}
            </button>
          </div>
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
      {deletingId && <p className="account-field-hint" role="status">Excluindo imóvel e suas fotos…</p>}
      {deleteSuccess && <p className="publication-success" role="status"><Icon name="check" size={18} /> {deleteSuccess}</p>}
      {fotoAtualizada && <p className="publication-success" role="status"><Icon name="check" size={18} /> Foto atualizada com sucesso.</p>}
      {publishedProduct && (
        <div className="publication-success" role="status">
          <Icon name="check" size={21} />
          <span>Imóvel publicado com sucesso.</span>
          <Link to={`/imoveis/${publishedProduct.id}`}>Ver anúncio <Icon name="arrow" size={16} /></Link>
        </div>
      )}
      <section className="profile-products" aria-labelledby="my-products-title">
        <div className="results-toolbar">
          <div className="results-summary">
            <h2 id="my-products-title">Meus imóveis</h2>
            <span className="results-count">{products.length} {products.length === 1 ? 'imóvel publicado' : 'imóveis publicados'}</span>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="products-grid">{products.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={() => navigate(`/perfil/imoveis/${product.id}/editar`)} onDelete={() => handleDelete(product)} disabled={deletingId !== null} />
          ))}</div>
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
