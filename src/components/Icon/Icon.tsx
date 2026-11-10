export type IconName = 'home' | 'search' | 'pin' | 'bed' | 'bath' | 'area' | 'arrow' | 'back' | 'chevron' | 'car' | 'check' | 'close' | 'images' | 'mail' | 'phone' | 'expand' | 'building' | 'menu' | 'share' | 'user' | 'lock' | 'plus' | 'logout' | 'edit' | 'trash'

const paths: Record<IconName, string> = {
  home: 'm3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8',
  search: 'M21 21l-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
  pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  bed: 'M3 18v3M21 18v3M3 18h18v-7H3v7ZM5 11V5h14v6M12 5v6',
  bath: 'M3 12h18M5 12V5a2 2 0 0 1 4 0M4 12v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4M7 20v2M17 20v2M7 7h4',
  area: 'M9 3H3v6M15 21h6v-6M3 3l6 6M21 21l-6-6M15 3h6v6M21 3l-6 6M3 15v6h6M3 21l6-6',
  arrow: 'M4 12h16M14 6l6 6-6 6',
  back: 'M20 12H4M10 6l-6 6 6 6',
  chevron: 'm6 9 6 6 6-6',
  car: 'M4 17v3M20 17v3M3 17h18v-7l-3-6H6l-3 6v7ZM3 10h18M7 14h1M16 14h1',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M6 18 18 6',
  images: 'M8 3h13v13M3 8h13v13H3V8ZM3 17l4-4 3 3 2-2 4 4M8 11h.01',
  mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  phone: 'M8 3H4c-1 0-1 3 0 6 2 6 5 9 11 11 3 1 6 1 6 0v-4l-5-2-2 2c-4-2-5-3-7-7l2-2-2-4Z',
  expand: 'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5',
  building: 'M3 21h18M5 21V3h10v18M15 9h4v12M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1M9 21v-3h2v3',
  menu: 'M4 6h16M4 12h16M4 18h16',
  share: 'M12 15V3M7 8l5-5 5 5M5 13v8h14v-8',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2',
  lock: 'M5 10h14v11H5V10ZM8 10V7a4 4 0 0 1 8 0v3M12 15v2',
  plus: 'M12 4v16M4 12h16',
  logout: 'M9 4H4v16h5M9 12h12M16 7l5 5-5 5',
  edit: 'm16 3 5 5M4 15 16 3l5 5L9 20l-6 1 1-6Z',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
