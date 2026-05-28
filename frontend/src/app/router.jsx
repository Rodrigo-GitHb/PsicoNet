import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAppContext } from '../hooks/useAppContext'
import { ExplorePage } from '../pages/ExplorePage'
import { HomePage } from '../pages/HomePage'
import { LandingPage } from '../pages/LandingPage'
import { NetworkPage } from '../pages/NetworkPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SettingsPage } from '../pages/SettingsPage'

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAppContext()

  if (loading) {
    return <div className="loading-screen">Carregando sua rede...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

function PublicOnly({ children }) {
  const { isAuthenticated, loading } = useAppContext()

  if (loading) {
    return <div className="loading-screen">Carregando sua rede...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return children
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnly>
            <LandingPage />
          </PublicOnly>
        }
      />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
