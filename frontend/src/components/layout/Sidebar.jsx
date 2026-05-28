import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../hooks/useAppContext'

const navItems = [
  { to: '/home', label: 'Feed', icon: '01' },
  { to: '/explore', label: 'Explorar', icon: '02' },
  { to: '/network', label: 'Rede', icon: '03' },
  { to: '/profile', label: 'Perfil', icon: '04' },
  { to: '/settings', label: 'Config', icon: '05' },
]

export function Sidebar() {
  const { currentUser, logout } = useAppContext()

  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <div>
          <p className="eyebrow">PsicoNet</p>
          <h1>Pulse Social</h1>
          <span className="brand-caption">Rede social especializada em debates e discussões sobre psicologia e saúde mental.</span>
        </div>
      </div>

      <nav className="nav-stack" aria-label="Principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-card">
        <p className="eyebrow">Usuario logado</p>
        <div className="profile-chip">
          <div className="avatar avatar-large">
            {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="" /> : currentUser.avatar}
          </div>
          <div>
            <strong>{currentUser.name}</strong>
            <span>@{currentUser.username}</span>
          </div>
        </div>
        <p>{currentUser.bio}</p>
        <button type="button" className="ghost-button full-width" onClick={logout}>
          Sair
        </button>
      </div>
    </aside>
  )
}
