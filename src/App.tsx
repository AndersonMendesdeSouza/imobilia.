import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Header } from './components/Header/Header'
import { TabBar } from './components/TabBar/TabBar'
import { AppRoutes } from './routes/AppRoutes'
import { useAuth } from './hooks/useAuth'
import './App.css'

function App() {
  const { usuario: currentUser, logout } = useAuth()
  const localizacao = useLocation()
  const navigate = useNavigate()
  const loginState: unknown = localizacao.state
  let loginDestination = '/perfil'

  if (loginState && typeof loginState === 'object' && 'from' in loginState && loginState.from === '/perfil/publicar') {
    loginDestination = '/perfil/publicar'
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [localizacao.pathname, localizacao.search])

  function handleLogout() {
    logout()
    navigate('/mais/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>Pular para o conteúdo</a>
      <Header />
      <AppRoutes
        user={currentUser}
        onLogout={handleLogout}
        loginDestination={loginDestination}
      />
      <footer className="site-footer container">
        <Link className="footer-brand" to="/imoveis">imobilia<span>.</span></Link>
        <p>Novos espaços. Novas histórias.</p>
        <small>Compra e aluguel de imóveis.</small>
      </footer>
      <TabBar user={currentUser} />
    </div>
  )
}

export default App
