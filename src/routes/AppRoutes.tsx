import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router'
import type { UserResponseDTO } from '../dtos/response/user-response.dto'
import { Products } from '../pages/Products/Products'
import { ProductDetails } from '../pages/ProductDetails/ProductDetails'
import { Advertisers } from '../pages/Advertisers/Advertisers'
import { AdvertiserProfile } from '../pages/AdvertiserProfile/AdvertiserProfile'
import { More } from '../pages/More/More'
import { Login } from '../pages/Login/Login'
import { Profile } from '../pages/Profile/Profile'
import { PublishProduct } from '../pages/PublishProduct/PublishProduct'
import { RequireAuth } from './RequireAuth'

interface AppRoutesProps {
  user: UserResponseDTO | null
  onLogout: () => void
  loginDestination: string
}

export function AppRoutes({ user, onLogout, loginDestination }: AppRoutesProps) {
  const localizacao = useLocation()
  const [searchParams] = useSearchParams()
  const finalidadeParam = searchParams.get('finalidade')
  const finalidade = finalidadeParam === 'venda' || finalidadeParam === 'aluguel' ? finalidadeParam : undefined

  return (
    <Routes>
      <Route index element={<Navigate to="/imoveis" replace />} />
      <Route path="imoveis">
        <Route index element={<Products key={finalidade ?? 'todos'} finalidade={finalidade} />} />
        <Route path=":productId" element={<ProductDetails key={localizacao.pathname} />} />
      </Route>
      <Route path="anunciantes">
        <Route index element={<Advertisers />} />
        <Route path=":usuarioId" element={<AdvertiserProfile key={localizacao.pathname} />} />
      </Route>
      <Route path="mais">
        <Route index element={user ? <Navigate to="/perfil/sobre" replace /> : <More isLoggedIn={false} />} />
        <Route path="login" element={user ? <Navigate to={loginDestination} replace /> : <Login />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="perfil">
          <Route
            index
            element={user ? (
              <Profile
                user={user}
                onLogout={onLogout}
                publishedProductId={searchParams.get('publicado')}
              />
            ) : null}
          />
          <Route path="publicar" element={<PublishProduct />} />
          <Route path="sobre" element={<More isLoggedIn />} />
        </Route>
      </Route>
      <Route path="login" element={<Navigate to="/mais/login" replace state={localizacao.state} />} />
      <Route path="publicar" element={<Navigate to="/perfil/publicar" replace />} />
      <Route path="*" element={<Navigate to="/imoveis" replace />} />
    </Routes>
  )
}
