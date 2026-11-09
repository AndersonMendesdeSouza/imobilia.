import axios from 'axios'
import { authService } from './auth.service'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const token = authService.getToken()
  if (token && authService.getSession(token)) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

export default api
