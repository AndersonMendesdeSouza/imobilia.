import { Navigate, Outlet, useLocation } from 'react-router'

export function RequireAuth({ isLoggedIn }: { isLoggedIn: boolean }) {
  const localizacao = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/mais/login" replace state={{ from: localizacao.pathname }} />
  }

  return <Outlet />
}
