import { Link, useNavigate } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { CreateProductDTO, PropertyType } from '../../dtos/product.dto'
import { brazilianStates } from '../../data/states'
import { productService } from '../../services/product.service'
import { Icon } from '../../components/Icon/Icon'
import '../Account.css'

export function PublishProduct() {
  const navigate = useNavigate()
  const [propertyType, setPropertyType] = useState<PropertyType>('house')
  const [image, setImage] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [error, setError] = useState('')
  const [isReadingPhoto, setIsReadingPhoto] = useState(false)
  const readerRef = useRef<FileReader | null>(null)
  const isLand = propertyType === 'land'

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!image) {
      setPhotoError('Selecione a foto principal do imóvel para continuar.')
      return
    }

    const form = new FormData(event.currentTarget)
    const input: CreateProductDTO = {
      title: String(form.get('title') ?? ''),
      type: propertyType,
      transaction: form.get('transaction') === 'sale' ? 'sale' : 'rent',
      price: Number(form.get('price')),
      condominiumFee: Number(form.get('condominiumFee')),
      propertyTax: Number(form.get('propertyTax')),
      city: String(form.get('city') ?? ''),
      state: String(form.get('state') ?? ''),
      neighborhood: String(form.get('neighborhood') ?? ''),
      area: Number(form.get('area')),
      bedrooms: isLand ? 0 : Number(form.get('bedrooms')),
      bathrooms: isLand ? 0 : Number(form.get('bathrooms')),
      parkingSpaces: isLand ? 0 : Number(form.get('parkingSpaces')),
      description: String(form.get('description') ?? ''),
      image,
    }

    try {
      const product = productService.create(input)
      navigate(`/perfil?publicado=${product.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível publicar. Tente novamente.')
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
            <label className="account-field full-span"><span>Título do anúncio</span><input name="title" required minLength={3} maxLength={100} placeholder="Ex.: Casa com jardim no Centro" /></label>
            <label className="account-field">
              <span>Tipo de imóvel</span>
              <select name="type" value={propertyType} onChange={(event) => setPropertyType(event.target.value as PropertyType)}>
                <option value="house">Casa</option><option value="apartment">Apartamento</option><option value="land">Lote</option>
              </select>
            </label>
            <label className="account-field"><span>Finalidade</span><select name="transaction" defaultValue="rent"><option value="rent">Aluguel</option><option value="sale">Venda</option></select></label>
            <label className="account-field full-span"><span>Descrição</span><textarea name="description" required minLength={30} maxLength={2500} rows={5} placeholder="Descreva os espaços, os diferenciais e a região do imóvel." /></label>
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Localização</legend>
          <div className="publish-form-grid">
            <label className="account-field"><span>Cidade</span><input name="city" required minLength={2} maxLength={80} autoComplete="address-level2" placeholder="Nome da cidade" /></label>
            <label className="account-field"><span>Estado</span><select name="state" required defaultValue=""><option value="" disabled>Selecione</option>{brazilianStates.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
            <label className="account-field full-span"><span>Bairro</span><input name="neighborhood" required minLength={2} maxLength={80} placeholder="Nome do bairro" /></label>
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Valores e características</legend>
          <div className="publish-form-grid">
            <label className="account-field"><span>Valor de venda ou aluguel (R$)</span><input name="price" type="number" required min="0.01" step="0.01" inputMode="decimal" placeholder="0,00" /></label>
            <label className="account-field"><span>{isLand ? 'Área total (m²)' : 'Área útil (m²)'}</span><input name="area" type="number" required min="0.01" step="0.01" inputMode="decimal" placeholder="0" /></label>
            <label className="account-field"><span>Condomínio mensal (R$)</span><input name="condominiumFee" type="number" required min="0" step="0.01" inputMode="decimal" defaultValue="0" /></label>
            <label className="account-field"><span>IPTU mensal (R$)</span><input name="propertyTax" type="number" required min="0" step="0.01" inputMode="decimal" defaultValue="0" /></label>
            {!isLand && (
              <div className="publish-counts full-span">
                <label className="account-field"><span>Quartos</span><input name="bedrooms" type="number" required min="1" step="1" inputMode="numeric" defaultValue="1" /></label>
                <label className="account-field"><span>Banheiros</span><input name="bathrooms" type="number" required min="1" step="1" inputMode="numeric" defaultValue="1" /></label>
                <label className="account-field"><span>Vagas</span><input name="parkingSpaces" type="number" required min="0" step="1" inputMode="numeric" defaultValue="0" /></label>
              </div>
            )}
          </div>
        </fieldset>
        <fieldset className="publish-section">
          <legend>Foto principal</legend>
          <label className="account-field"><span>Escolha a foto que vai apresentar seu imóvel</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required onChange={handlePhoto} aria-describedby="photo-hint" /></label>
          <p className="account-field-hint" id="photo-hint">JPG, PNG ou WebP. Tamanho máximo de 1 MB para esta demonstração.</p>
          {isReadingPhoto && <p className="account-field-hint" role="status">Carregando foto…</p>}
          {photoError && <p className="account-alert" role="alert">{photoError}</p>}
          {image && <img className="publish-photo-preview" src={image} alt="Prévia da foto principal do anúncio" />}
        </fieldset>
        {error && <p className="account-alert" role="alert">{error}</p>}
        <div className="publish-actions">
          <Link className="button owner-secondary-button" to="/perfil">Cancelar</Link>
          <button className="button button-primary account-submit" type="submit" disabled={isReadingPhoto}><Icon name="plus" size={19} /> Publicar imóvel</button>
        </div>
      </form>
    </main>
  )
}
