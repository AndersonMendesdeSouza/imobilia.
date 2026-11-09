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
}
