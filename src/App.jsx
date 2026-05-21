import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { api } from './lib/api.js'
import RouteSweep from './components/RouteSweep.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Personale from './pages/Personale.jsx'
import Fascicolo from './pages/Fascicolo.jsx'
import Requisiti from './pages/Requisiti.jsx'
import SalaBriefing from './pages/SalaBriefing.jsx'
import AlboOnore from './pages/AlboOnore.jsx'
import Documenti from './pages/Documenti.jsx'
import CambioPassword from './pages/CambioPassword.jsx'
import SicurezzaAccesso from './pages/SicurezzaAccesso.jsx'
import CodiceOperativo from './pages/CodiceOperativo.jsx'
import CodiceCondotta from './pages/CodiceCondotta.jsx'
import Calendario from './pages/Calendario.jsx'
import MappaOperazioni from './pages/MappaOperazioni.jsx'
import SalaFondatori from './pages/SalaFondatori.jsx'
import Contact from './pages/Contact.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Payout from './pages/Payout.jsx'
import BuyProgram from './pages/BuyProgram.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import ApprovaOrdine from './pages/ApprovaOrdine.jsx'
import SchedaUtente from './pages/SchedaUtente.jsx'
import Layout from './components/Layout.jsx'
import Ceremony from './components/Ceremony.jsx'

function PrivateRoute({ children, admin }) {
  const { user, loading } = useAuth()
  const [ceremony, setCeremony] = useState(null)
  const [checkedCeremony, setCheckedCeremony] = useState(false)

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      api.ceremonyPending().then(c => { setCeremony(c); setCheckedCeremony(true) }).catch(() => setCheckedCeremony(true))
    } else {
      setCheckedCeremony(true)
    }
  }, [user?.id])

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Caricamento...</div>
  if (!user) return <Navigate to="/login" />
  if (admin && user.role !== 'ADMIN') return <Navigate to="/dashboard" />
  if (!checkedCeremony) return <div style={{ minHeight: '100vh', background: '#000' }} />

  return (
    <>
      {children}
      {ceremony && <Ceremony ceremony={ceremony} onComplete={() => setCeremony(null)} />}
    </>
  )
}

export default function App() {
  useEffect(() => {
    api.publicFeatures()
      .then(f => { window.__voltraGunshotDisabled = !!f.gunshotDisabled })
      .catch(() => {})
  }, [])

  return (
    <>
      <RouteSweep />
      <Routes>
        <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/payout" element={<PrivateRoute><Layout><Payout /></Layout></PrivateRoute>} />
      <Route path="/buy" element={<PrivateRoute><Layout><BuyProgram /></Layout></PrivateRoute>} />
      <Route path="/personale" element={<PrivateRoute><Layout><Personale /></Layout></PrivateRoute>} />
      <Route path="/fascicolo" element={<PrivateRoute><Layout><Fascicolo /></Layout></PrivateRoute>} />
      <Route path="/requisiti" element={<PrivateRoute><Layout><Requisiti /></Layout></PrivateRoute>} />
      <Route path="/briefing" element={<PrivateRoute><Layout><SalaBriefing /></Layout></PrivateRoute>} />
      <Route path="/albo" element={<PrivateRoute><Layout><AlboOnore /></Layout></PrivateRoute>} />
      <Route path="/documenti" element={<PrivateRoute><Layout><Documenti /></Layout></PrivateRoute>} />
      <Route path="/cambio-password" element={<PrivateRoute><Layout><CambioPassword /></Layout></PrivateRoute>} />
      <Route path="/sicurezza-accesso" element={<PrivateRoute><Layout><SicurezzaAccesso /></Layout></PrivateRoute>} />
      <Route path="/codice-operativo" element={<PrivateRoute><Layout><CodiceOperativo /></Layout></PrivateRoute>} />
      <Route path="/codice-condotta" element={<PrivateRoute><Layout><CodiceCondotta /></Layout></PrivateRoute>} />
      <Route path="/calendario" element={<PrivateRoute><Layout><Calendario /></Layout></PrivateRoute>} />
      <Route path="/mappa" element={<PrivateRoute><Layout><MappaOperazioni /></Layout></PrivateRoute>} />
      <Route path="/sala-fondatori" element={<PrivateRoute><SalaFondatori /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute admin><Layout><AdminPanel /></Layout></PrivateRoute>} />
      <Route path="/admin/approva/:id" element={<ApprovaOrdine />} />
      <Route path="/admin/utente/:id" element={<PrivateRoute admin><Layout><SchedaUtente /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}
