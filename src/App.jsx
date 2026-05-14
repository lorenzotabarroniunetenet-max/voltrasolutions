import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Contact from './pages/Contact.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Payout from './pages/Payout.jsx'
import BuyProgram from './pages/BuyProgram.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Layout from './components/Layout.jsx'

function PrivateRoute({ children, admin }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Caricamento...</div>
  if (!user) return <Navigate to="/login" />
  if (admin && user.role !== 'ADMIN') return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/payout" element={<PrivateRoute><Layout><Payout /></Layout></PrivateRoute>} />
      <Route path="/buy" element={<PrivateRoute><Layout><BuyProgram /></Layout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute admin><Layout><AdminPanel /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
