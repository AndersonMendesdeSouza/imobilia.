import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Header } from './components/Header/Header'
import { TabBar } from './components/TabBar/TabBar'
import { AppRoutes } from './routes/AppRoutes'
import { authService } from './services/auth.service'
import type { AdvertiserDTO } from './dtos/advertiser.dto'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser())
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const transaction = searchParams.get('finalidade') === 'venda' ? 'sale' : 'rent'
  const loginState: unknown = location.state
  let loginDestination = '/perfil'

  if (loginState && typeof loginState === 'object' && 'from' in loginState && loginState.from === '/perfil/publicar') {
    loginDestination = '/perfil/publicar'
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.search])

  function handleLogin(user: AdvertiserDTO) {
    setCurrentUser(user)
    navigate(loginDestination, { replace: true })
  }

  function handleLogout() {
    authService.logout()
    setCurrentUser(null)
    navigate('/mais/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>Pular para o conteúdo</a>
      <Header transaction={transaction} isListing={location.pathname === '/imoveis'} />
      <AppRoutes
        user={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        loginDestination={loginDestination}
      />
      <footer className="site-footer container">
        <Link className="footer-brand" to="/imoveis">imobilia<span>.</span></Link>
        <p>Novos espaços. Novas histórias.</p>
        <small>Imóveis e valores ilustrativos.</small>
      </footer>
      <TabBar isLoggedIn={currentUser !== null} />
    </div>
  )
}

export default App
