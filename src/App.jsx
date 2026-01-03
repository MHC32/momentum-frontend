import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials, clearCredentials } from './redux/slices/authSlice'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Kanban from './pages/Kanban'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const dispatch = useDispatch()

  // ✅ Check localStorage au démarrage UNIQUEMENT
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        dispatch(setCredentials({
          token,
          user: JSON.parse(user)
        }))
      } catch {
        // Token corrompu, on nettoie
        localStorage.clear()
        dispatch(clearCredentials())
      }
    }
  }, [dispatch])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/projects" element=<Projects /> replace />
      <Route path="/projects/:projectId/kanban" element=<Kanban /> replace />
    </Routes>
  )
}

export default App