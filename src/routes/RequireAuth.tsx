import { Navigate, Outlet, useLocation } from 'react-router'

export function RequireAuth({ isLoggedIn }: { isLoggedIn: boolean }) {
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/mais/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
