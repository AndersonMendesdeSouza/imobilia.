import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserResponseDTO } from '../../dtos/response/user-response.dto'
import { demoAccounts } from '../../data/demo-accounts'
import { authService } from '../../services/auth.service'
import { Icon } from '../../components/Icon/Icon'
import { Avatar } from '../../components/Avatar/Avatar'
import '../Account.css'

export function Login({ onLogin }: { onLogin: (user: UserResponseDTO) => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Acesso exclusivo para anunciantes | Imobilia'
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    try {
      const { usuario } = authService.login({ email, senha })
      onLogin(usuario)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.')
    }
  }

  return (
    <main id="main-content" className="account-page login-page container" tabIndex={-1}>
      <Link className="account-back" to="/mais"><Icon name="back" size={17} /> Voltar</Link>
      <section className="login-card" aria-labelledby="login-title">
        <span className="account-avatar"><Icon name="lock" size={29} /></span>
        <span className="eyebrow">ACESSO EXCLUSIVO</span>
        <h1 id="login-title">Área do anunciante</h1>
        <p className="account-intro">Entre com os dados fornecidos pela nossa equipe para gerenciar seus anúncios.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="account-field">
            <span>Email</span>
            <input type="email" name="email" required autoComplete="username" placeholder="seu@email.com" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} />
          </label>
          <label className="account-field">
            <span>Senha</span>
            <input type="password" name="senha" required autoComplete="current-password" placeholder="Digite sua senha" value={senha} onChange={(event) => { setSenha(event.target.value); setError('') }} />
          </label>
          {error && <p className="account-alert" role="alert">{error}</p>}
          <button className="button button-primary account-submit" type="submit">Entrar <Icon name="arrow" size={19} /></button>
        </form>
        <section className="login-support" aria-labelledby="login-support-title">
          <h2 id="login-support-title">Quer anunciar seus imóveis?</h2>
          <p>Entre em contato com o suporte para conhecer os planos e solicitar a criação da sua conta.</p>
          <small>O acesso é pago. As contas são criadas exclusivamente pela administração.</small>
        </section>
        {import.meta.env.DEV && <details className="demo-accounts">
          <summary>Contas de teste — desenvolvimento</summary>
          <p>Escolha uma conta de teste para preencher o formulário.</p>
          <div className="demo-account-options">
            {demoAccounts.map((account) => (
              <button key={account.usuarioId} type="button" onClick={() => { setEmail(account.email); setSenha(account.senha); setError('') }}>
                <Avatar className="demo-account-avatar" foto={account.foto} icon="building" />
                <span><strong>{account.nome}</strong><small>{account.email}</small></span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
          <p>Senha das contas de teste: <strong>Imobilia123!</strong></p>
        </details>}
      </section>
    </main>
  )
}
