import { useState } from 'react'

export function FeedComposer({ onSubmit }) {
  const [content, setContent] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(content)
    setContent('')
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Nova reflexao</p>
        <h2>Compartilhe algo que possa acolher ou provocar pensamento</h2>
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="O que voce gostaria de dividir com a comunidade hoje?"
        maxLength={280}
      />
      <div className="composer-footer">
        <span>{280 - content.length} caracteres restantes</span>
        <button type="submit" className="primary-button">
          Publicar
        </button>
      </div>
    </form>
  )
}
