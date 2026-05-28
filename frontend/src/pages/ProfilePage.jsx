import { PostCard } from '../components/feed/PostCard'
import { useAppContext } from '../hooks/useAppContext'

export function ProfilePage() {
  const { currentUser, posts } = useAppContext()
  const authoredPosts = posts.filter((post) => post.authorId === currentUser.id)

  return (
    <section className="content-column">
      <div className="profile-hero" style={{ background: currentUser.cover }}>
        <div className="profile-hero-overlay">
          <div className="avatar avatar-xl">
            {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="" /> : currentUser.avatar}
          </div>
          <div>
            <h2>{currentUser.name}</h2>
            <p>@{currentUser.username}</p>
          </div>
        </div>
      </div>

      <section className="panel profile-details">
        <p>{currentUser.bio}</p>
        <div className="profile-meta">
          <span>{currentUser.location}</span>
          {currentUser.website ? <span>{currentUser.website}</span> : null}
          <span>Entrou em {currentUser.joinedAt}</span>
        </div>
        <div className="metrics-grid">
          <article>
            <strong>{authoredPosts.length}</strong>
            <span>Reflexoes</span>
          </article>
          <article>
            <strong>{currentUser.followersCount}</strong>
            <span>Seguidores</span>
          </article>
          <article>
            <strong>{currentUser.followingCount}</strong>
            <span>Seguindo</span>
          </article>
        </div>
      </section>

      <div className="post-stack">
        {authoredPosts.length > 0 ? (
          authoredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="empty-state">Suas reflexoes publicadas aparecem aqui.</p>
        )}
      </div>
    </section>
  )
}
