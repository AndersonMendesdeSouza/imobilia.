import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { TipoImovel, FinalidadeImovel } from '../../dtos/enums'
import { useImoveis } from '../../hooks/useImoveis'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import { FeaturedProducts } from '../../components/FeaturedProducts/FeaturedProducts'
import { Icon } from '../../components/Icon/Icon'
import './Products.css'

interface FiltrosImoveis {
  localizacao: string
  tipo?: TipoImovel
  valorMaximo?: number
  quartos?: number
}

function normalizarLocalizacao(localizacao: string) {
  return localizacao.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export function Products({ finalidade }: { finalidade?: FinalidadeImovel }) {
  const initialFilters: FiltrosImoveis = {
    localizacao: '',
  }
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const { imoveis, carregando, erro, recarregar } = useImoveis()
  const localizacao = normalizarLocalizacao(appliedFilters.localizacao)
  const products = imoveis.filter((product) => {
    if (finalidade && product.finalidade !== finalidade) return false
    if (appliedFilters.tipo && product.tipo !== appliedFilters.tipo) return false
    if (appliedFilters.valorMaximo !== undefined && product.valor > appliedFilters.valorMaximo) return false
    if (appliedFilters.quartos !== undefined && product.quartos < appliedFilters.quartos) return false
    const endereco = normalizarLocalizacao(`${product.bairro} ${product.cidade} ${product.estado}`)
    return endereco.includes(localizacao)
  })
  const featuredProducts = imoveis.filter((product) => (!finalidade || product.finalidade === finalidade) && product.destaque)
  const hasFilters = Boolean(appliedFilters.localizacao || appliedFilters.tipo || appliedFilters.valorMaximo || appliedFilters.quartos)
  const rentPrices = [2000, 3000, 4000, 5000, 6000]
  const salePrices = [500000, 750000, 1000000]
  let priceOptions = [...rentPrices, ...salePrices]
  let titulo = 'Todos os imóveis'
  if (finalidade === 'aluguel') {
    priceOptions = rentPrices
    titulo = 'Imóveis para alugar'
  }
  if (finalidade === 'venda') {
    priceOptions = salePrices
    titulo = 'Imóveis para comprar'
  }
  let resumo = `${products.length} ${products.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`
  if (carregando) resumo = 'Carregando…'
  if (erro) resumo = 'Listagem indisponível'

  useEffect(() => {
    document.title = `${titulo} | Imobilia`
  }, [titulo])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedFilters({ ...filters, localizacao: filters.localizacao.trim() })
  }

  function clearFilters() {
    setFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }

  return (
    <main id="main-content" className="listing-page container" tabIndex={-1}>
      <h1 className="visually-hidden">{titulo}</h1>
      <form className="search-filters" onSubmit={handleSearch} role="search" aria-label="Buscar imóveis">
        <label className="filter-field location-field">
          <Icon name="search" />
          <span className="field-content">
            <span className="field-label">Localização</span>
            <input
              type="search"
              name="localizacao"
              placeholder="Cidade ou bairro"
              value={filters.localizacao ?? ''}
              onChange={(event) => setFilters({ ...filters, localizacao: event.target.value })}
            />
          </span>
        </label>
        <label className="filter-field property-type-field">
          <Icon name="home" />
          <span className="field-content">
            <span className="field-label">Tipo de imóvel</span>
            <select
              name="tipo"
              value={filters.tipo ?? ''}
              onChange={(event) => {
                const tipo = event.target.value as TipoImovel | ''
                setFilters({ ...filters, tipo: tipo || undefined, quartos: tipo === 'lote' ? undefined : filters.quartos })
              }}
            >
              <option value="">Todos os tipos</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="lote">Lote</option>
            </select>
          </span><Icon name="chevron" size={16} />
        </label>
        <label className="filter-field price-field">
          <span className="currency-icon" aria-hidden="true">R$</span>
          <span className="field-content">
            <span className="field-label">Valor máximo</span>
            <select
              name="valorMaximo"
              value={filters.valorMaximo ?? ''}
              onChange={(event) => setFilters({ ...filters, valorMaximo: event.target.value ? Number(event.target.value) : undefined })}
            >
              <option value="">Sem limite</option>
              {priceOptions.map((valor) => (
                <option key={valor} value={valor}>
                  Até {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                </option>
              ))}
            </select>
          </span><Icon name="chevron" size={16} />
        </label>
        <label className="filter-field bedrooms-field">
          <Icon name="bed" />
          <span className="field-content">
            <span className="field-label">Quartos</span>
            <select
              name="quartos"
              disabled={filters.tipo === 'lote'}
              value={filters.quartos ?? ''}
              onChange={(event) => setFilters({ ...filters, quartos: event.target.value ? Number(event.target.value) : undefined })}
            >
              <option value="">{filters.tipo === 'lote' ? 'Não se aplica' : 'Todos'}</option>
              <option value="1">1 ou mais</option>
              <option value="2">2 ou mais</option>
              <option value="3">3 ou mais</option>
              <option value="4">4 ou mais</option>
            </select>
          </span><Icon name="chevron" size={16} />
        </label>
        <button className="button button-primary search-button" type="submit" aria-label="Buscar imóveis">
          <Icon name="search" size={19} />
          <span>Buscar<span className="search-button-context"> imóveis</span></span>
        </button>
      </form>

      {!carregando && !erro && (
        <FeaturedProducts
          key={featuredProducts.map((product) => product.id).join(',')}
          products={featuredProducts}
        />
      )}

      <section className="results-section" aria-labelledby="results-heading" aria-busy={carregando}>
        <div className="results-toolbar">
          <div className="results-summary">
            <h2 id="results-heading">{titulo}</h2>
            <span className="results-count" role="status" aria-atomic="true">
              {resumo}
            </span>
          </div>
          {hasFilters ? (
            <button className="text-button" onClick={clearFilters} type="button">
              <Icon name="close" size={15} /> Limpar filtros
            </button>
          ) : (
            <span className="results-note">Seu novo começo, a uma visita de distância.</span>
          )}
        </div>
        {carregando && <div className="empty-state" role="status"><p>Carregando imóveis…</p></div>}
        {!carregando && erro && (
          <div className="empty-state">
            <h3>Não foi possível carregar os imóveis.</h3>
            <p role="alert">{erro}</p>
            <button type="button" className="button button-primary" onClick={recarregar}>Tentar novamente</button>
          </div>
        )}
        {!carregando && !erro && (products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Icon name="search" size={30} /></span>
            <h3>Nenhum imóvel por aqui.</h3>
            <p>{hasFilters ? 'Tente outra localização ou ajuste os filtros para encontrar seu próximo lar.' : 'Os imóveis aparecerão aqui quando forem publicados.'}</p>
            {hasFilters && <button type="button" className="button button-primary" onClick={clearFilters}>Limpar filtros</button>}
          </div>
        ))}
        <div className="listing-end">
          <span /><Icon name="home" size={17} /><p>Cada casa, uma nova possibilidade.</p><span />
        </div>
      </section>
    </main>
  )
}
