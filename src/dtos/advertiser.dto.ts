export interface AdvertiserDTO {
  id: string
  name: string
  kind: 'agency' | 'broker'
  city: string
  state: string
  description: string
  phone: string | null
  email: string | null
}
