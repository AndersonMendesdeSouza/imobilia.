import { NavLink } from 'react-router'
import { Icon } from '../Icon/Icon'
import type { IconName } from '../Icon/Icon'
import type { UserResponseDTO } from '../../dtos/response/user-response.dto'
import { Avatar } from '../Avatar/Avatar'
import './TabBar.css'

interface TabBarItem {
  label: string
  to: string
  icon: IconName
}

export function TabBar({ user }: { user: UserResponseDTO | null }) {
  const accountItem: TabBarItem = user
    ? { label: 'Perfil', to: '/perfil', icon: 'user' }
    : { label: 'Mais', to: '/mais', icon: 'menu' }
  const items: TabBarItem[] = [
    { label: 'Início', to: '/imoveis', icon: 'home' },
    { label: 'Anunciantes', to: '/anunciantes', icon: 'building' },
    accountItem,
  ]

  return (
    <nav className="tab-bar" aria-label="Navegação principal">
      {items.map((item) => (
        <NavLink key={item.to} className="tab-bar-item" to={item.to}>
          {item.to === '/perfil' && user?.img?.url ? (
            <Avatar className="tab-bar-avatar" foto={user.img.url} />
          ) : (
            <Icon name={item.icon} size={22} />
          )}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
