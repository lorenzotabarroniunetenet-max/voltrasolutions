import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Strategies from './pages/Strategies'
import StrategyDetail from './pages/StrategyDetail'
import Portfolio from './pages/Portfolio'
import { useAuth } from './context/AuthContext'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/strategies" element={<Protected><Strategies /></Protected>} />
      <Route path="/strategies/:id" element={<Protected><StrategyDetail /></Protected>} />
      <Route path="/portfolio" element={<Protected><Portfolio /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
