import { useAppContext } from '../hooks/useAppContext'

function UserRow({ user, action, onClick }) {
  return (
    <article className="user-row">
      <div className="profile-chip">
        <div className="avatar">
          {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.avatar}
        </div>
        <div>
          <strong>{user.name}</strong>
          <span>@{user.username}</span>
        </div>
      </div>
      <button type="button" className="ghost-button" onClick={onClick}>
        {action}
      </button>
    </article>
  )
}

export function NetworkPage() {
  const { followerUsers, followingUsers, toggleFollow } = useAppContext()

  return (
    <section className="content-column">
      <header className="page-header">
        <div>
          <p className="eyebrow">Rede</p>
          <h2>Pessoas que caminham com voce por aqui</h2>
        </div>
      </header>

      <div className="split-grid">
        <section className="panel">
          <h3>Voce acompanha</h3>
          <div className="user-list">
            {followingUsers.length > 0 ? (
              followingUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  action="Seguindo"
                  onClick={() => toggleFollow(user.id)}
                />
              ))
            ) : (
              <p className="empty-state">Siga pessoas em Explorar para montar seu feed.</p>
            )}
          </div>
        </section>

        <section className="panel">
          <h3>Acompanham voce</h3>
          <div className="user-list">
            {followerUsers.length > 0 ? (
              followerUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  action={user.isFollowing ? 'Seguindo' : 'Seguir de volta'}
                  onClick={() => toggleFollow(user.id)}
                />
              ))
            ) : (
              <p className="empty-state">Seus seguidores aparecem aqui.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  )
}
