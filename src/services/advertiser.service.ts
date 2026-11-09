import { advertisers } from '../data/advertisers'

export const advertiserService = {
  list() {
    return advertisers
  },

  getById(id: string) {
    return advertisers.find((usuario) => usuario.id === id)
  },
}
