import { useEffect, useState } from 'react'
import type { ImovelResponseDTO } from '../dtos/response/imovel-response.dto'
import { ImoveisService } from '../services/imoveis.service'

export function useImoveis() {
  const [imoveis, setImoveis] = useState<ImovelResponseDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    ImoveisService.findAll()
      .then((imoveis) => {
        if (ativo) setImoveis(imoveis)
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar os imóveis. Tente novamente.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [tentativa])

  function recarregar() {
    setCarregando(true)
    setErro('')
    setTentativa((atual) => atual + 1)
  }

  return { imoveis, carregando, erro, recarregar }
}
