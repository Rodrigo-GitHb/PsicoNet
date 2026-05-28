import { useState } from 'react'
import { useAppContext } from '../hooks/useAppContext'

export function SettingsPage() {
  const { currentUser, updateProfile } = useAppContext()
  const [form, setForm] = useState({
    name: '',
    avatar: null,
    bio: '',
    location: '',
    website: '',
    oldPassword: '',
    newPassword: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { files, name, value } = event.target
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await updateProfile(form)
      setForm({
        name: '',
        avatar: null,
        bio: '',
        location: '',
        website: '',
        oldPassword: '',
        newPassword: '',
      })
      event.currentTarget.reset()
      setMessage('Perfil atualizado com sucesso.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="content-column">
      <header className="page-header">
        <div>
          <p className="eyebrow">Configuracoes</p>
          <h2>Ajuste como voce deseja se apresentar na comunidade</h2>
        </div>
      </header>

      <form className="settings-form panel" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={currentUser.name}
          />
        </label>
        <label>
          Foto de perfil
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
        </label>
        <label>
          Bio
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder={currentUser.bio}
          />
        </label>
        <label>
          Localizacao
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder={currentUser.location}
          />
        </label>
        <label>
          Site
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder={currentUser.website || 'https://seusite.com'}
          />
        </label>
        <label>
          Senha atual
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            placeholder="Obrigatoria apenas ao trocar senha"
          />
        </label>
        <label>
          Nova senha
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </label>
        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="primary-button">
          Salvar alteracoes
        </button>
      </form>
    </section>
  )
}
