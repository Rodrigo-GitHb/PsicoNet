import { PostCard } from '../components/feed/PostCard'
import { useAppContext } from '../hooks/useAppContext'

export function ExplorePage() {
  const { discoverUsers, posts, toggleFollow } = useAppContext()

  return (
    <section className="content-column">
      <header className="page-header">
        <div>
          <p className="eyebrow">Explorar</p>
          <h2>Temas, reflexoes e trocas da comunidade</h2>
        </div>
      </header>

      <section className="panel discover-panel">
        <h3>Pessoas para acompanhar</h3>
        <div className="user-list">
          {discoverUsers.length > 0 ? (
            discoverUsers.map((user) => (
              <article key={user.id} className="user-row">
                <div className="profile-chip">
                  <div className="avatar">
                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.avatar}
                  </div>
                  <div>
                    <strong>{user.name}</strong>
                    <span>@{user.username}</span>
                  </div>
                </div>
                <button type="button" className="ghost-button" onClick={() => toggleFollow(user.id)}>
                  Seguir
                </button>
              </article>
            ))
          ) : (
            <p className="empty-state">Voce ja acompanha todas as sugestoes disponiveis.</p>
          )}
        </div>
      </section>

      <div className="post-stack">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="empty-state">Ainda nao ha publicacoes para explorar.</p>
        )}
      </div>
    </section>
  )
}
