import { useAppContext } from '../../hooks/useAppContext'

export function RightRail() {
  const { currentUser, discoverUsers, timeline } = useAppContext()

  return (
    <aside className="right-rail">
      <section className="panel">
        <p className="eyebrow">Resumo rapido</p>
        <h2>Panorama da comunidade</h2>
        <div className="metrics-grid">
          <article>
            <strong>{timeline.length}</strong>
            <span>Reflexoes no feed</span>
          </article>
          <article>
            <strong>{currentUser.followingCount}</strong>
            <span>Pessoas acompanhadas</span>
          </article>
          <article>
            <strong>{currentUser.followersCount}</strong>
            <span>Pessoas na rede</span>
          </article>
          <article>
            <strong>{discoverUsers.length}</strong>
            <span>Novas conexoes</span>
          </article>
        </div>
      </section>

    </aside>
  )
}
