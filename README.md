# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Integração com a API de imóveis

A Home, os detalhes e o formulário de publicação usam `ImoveisService`. O service contém `findAll()` (`GET /imovel`) e `create(dto, files)` (`POST /imovel` multipart com o JSON no campo `dto` e os arquivos em `files`). A primeira imagem enviada é a principal.

Em desenvolvimento, mantenha a API em `http://localhost:3000` e execute `npm run dev` no front. O Vite encaminha `/api/imovel` para `/imovel` na API. Reinicie o Vite depois de alterar essa configuração.

Para outro servidor, configure `VITE_API_URL` com a URL base da API e libere a origem do front no CORS do backend. Sem essa variável, uma publicação do front precisa encaminhar `/api` para a API no servidor de hospedagem.

A Home (`/imoveis`) mostra todos os imóveis recebidos por `findAll()`. Os links Comprar e Alugar aplicam o filtro de finalidade. Os demais filtros são aplicados à lista recebida, e o banner usa apenas imóveis com `destaque: true`. A listagem de anunciantes e os perfis públicos usam a API de usuários. A listagem exibe apenas `perfil: anunciante` e usa `usuario.imoveis` para a contagem e os anúncios. O login usa a API e a área da conta mostra os imóveis do usuário autenticado.

O `UserService` do front usa `POST /user` com JSON, `GET /user`, `GET /user/:id` e `PUT /user/:id/img` com o campo de arquivo `file`. As consultas de usuário retornam `imoveis` com suas `imagens`, sem repetir o usuário em cada imóvel.

## Sessão de login

`UserService.login()` envia `{ usuario, senha }` como JSON para `POST /user/login`; `usuario` é o e-mail cadastrado. `AuthProvider`, instalado em `main.tsx`, compartilha a sessão por `useAuth()` e guarda apenas o JWT em `localStorage`, na chave `imobilia.token`. Senhas e objetos de usuário não são persistidos.

O provider lê `sub`/`exp`, carrega o usuário com `GET /user/:id`, confere a conta ativa e restaura a sessão ao abrir o site. Token vencido, logout ou resposta 401 encerram a sessão. Falha temporária ao restaurar mantém o token e permite tentar novamente. Alterações na sessão em outra aba também são sincronizadas. As rotas do perfil aguardam a restauração antes de redirecionar para o login.

O Axios envia `Authorization: Bearer TOKEN`. A leitura do JWT no navegador controla a interface e a expiração; ela não verifica a assinatura nem substitui autorização na API. A API usa `JwtAuthGuard` na criação, edição e exclusão de imóveis e vincula o proprietário pelo `request.user.id`. O ID fixo foi removido. As consultas são públicas; os outros endpoints de usuário mantêm o comportamento atual.

Execute `npm test` para verificar o armazenamento, a leitura da sessão e os contratos HTTP dos services, sem acessar a API real.

No perfil da conta logada, o botão **Atualizar foto** seleciona uma imagem JPG, PNG ou WebP de até 1 MB e chama `PUT /user/:id/img` com o campo `file`. O usuário retornado atualiza o `AuthProvider`, refletindo a foto no perfil e na Tab Bar. O botão mostra o progresso do envio e informa sucesso ou erro.
