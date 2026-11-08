import { useEffect, useState } from 'react'
import { Header } from './components/Header/Header'
import { Products } from './pages/Products/Products'
import { ProductDetails } from './pages/ProductDetails/ProductDetails'
import './App.css'

function App() {
  const [hash, setHash] = useState(window.location.hash)
  const [path, query = ''] = hash.slice(1).split('?')
  const transaction = new URLSearchParams(query).get('finalidade') === 'venda' ? 'sale' : 'rent'
  const productId = path?.startsWith('/imoveis/') ? path.slice('/imoveis/'.length) : null

  useEffect(() => {
    function handleNavigation() {
      setHash(window.location.hash)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', handleNavigation)
    return () => window.removeEventListener('hashchange', handleNavigation)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>Pular para o conteúdo</a>
      <Header transaction={transaction} isDetails={productId !== null} />
      {productId !== null
        ? <ProductDetails key={productId} productId={productId} />
        : <Products key={transaction} transaction={transaction} />}
      <footer className="site-footer container">
        <a className="footer-brand" href="#/imoveis">imobilia<span>.</span></a>
        <p>Novos espaços. Novas histórias.</p>
        <small>Imóveis e valores ilustrativos.</small>
      </footer>
    </>
  )
}

export default App
