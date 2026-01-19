import { Routes, Route } from 'react-router-dom'

import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

import Home from './pages/Home'
import Report from './pages/Report'
import ReportDetail from './pages/ReportDetail'
import Document from './pages/Document'
import DocumentDetail from './pages/DocumentDetail'
import Auth from './pages/Auth'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/documents" element={<Document />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
