import { Outlet } from 'react-router-dom'
import { RightRail } from './RightRail'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
      <RightRail />
    </div>
  )
}
