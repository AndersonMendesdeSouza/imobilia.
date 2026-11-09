import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Avatar.css'

interface AvatarProps {
  foto: string | null
  className: string
  icon?: 'user' | 'building' | 'home'
}

export function Avatar({ foto, className, icon = 'user' }: AvatarProps) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null)

  return (
    <span className={`avatar ${className}`} aria-hidden="true">
      {foto && foto !== failedPhoto ? (
        <img src={foto} alt="" loading="lazy" decoding="async" onError={() => setFailedPhoto(foto)} />
      ) : (
        <Icon name={icon} size={24} />
      )}
    </span>
  )
}
