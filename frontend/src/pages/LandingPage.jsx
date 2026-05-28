import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'

const psychologyMessages = [
  'Toda historia merece um espaco seguro para ser ouvida.',
  'Cuidar da mente tambem e um jeito de cuidar da vida.',
  'Nem todo mundo precisa de respostas rapidas; as vezes precisa de acolhimento.',
  'Autoconhecimento comeca quando a gente consegue nomear o que sente.',
  'Falar sobre emocao nao e fraqueza; e maturidade emocional.',
  'Uma conversa certa pode abrir caminhos que a pressa nao enxerga.',
]

export function LandingPage() {
  const { authMode, login, register, setAuthMode } = useAppContext()
  const navigate = useNavigate()
  const [headline] = useState(
    () => psychologyMessages[Math.floor(Math.random() * psychologyMessages.length)],
  )
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (authMode === 'login') {
        await login({ username: form.username, password: form.password })
      } else {
        const [firstName, ...lastName] = form.name.trim().split(/\s+/)
        await register({
          username: form.username,
          email: form.email,
          first_name: firstName || form.username,
          last_name: lastName.join(' '),
          password: form.password,
          password2: form.password2,
        })
      }

      navigate('/home')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="landing-shell">
      <section className="landing-hero">
        <h1 className="landing-hero-title">{headline}</h1>
        <p className="landing-copy">
          Uma rede social com proposta mais humana, voltada a conversas,
          acolhimento e reflexao.
        </p>
        <div className="landing-notes">
          <article>
            <strong>Feed com intencao</strong>
            <span>Voce acompanha pessoas, ideias e conversas com mais sentido</span>
          </article>
          <article>
            <strong>Psicologia em foco</strong>
            <span>Um espaco para troca, escuta e bem-estar emocional</span>
          </article>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-heading">
          <p className="eyebrow">Bem-vindo</p>
          <h2>Comece pelo acesso</h2>
        </div>
        <div className="auth-toggle">
          <button
            type="button"
            className={authMode === 'login' ? 'selected' : ''}
            onClick={() => setAuthMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={authMode === 'signup' ? 'selected' : ''}
            onClick={() => setAuthMode('signup')}
          >
            Cadastro
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {authMode === 'signup' ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
          ) : null}
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Usuario"
            required
          />
          {authMode === 'signup' ? (
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          ) : null}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Senha"
            required
          />
          {authMode === 'signup' ? (
            <input
              type="password"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              placeholder="Confirmar senha"
              required
            />
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-button full-width" disabled={submitting}>
            {submitting
              ? 'Aguarde...'
              : authMode === 'login'
                ? 'Entrar no feed'
                : 'Criar conta'}
          </button>
        </form>
      </section>
    </div>
  )
}
