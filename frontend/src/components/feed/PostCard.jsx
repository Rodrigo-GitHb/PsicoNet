import { useState } from 'react'
import { useAppContext } from '../../hooks/useAppContext'

export function PostCard({ post }) {
  const [comment, setComment] = useState('')
  const { users, toggleLike, addComment, currentUser, toggleFollow } = useAppContext()
  const author = post.author || users.find((user) => user.id === post.authorId)

  if (!author) {
    return null
  }

  function handleCommentSubmit(event) {
    event.preventDefault()
    addComment(post.id, comment)
    setComment('')
  }

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="profile-chip">
          <div className="avatar">
            {author.avatarUrl ? <img src={author.avatarUrl} alt="" /> : author.avatar}
          </div>
          <div className="author-block">
            <strong>{author.name}</strong>
            <span>
              @{author.username} - {post.createdAt}
            </span>
          </div>
        </div>

        {author.id !== currentUser.id ? (
          <button
            type="button"
            className="ghost-button"
            onClick={() => toggleFollow(author.id)}
          >
            {author.isFollowing ? 'Seguindo' : 'Seguir'}
          </button>
        ) : null}
      </header>

      <p className="post-content">{post.content}</p>

      {post.image ? <img className="post-image" src={post.image} alt="" /> : null}

      <div className="post-actions">
        <button
          type="button"
          className={`icon-button${post.isLiked ? ' active' : ''}`}
          onClick={() => toggleLike(post.id)}
        >
          Curtir <strong>{post.likesCount}</strong>
        </button>
        <span className="meta-pill">Comentarios {post.commentsCount}</span>
      </div>

      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Escreva um comentario..."
        />
        <button type="submit" className="ghost-button">
          Enviar
        </button>
      </form>

      {post.comments.length > 0 ? (
        <div className="comment-list">
          {post.comments.map((item) => {
            const commentAuthor = item.author || users.find((user) => user.id === item.authorId)
            return (
              <div key={item.id} className="comment-item">
                <strong>@{commentAuthor?.username || 'usuario'}</strong>
                <span>{item.content}</span>
              </div>
            )
          })}
        </div>
      ) : null}
    </article>
  )
}
