import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { Icon } from '../../components/Icon/Icon'
import '../Account.css'

export function Login() {
  const { login, carregando, erroSessao, recarregarSessao } = useAuth()
  const [entrando, setEntrando] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Acesso exclusivo para anunciantes | Imobilia'
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (entrando) return
    setError('')
    setEntrando(true)

    try {
      await login({ usuario: email.trim().toLowerCase(), senha })
    } catch (error) {
      if (isAxiosError<{ message?: string | string[] }>(error)) {
        const mensagem = error.response?.data?.message
        setError(Array.isArray(mensagem) ? mensagem.join(' ') : mensagem || 'Não foi possível entrar. Tente novamente.')
      } else {
        setError(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.')
      }
    } finally {
      setEntrando(false)
    }
  }

  if (carregando) {
    return <main id="main-content" className="container not-found" tabIndex={-1} aria-busy="true"><p role="status">Restaurando sessão…</p></main>
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
            <input type="email" name="email" required maxLength={254} autoComplete="username" placeholder="seu@email.com" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} />
          </label>
          <label className="account-field">
            <span>Senha</span>
            <input type="password" name="senha" required maxLength={128} autoComplete="current-password" placeholder="Digite sua senha" value={senha} onChange={(event) => { setSenha(event.target.value); setError('') }} />
          </label>
          {(error || erroSessao) && <p className="account-alert" role="alert">{error || erroSessao}</p>}
          {erroSessao && <button type="button" className="text-button" onClick={recarregarSessao}>Tentar restaurar sessão</button>}
          <button className="button button-primary account-submit" type="submit" disabled={entrando} aria-busy={entrando}>{entrando ? 'Entrando…' : 'Entrar'} <Icon name="arrow" size={19} /></button>
        </form>
        <section className="login-support" aria-labelledby="login-support-title">
          <h2 id="login-support-title">Quer anunciar seus imóveis?</h2>
          <p>Entre em contato com o suporte para conhecer os planos e solicitar a criação da sua conta.</p>
          <small>O acesso é pago. As contas são criadas exclusivamente pela administração.</small>
        </section>
      </section>
    </main>
  )
}
