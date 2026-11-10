import api from './axios'
import type { ImovelRequestDTO } from '../dtos/request/imovel-request.dto'
import type { ImovelResponseDTO } from '../dtos/response/imovel-response.dto'

export const ImoveisService = {
  async create(dto: ImovelRequestDTO, files: File[]): Promise<ImovelResponseDTO> {
    const response = await api.postForm<ImovelResponseDTO>(
      '/imovel',
      { dto: JSON.stringify(dto), files },
      { formSerializer: { indexes: null } },
    )
    return response.data
  },

  async findAll(): Promise<ImovelResponseDTO[]> {
    const response = await api.get<ImovelResponseDTO[]>('/imovel')
    return response.data
  },

  async findOne(id: string): Promise<ImovelResponseDTO> {
    const response = await api.get<ImovelResponseDTO>(`/imovel/${id}`)
    return response.data
  },

  async update(id: string, dto: Partial<ImovelRequestDTO>): Promise<ImovelResponseDTO> {
    const response = await api.patch<ImovelResponseDTO>(`/imovel/${id}`, dto)
    return response.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/imovel/${id}`)
  },
}
