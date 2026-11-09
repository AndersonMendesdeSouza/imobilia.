import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { isAxiosError } from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import type { LoginRequestDTO } from '../dtos/request/login-request.dto'
import type { UserResponseDTO } from '../dtos/response/user-response.dto'
import { authService, TOKEN_KEY } from '../services/auth.service'
import { UserService } from '../services/user.service'
import api from '../services/axios'

async function buscarUsuario(token: string): Promise<UserResponseDTO> {
  const sessao = authService.getSession(token)
  if (!sessao) throw new Error('Sua sessão expirou. Entre novamente.')
  const usuario = await UserService.findOne(sessao.usuarioId)
  if (!usuario.ativo) throw new Error('Sua conta está desativada.')
  if (!authService.getSession(token)) throw new Error('Sua sessão expirou. Entre novamente.')
  return usuario
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UserResponseDTO | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroSessao, setErroSessao] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const revisaoUsuario = useRef(0)

  const logout = useCallback(() => {
    authService.logout()
    setUsuario(null)
    setToken(null)
    setErroSessao('')
    setCarregando(false)
  }, [])

  useEffect(() => {
    let ativo = true
    const tokenSalvo = authService.getToken()

    async function restaurar() {
      if (!tokenSalvo || !authService.getSession(tokenSalvo)) {
        if (tokenSalvo) authService.logout()
        return null
      }
      return buscarUsuario(tokenSalvo)
    }

    restaurar()
      .then((usuario) => {
        if (!ativo || authService.getToken() !== tokenSalvo) return
        setUsuario(usuario)
        setToken(usuario ? tokenSalvo : null)
      })
      .catch((error: unknown) => {
        if (!ativo || authService.getToken() !== tokenSalvo) return
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (!isAxiosError(error) || status === 401 || status === 403 || status === 404) {
          logout()
        } else {
          setErroSessao('Não foi possível restaurar a sessão. Tente novamente.')
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [tentativa, logout])

  useEffect(() => {
    if (!token) return
    const sessao = authService.getSession(token)
    const tempoRestante = (sessao?.expiraEm ?? Date.now()) - Date.now()
    const timer = window.setTimeout(logout, Math.max(0, Math.min(tempoRestante, 2147483647)))
    return () => window.clearTimeout(timer)
  }, [token, logout])

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (isAxiosError(error) && error.response?.status === 401 && error.config?.url !== '/user/login') {
          const atual = authService.getToken()
          if (atual && error.config?.headers.Authorization === `Bearer ${atual}`) logout()
        }
        return Promise.reject(error)
      },
    )
    return () => api.interceptors.response.eject(interceptor)
  }, [logout])

  useEffect(() => {
    function sincronizar(event: StorageEvent) {
      if (event.key !== TOKEN_KEY && event.key !== null) return
      setUsuario(null)
      setToken(null)
      setErroSessao('')
      setCarregando(true)
      setTentativa((atual) => atual + 1)
    }
    window.addEventListener('storage', sincronizar)
    return () => window.removeEventListener('storage', sincronizar)
  }, [])

  async function login(dto: LoginRequestDTO) {
    const { token } = await UserService.login(dto)
    if (!authService.getSession(token)) throw new Error('A API retornou uma sessão inválida.')
    authService.saveToken(token)

    try {
      const usuario = await buscarUsuario(token)
      if (authService.getToken() !== token) throw new Error('Login cancelado. Tente novamente.')
      setToken(token)
      setUsuario(usuario)
      setErroSessao('')
      setCarregando(false)
    } catch (error) {
      if (authService.getToken() === token) authService.logout()
      throw error
    }
  }

  const atualizarUsuario = useCallback(async () => {
    const revisao = revisaoUsuario.current
    const token = authService.getToken()
    if (!token) {
      logout()
      return
    }
    try {
      const usuario = await buscarUsuario(token)
      // Não sobrescreve uma foto nova com uma consulta iniciada antes do upload.
      if (authService.getToken() === token && revisaoUsuario.current === revisao) setUsuario(usuario)
    } catch (error) {
      if (authService.getToken() !== token || revisaoUsuario.current !== revisao) return
      const status = isAxiosError(error) ? error.response?.status : undefined
      if (authService.getToken() === token && (!isAxiosError(error) || status === 401 || status === 403 || status === 404)) logout()
      throw error
    }
  }, [logout])

  const atualizarFoto = useCallback(async (file: File) => {
    const token = authService.getToken()
    const sessao = authService.getSession(token)
    if (!sessao) {
      logout()
      throw new Error('Sua sessão expirou. Entre novamente.')
    }

    const usuario = await UserService.updateImg(sessao.usuarioId, file)
    if (authService.getToken() !== token || !authService.getSession(token)) {
      throw new Error('Sua sessão terminou. Entre novamente.')
    }
    if (!usuario.ativo) {
      logout()
      throw new Error('Sua conta está desativada.')
    }

    revisaoUsuario.current += 1
    setUsuario(usuario)
  }, [logout])

  function recarregarSessao() {
    setCarregando(true)
    setErroSessao('')
    setTentativa((atual) => atual + 1)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, erroSessao, login, logout, recarregarSessao, atualizarUsuario, atualizarFoto }}>
      {children}
    </AuthContext.Provider>
  )
}
