import { Routes, Route } from 'react-router-dom'

import Layout from "./components/common/Layout"

import Home from './pages/Home'
import Login from './pages/Login'
import Report from './pages/Report'
import ReportDetail from './pages/ReportDetail'
import Document from './pages/Document'
import DocumentDetail from './pages/DocumentDetail'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="/documents" element={<Document />} />
        <Route path="/documents/:id" element={<DocumentDetail />} />
      </Routes>      
    </Layout>

  )
}

export default App
