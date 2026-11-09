import api from "./axios";

export const ImoveisService = {
  create: async (dto: any) => {
    const response = await api.post("/imoveis", dto);
    return response.data;
  }, 

  update: async (companyId: string, dto: Partial<any>) => {
    const response = await api.patch<any>(
      `/company/${companyId}`,
      dto,
    );
    return response.data;
  },

  findOne: async (id: string): Promise<any> => {
    const response = await api.get<any>(`/imoveis/${id}`);
    return response.data;
  },

  findAll: async (): Promise<any[]> => {
    const response = await api.get<any[]>(`/imoveis`);
    return response.data;
  },
};
