import { FeedComposer } from '../components/feed/FeedComposer'
import { PostCard } from '../components/feed/PostCard'
import { useAppContext } from '../hooks/useAppContext'

export function HomePage() {
  const { timeline, createPost } = useAppContext()

  return (
    <section className="content-column">
      <header className="page-header">
        <div>
          <p className="eyebrow">Acolhimento</p>
          <h2>Conversas das pessoas que voce acompanha</h2>
        </div>
        <div className="page-aside">
          <span>escuta e troca</span>
          <strong>{timeline.length} reflexoes</strong>
        </div>
      </header>

      <FeedComposer onSubmit={createPost} />

      <div className="post-stack">
        {timeline.length > 0 ? (
          timeline.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="empty-state">Siga outros usuarios em Explorar para preencher seu feed.</p>
        )}
      </div>
    </section>
  )
}
