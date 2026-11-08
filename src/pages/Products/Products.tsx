import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { ProductFiltersDTO, PropertyType, TransactionType } from '../../dtos/product.dto'
import { productService } from '../../services/product.service'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import { FeaturedProducts } from '../../components/FeaturedProducts/FeaturedProducts'
import { Icon } from '../../components/Icon/Icon'

export function Products({ transaction }: { transaction: TransactionType }) {
  const initialFilters: ProductFiltersDTO = {
    transaction,
    location: '',
    type: '',
    maxPrice: null,
    bedrooms: null,
  }
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const products = productService.list(appliedFilters)
  const featuredProducts = productService.list({ ...initialFilters, type: 'house' }).slice(0, 3)
  const hasFilters = Boolean(appliedFilters.location || appliedFilters.type || appliedFilters.maxPrice || appliedFilters.bedrooms)
  const priceOptions = transaction === 'rent' ? [2000, 3000, 4000, 5000, 6000] : [500000, 750000, 1000000]

  useEffect(() => {
    document.title = `${transaction === 'rent' ? 'Imóveis para alugar' : 'Imóveis para comprar'} | Imobilia`
  }, [transaction])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedFilters({ ...filters, location: filters.location.trim() })
  }

  function clearFilters() {
    setFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }

  return (
    <main id="main-content" className="listing-page container" tabIndex={-1}>
      <section className="listing-intro" aria-labelledby="listing-title">
        <div>
          <span className="eyebrow"><span /> NOVOS COMEÇOS MORAM AQUI</span>
          <h1 id="listing-title">Um lugar para chamar de <span>seu.</span></h1>
          <p>Encontre o imóvel que combina com a sua próxima história.</p>
        </div>
        <div className="intro-caption">
          <Icon name="home" size={19} />
          <span>Mais do que um endereço.<br /><strong>O seu próximo lar.</strong></span>
        </div>
      </section>

      <FeaturedProducts products={featuredProducts} />

      <form className="search-filters" onSubmit={handleSearch} role="search" aria-label="Buscar imóveis">
        <label className="filter-field location-field">
          <Icon name="pin" />
          <span className="field-content">
            <span className="field-label">Localização</span>
            <input
              type="search"
              name="location"
              placeholder="Cidade ou bairro"
              value={filters.location}
              onChange={(event) => setFilters({ ...filters, location: event.target.value })}
            />
          </span>
        </label>
        <label className="filter-field">
          <Icon name="home" />
          <span className="field-content">
            <span className="field-label">Tipo de imóvel</span>
            <select
              name="type"
              value={filters.type}
              onChange={(event) => {
                const type = event.target.value as PropertyType | ''
                setFilters({ ...filters, type, bedrooms: type === 'land' ? null : filters.bedrooms })
              }}
            >
              <option value="">Todos os tipos</option>
              <option value="house">Casa</option>
              <option value="apartment">Apartamento</option>
              <option value="land">Lote</option>
            </select>
          </span><Icon name="chevron" size={16} />
        </label>
        <label className="filter-field">
          <span className="currency-icon" aria-hidden="true">R$</span>
          <span className="field-content">
            <span className="field-label">Valor máximo</span>
            <select
              name="maxPrice"
              value={filters.maxPrice ?? ''}
              onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value ? Number(event.target.value) : null })}
            >
              <option value="">Sem limite</option>
              {priceOptions.map((price) => (
                <option key={price} value={price}>
                  Até {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
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
              name="bedrooms"
              disabled={filters.type === 'land'}
              value={filters.bedrooms ?? ''}
              onChange={(event) => setFilters({ ...filters, bedrooms: event.target.value ? Number(event.target.value) : null })}
            >
              <option value="">{filters.type === 'land' ? 'Não se aplica' : 'Todos'}</option>
              <option value="1">1 ou mais</option>
              <option value="2">2 ou mais</option>
              <option value="3">3 ou mais</option>
              <option value="4">4 ou mais</option>
            </select>
          </span><Icon name="chevron" size={16} />
        </label>
        <button className="button button-primary search-button" type="submit">
          <Icon name="search" size={19} /> Buscar imóveis
        </button>
      </form>

      <section className="results-section" aria-labelledby="results-heading">
        <div className="results-toolbar">
          <div className="results-summary">
            <h2 id="results-heading">Imóveis para {transaction === 'rent' ? 'alugar' : 'comprar'}</h2>
            <span className="results-count" role="status" aria-atomic="true">
              {products.length} {products.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
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
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Icon name="search" size={30} /></span>
            <h3>Nenhum imóvel por aqui.</h3>
            <p>Tente outra localização ou ajuste os filtros para encontrar seu próximo lar.</p>
            <button type="button" className="button button-primary" onClick={clearFilters}>Limpar filtros</button>
          </div>
        )}
        <div className="listing-end">
          <span /><Icon name="home" size={17} /><p>Cada casa, uma nova possibilidade.</p><span />
        </div>
      </section>
    </main>
  )
}
