import type { PerfilUsuario } from '../dtos/enums'

interface DemoAccount {
  usuarioId: string
  nome: string
  email: string
  senha: string
  foto: string | null
  perfil: PerfilUsuario
  ativo: boolean
}

// Contas públicas de teste. A autenticação real será feita pelo backend.
export const demoAccounts: DemoAccount[] = [
  {
    usuarioId: 'equipe-imobilia',
    perfil: 'administrador',
    ativo: true,
    nome: 'Equipe Imobilia',
    email: 'equipe@imobilia.example',
    senha: 'Imobilia123!',
    foto: "https://www.imobiliarianova.net.br/imagens/site_modelo/202203161603311767.png",
  },
  {
    usuarioId: 'aurora-imoveis',
    perfil: 'anunciante',
    ativo: true,
    nome: 'Aurora Imóveis',
    email: 'aurora@imobilia.example',
    senha: 'Imobilia123!',
    foto: 'https://fiducialimobiliaria.com.br/uploads/posts/saiba-escolher-a-melhor-imobiliaria.png',
  },
  {
    usuarioId: 'marina-costa',
    perfil: 'anunciante',
    ativo: true,
    nome: 'Marina Costa',
    email: 'marina@imobilia.example',
    senha: 'Imobilia123!',
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJEhNZZDZvrNhBJNndhgU3DnluD-p6KhzfZzA2QGlNPtKWxCkXxAIgnLJO&s=10",
  },
]
