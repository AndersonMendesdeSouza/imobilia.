import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function RequireAuth() {
  const localizacao = useLocation()
  const { usuario, carregando, erroSessao, recarregarSessao } = useAuth()

  if (carregando) {
    return <main id="main-content" className="container not-found" tabIndex={-1} aria-busy="true"><p role="status">Restaurando sessão…</p></main>
  }

  if (erroSessao) {
    return (
      <main id="main-content" className="container not-found" tabIndex={-1}>
        <h1>Não foi possível acessar sua conta.</h1>
        <p role="alert">{erroSessao}</p>
        <button className="button button-primary" type="button" onClick={recarregarSessao}>Tentar novamente</button>
      </main>
    )
  }

  if (!usuario) {
    return <Navigate to="/mais/login" replace state={{ from: localizacao.pathname }} />
  }

  return <Outlet />
}
