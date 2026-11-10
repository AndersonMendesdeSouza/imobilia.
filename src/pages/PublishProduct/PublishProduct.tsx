import { Link, useNavigate, useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { ImovelRequestDTO } from '../../dtos/request/imovel-request.dto'
import type { ImovelResponseDTO } from '../../dtos/response/imovel-response.dto'
import type { TipoImovel } from '../../dtos/enums'
import { brazilianStates } from '../../data/states'
import { ImoveisService } from '../../services/imoveis.service'
import { isAxiosError } from 'axios'
import { Icon } from '../../components/Icon/Icon'
import { useAuth } from '../../hooks/useAuth'
import '../Account.css'

export function PublishProduct() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { usuario } = useAuth()
  const isEditing = Boolean(productId)
  const [existingProperty, setExistingProperty] = useState<ImovelResponseDTO | null>(null)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [propertyType, setPropertyType] = useState<TipoImovel>('casa')
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([])
  const [photoError, setPhotoError] = useState('')
  const [error, setError] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const previewUrlsRef = useRef<string[]>([])
  const isLand = propertyType === 'lote'
  const savedImages = [...(existingProperty?.imagens ?? [])]
    .filter((image) => !removedImageIds.includes(image.id))
    .sort((first, second) => Number(second.isPrimary) - Number(first.isPrimary))
  const photoCount = savedImages.length + photos.length
  let submitLabel = isEditing ? 'Salvar alterações' : 'Publicar imóvel'
  if (isPublishing) submitLabel = isEditing ? 'Salvando…' : 'Publicando…'

  useEffect(() => {
    document.title = isEditing ? 'Editar imóvel | Imobilia' : 'Publicar imóvel | Imobilia'
  }, [isEditing])

  useEffect(() => {
    if (!productId) return
    let active = true

    ImoveisService.findOne(productId)
      .then((property) => {
        if (!active) return
        if (property.usuarioId !== usuario?.id && usuario?.perfil !== 'administrador') {
          setLoadError('Você só pode editar seus próprios imóveis.')
          return
        }
        setExistingProperty(property)
        setPropertyType(property.tipo)
      })
      .catch((error: unknown) => {
        if (!active) return
        const notFound = isAxiosError(error) && error.response?.status === 404
        setLoadError(notFound ? 'Imóvel não encontrado.' : 'Não foi possível carregar o imóvel. Tente novamente.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [productId, usuario?.id, usuario?.perfil, loadAttempt])

  useEffect(() => {
    const previewUrls = previewUrlsRef.current
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    if (isPublishing) return
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    if (!files.length) return

    setPhotoError('')

    if (photoCount + files.length > 20) {
      setPhotoError('Selecione no máximo 20 fotos por imóvel.')
      return
    }

    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 1048576) {
        setPhotoError(`A foto "${file.name}" deve ser JPG, PNG ou WebP, com até 1 MB e não pode estar vazia.`)
        return
      }
    }

    const newPhotos = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    previewUrlsRef.current.push(...newPhotos.map((photo) => photo.preview))
    setPhotos((currentPhotos) => [...currentPhotos, ...newPhotos])
  }

  function handleRemovePhoto(preview: string) {
    if (isPublishing) return

    const previewIndex = previewUrlsRef.current.indexOf(preview)
    if (previewIndex === -1) return

    previewUrlsRef.current.splice(previewIndex, 1)
    URL.revokeObjectURL(preview)
    setPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.preview !== preview))
    setPhotoError('')
  }

  function handleRemoveSavedImage(id: string) {
    if (isPublishing) return
    setRemovedImageIds((current) => [...current, id])
    setPhotoError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPublishing) return
    setError('')
    if (!photoCount) {
      setPhotoError('Selecione ao menos uma foto do imóvel para continuar.')
      return
    }

    const form = new FormData(event.currentTarget)
    const input: ImovelRequestDTO = {
      titulo: String(form.get('titulo') ?? ''),
      tipo: propertyType,
      finalidade: form.get('finalidade') === 'venda' ? 'venda' : 'aluguel',
      valor: Number(form.get('valor')),
      condominioMensal: Number(form.get('condominioMensal')),
      iptuMensal: Number(form.get('iptuMensal')),
      cidade: String(form.get('cidade') ?? ''),
      estado: String(form.get('estado') ?? ''),
      bairro: String(form.get('bairro') ?? ''),
      area: Number(form.get('area')),
      quartos: isLand ? 0 : Number(form.get('quartos')),
      banheiros: isLand ? 0 : Number(form.get('banheiros')),
      vagasGaragem: isLand ? 0 : Number(form.get('vagasGaragem')),
      descricao: String(form.get('descricao') ?? ''),
      comodidades: existingProperty?.comodidades ?? [],
    }

    try {
      setIsPublishing(true)
      if (productId) {
        await ImoveisService.update(productId, { ...input, imagensRemovidas: removedImageIds }, photos.map((photo) => photo.file))
        navigate('/perfil')
      } else {
        const product = await ImoveisService.create(input, photos.map((photo) => photo.file))
        navigate(`/imoveis/${product.id}`)
      }
    } catch (error) {
      const fallback = isEditing ? 'Não foi possível salvar as alterações. Tente novamente.' : 'Não foi possível publicar. Tente novamente.'
      if (isAxiosError<{ message?: string | string[] }>(error)) {
        const mensagem = error.response?.data?.message
        setError(Array.isArray(mensagem) ? mensagem.join(' ') : mensagem || fallback)
      } else {
        setError(error instanceof Error ? error.message : fallback)
      }
    } finally {
      setIsPublishing(false)
    }
  }

  if (isEditing && !existingProperty) {
    return (
      <main id="main-content" className="account-page publish-page container" tabIndex={-1} aria-busy={isLoading}>
        <Link className="account-back" to="/perfil"><Icon name="back" size={17} /> Voltar ao meu perfil</Link>
        {isLoading ? <p role="status">Carregando imóvel…</p> : (
          <>
            <p className="account-alert" role="alert">{loadError}</p>
            <button className="button button-primary" type="button" onClick={() => {
              setLoadError('')
              setIsLoading(true)
              setLoadAttempt((current) => current + 1)
            }}>Tentar novamente</button>
          </>
        )}
      </main>
    )
  }

  return (
    <main id="main-content" className="account-page publish-page container" tabIndex={-1}>
      <Link className="account-back" to="/perfil"><Icon name="back" size={17} /> Voltar ao meu perfil</Link>
      <div className="account-page-heading">
        <span className="eyebrow">{isEditing ? 'SEU ANÚNCIO' : 'UM NOVO ANÚNCIO'}</span>
        <h1>{isEditing ? 'Edite seu imóvel.' : 'Publique seu imóvel.'}</h1>
        <p>{isEditing ? 'Atualize as informações do seu anúncio.' : 'Conte o que torna esse espaço especial. Ele aparecerá na busca e no seu perfil público.'}</p>
      </div>
      <form className="publish-form" onSubmit={handleSubmit}>
        <fieldset className="publish-section">
          <legend>Sobre o imóvel</legend>
          <div className="publish-form-grid">
            <label className="account-field full-span"><span>Título do anúncio</span><input name="titulo" defaultValue={existingProperty?.titulo ?? ''} required minLength={3} maxLength={150} placeholder="Ex.: Casa com jardim no Centro" /></label>
            <label className="account-field">
              <span>Tipo de imóvel</span>
              <select name="tipo" value={propertyType} onChange={(event) => setPropertyType(event.target.value as TipoImovel)}>
                <option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="lote">Lote</option>
              </select>
            </label>
            <label className="account-field"><span>Finalidade</span><select name="finalidade" defaultValue={existingProperty?.finalidade ?? 'aluguel'}><option value="aluguel">Aluguel</option><option value="venda">Venda</option></select></label>
            <label className="account-field full-span"><span>Descrição</span><textarea name="descricao" defaultValue={existingProperty?.descricao ?? ''} required minLength={30} maxLength={2500} rows={5} placeholder="Descreva os espaços, os diferenciais e a região do imóvel." /></label>
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Localização</legend>
          <div className="publish-form-grid">
            <label className="account-field"><span>Cidade</span><input name="cidade" defaultValue={existingProperty?.cidade ?? ''} required minLength={2} maxLength={100} autoComplete="address-level2" placeholder="Nome da cidade" /></label>
            <label className="account-field"><span>Estado</span><select name="estado" required defaultValue={existingProperty?.estado ?? ''}><option value="" disabled>Selecione</option>{brazilianStates.map((estado) => <option key={estado} value={estado}>{estado}</option>)}</select></label>
            <label className="account-field full-span"><span>Bairro</span><input name="bairro" defaultValue={existingProperty?.bairro ?? ''} required minLength={2} maxLength={100} placeholder="Nome do bairro" /></label>
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Valores e características</legend>
          <div className="publish-form-grid">
            <label className="account-field"><span>Valor de venda ou aluguel (R$)</span><input name="valor" defaultValue={existingProperty?.valor ?? ''} type="number" required min="0.01" step="0.01" inputMode="decimal" placeholder="0,00" /></label>
            <label className="account-field"><span>{isLand ? 'Área total (m²)' : 'Área útil (m²)'}</span><input name="area" defaultValue={existingProperty?.area ?? ''} type="number" required min="0.01" step="0.01" inputMode="decimal" placeholder="0" /></label>
            <label className="account-field"><span>Condomínio mensal (R$)</span><input name="condominioMensal" type="number" required min="0" step="0.01" inputMode="decimal" defaultValue={existingProperty?.condominioMensal ?? 0} /></label>
            <label className="account-field"><span>IPTU mensal (R$)</span><input name="iptuMensal" type="number" required min="0" step="0.01" inputMode="decimal" defaultValue={existingProperty?.iptuMensal ?? 0} /></label>
            {!isLand && (
              <div className="publish-counts full-span">
                <label className="account-field"><span>Quartos</span><input name="quartos" type="number" required min="1" step="1" inputMode="numeric" defaultValue={existingProperty?.quartos ?? 1} /></label>
                <label className="account-field"><span>Banheiros</span><input name="banheiros" type="number" required min="1" step="1" inputMode="numeric" defaultValue={existingProperty?.banheiros ?? 1} /></label>
                <label className="account-field"><span>Vagas</span><input name="vagasGaragem" type="number" required min="0" step="1" inputMode="numeric" defaultValue={existingProperty?.vagasGaragem ?? 0} /></label>
              </div>
            )}
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Fotos do imóvel</legend>
          <label className="account-field"><span>Adicione fotos do imóvel</span><input name="fotos" type="file" accept="image/jpeg,image/png,image/webp" multiple required={!photoCount} disabled={isPublishing} onChange={handlePhotos} aria-describedby="photo-hint" /></label>
          <p className="account-field-hint" id="photo-hint">Você pode adicionar fotos aos poucos, até 20 no total. JPG, PNG ou WebP, com até 1 MB cada. A primeira será a foto principal.</p>
          {isEditing && <p className="account-field-hint">As fotos adicionadas e removidas serão atualizadas ao salvar as alterações.</p>}
          {photoError && <p className="account-alert" role="alert">{photoError}</p>}
          {photoCount > 0 && (
            <>
              <p className="account-field-hint" role="status">{photoCount} {photoCount === 1 ? 'foto selecionada' : 'fotos selecionadas'}</p>
              <div className="publish-photo-grid">
                {savedImages.map((image, index) => (
                  <figure className="publish-photo-item" key={image.id}>
                    <img className="publish-photo-preview" src={image.url} alt={`Foto ${index + 1} do imóvel`} />
                    <button className="publish-photo-remove" type="button" onClick={() => handleRemoveSavedImage(image.id)} disabled={isPublishing} aria-label={`Remover foto ${index + 1} do imóvel`} title="Remover foto">
                      <Icon name="close" size={18} />
                    </button>
                    <figcaption>{index === 0 ? 'Foto principal' : `Foto ${index + 1}`}</figcaption>
                  </figure>
                ))}
                {photos.map((photo, index) => (
                  <figure className="publish-photo-item" key={photo.preview}>
                    <img className="publish-photo-preview" src={photo.preview} alt={`Prévia da foto ${savedImages.length + index + 1} do imóvel`} />
                    <button className="publish-photo-remove" type="button" onClick={() => handleRemovePhoto(photo.preview)} disabled={isPublishing} aria-label={`Remover foto ${savedImages.length + index + 1}: ${photo.file.name}`} title="Remover foto">
                      <Icon name="close" size={18} />
                    </button>
                    <figcaption>{savedImages.length + index === 0 ? 'Foto principal' : `Foto ${savedImages.length + index + 1}`}</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}
        </fieldset>
        {error && <p className="account-alert" role="alert">{error}</p>}
        <div className="publish-actions">
          <Link className="button owner-secondary-button" to="/perfil">Cancelar</Link>
          <button className="button button-primary account-submit" type="submit" disabled={isPublishing} aria-busy={isPublishing}><Icon name={isEditing ? 'check' : 'plus'} size={19} /> {submitLabel}</button>
        </div>
      </form>
    </main>
  )
}
