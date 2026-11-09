import type { LoginRequestDTO } from '../dtos/request/login-request.dto'
import type { LoginResponseDTO } from '../dtos/response/login-response.dto'
import api from './axios'
import type { UserRequestDTO } from '../dtos/request/user-request.dto'
import type { UserResponseDTO } from '../dtos/response/user-response.dto'

export const UserService = {
  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const response = await api.post<LoginResponseDTO>('/user/login', dto)
    return response.data
  },

  async create(dto: UserRequestDTO): Promise<UserResponseDTO> {
    const response = await api.post<UserResponseDTO>('/user', dto)
    return response.data
  },

  async findAll(): Promise<UserResponseDTO[]> {
    const response = await api.get<UserResponseDTO[]>('/user')
    return response.data
  },

  async findOne(id: string): Promise<UserResponseDTO> {
    const response = await api.get<UserResponseDTO>(`/user/${id}`)
    return response.data
  },

  async updateImg(id: string, file: File): Promise<UserResponseDTO> {
    const response = await api.putForm<UserResponseDTO>(`/user/${id}/img`, { file })
    return response.data
  },
}
