import { Link, useNavigate } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { ImovelRequestDTO } from '../../dtos/request/imovel-request.dto'
import type { TipoImovel } from '../../dtos/enums'
import { brazilianStates } from '../../data/states'
import { productService } from '../../services/product.service'
import { Icon } from '../../components/Icon/Icon'
import '../Account.css'

export function PublishProduct() {
  const navigate = useNavigate()
  const [propertyType, setPropertyType] = useState<TipoImovel>('casa')
  const [image, setImage] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [error, setError] = useState('')
  const [isReadingPhoto, setIsReadingPhoto] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const readerRef = useRef<FileReader | null>(null)
  const isLand = propertyType === 'lote'

  useEffect(() => {
    document.title = 'Publicar imóvel | Imobilia'
    return () => readerRef.current?.abort()
  }, [])

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    readerRef.current?.abort()
    setImage('')
    setPhotoError('')
    setIsReadingPhoto(false)
    const file = event.currentTarget.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 1048576) {
      setPhotoError('Escolha uma foto JPG, PNG ou WebP de até 1 MB.')
      event.currentTarget.value = ''
      return
    }

    const reader = new FileReader()
    readerRef.current = reader
    setIsReadingPhoto(true)
    reader.onload = () => {
      if (typeof reader.result === 'string') setImage(reader.result)
      else setPhotoError('Não foi possível carregar esta foto. Selecione outra.')
      setIsReadingPhoto(false)
    }
    reader.onerror = () => {
      setPhotoError('Não foi possível ler esta foto. Selecione outra.')
      setIsReadingPhoto(false)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPublishing || isReadingPhoto) return
    setError('')
    if (!image) {
      setPhotoError('Selecione a foto principal do imóvel para continuar.')
      return
    }

    const form = new FormData(event.currentTarget)
    const file = form.get('foto')
    if (!(file instanceof File) || file.size === 0) {
      setPhotoError('Selecione o arquivo da foto principal do imóvel.')
      return
    }
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
      imgs: [{ file, isPrimary: true }],
      comodidades: [],
    }

    try {
      setIsPublishing(true)
      const product = await productService.create(input)
      navigate(`/perfil?publicado=${product.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível publicar. Tente novamente.')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <main id="main-content" className="account-page publish-page container" tabIndex={-1}>
      <Link className="account-back" to="/perfil"><Icon name="back" size={17} /> Voltar ao meu perfil</Link>
      <div className="account-page-heading">
        <span className="eyebrow">UM NOVO ANÚNCIO</span>
        <h1>Publique seu imóvel.</h1>
        <p>Conte o que torna esse espaço especial. Ele aparecerá na busca e no seu perfil público.</p>
      </div>
      <p className="account-demo-notice">Publicação de demonstração: o anúncio e a foto serão salvos apenas neste navegador.</p>
      <form className="publish-form" onSubmit={handleSubmit}>
        <fieldset className="publish-section">
          <legend>Sobre o imóvel</legend>
          <div className="publish-form-grid">
            <label className="account-field full-span"><span>Título do anúncio</span><input name="titulo" required minLength={3} maxLength={150} placeholder="Ex.: Casa com jardim no Centro" /></label>
            <label className="account-field">
              <span>Tipo de imóvel</span>
              <select name="tipo" value={propertyType} onChange={(event) => setPropertyType(event.target.value as TipoImovel)}>
                <option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="lote">Lote</option>
              </select>
            </label>
            <label className="account-field"><span>Finalidade</span><select name="finalidade" defaultValue="aluguel"><option value="aluguel">Aluguel</option><option value="venda">Venda</option></select></label>
            <label className="account-field full-span"><span>Descrição</span><textarea name="descricao" required minLength={30} maxLength={2500} rows={5} placeholder="Descreva os espaços, os diferenciais e a região do imóvel." /></label>
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Localização</legend>
          <div className="publish-form-grid">
            <label className="account-field"><span>Cidade</span><input name="cidade" required minLength={2} maxLength={100} autoComplete="address-level2" placeholder="Nome da cidade" /></label>
            <label className="account-field"><span>Estado</span><select name="estado" required defaultValue=""><option value="" disabled>Selecione</option>{brazilianStates.map((estado) => <option key={estado} value={estado}>{estado}</option>)}</select></label>
            <label className="account-field full-span"><span>Bairro</span><input name="bairro" required minLength={2} maxLength={100} placeholder="Nome do bairro" /></label>
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Valores e características</legend>
          <div className="publish-form-grid">
            <label className="account-field"><span>Valor de venda ou aluguel (R$)</span><input name="valor" type="number" required min="0.01" step="0.01" inputMode="decimal" placeholder="0,00" /></label>
            <label className="account-field"><span>{isLand ? 'Área total (m²)' : 'Área útil (m²)'}</span><input name="area" type="number" required min="0.01" step="0.01" inputMode="decimal" placeholder="0" /></label>
            <label className="account-field"><span>Condomínio mensal (R$)</span><input name="condominioMensal" type="number" required min="0" step="0.01" inputMode="decimal" defaultValue="0" /></label>
            <label className="account-field"><span>IPTU mensal (R$)</span><input name="iptuMensal" type="number" required min="0" step="0.01" inputMode="decimal" defaultValue="0" /></label>
            {!isLand && (
              <div className="publish-counts full-span">
                <label className="account-field"><span>Quartos</span><input name="quartos" type="number" required min="1" step="1" inputMode="numeric" defaultValue="1" /></label>
                <label className="account-field"><span>Banheiros</span><input name="banheiros" type="number" required min="1" step="1" inputMode="numeric" defaultValue="1" /></label>
                <label className="account-field"><span>Vagas</span><input name="vagasGaragem" type="number" required min="0" step="1" inputMode="numeric" defaultValue="0" /></label>
              </div>
            )}
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Foto principal</legend>
          <label className="account-field"><span>Escolha a foto que vai apresentar seu imóvel</span><input name="foto" type="file" accept="image/jpeg,image/png,image/webp" required onChange={handlePhoto} aria-describedby="photo-hint" /></label>
          <p className="account-field-hint" id="photo-hint">JPG, PNG ou WebP. Tamanho máximo de 1 MB para esta demonstração.</p>
          {isReadingPhoto && <p className="account-field-hint" role="status">Carregando foto…</p>}
          {photoError && <p className="account-alert" role="alert">{photoError}</p>}
          {image && <img className="publish-photo-preview" src={image} alt="Prévia da foto principal do anúncio" />}
        </fieldset>
        {error && <p className="account-alert" role="alert">{error}</p>}
        <div className="publish-actions">
          <Link className="button owner-secondary-button" to="/perfil">Cancelar</Link>
          <button className="button button-primary account-submit" type="submit" disabled={isReadingPhoto || isPublishing} aria-busy={isPublishing}><Icon name="plus" size={19} /> {isPublishing ? 'Publicando…' : 'Publicar imóvel'}</button>
        </div>
      </form>
    </main>
  )
}
