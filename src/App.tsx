import { Routes, Route } from 'react-router-dom'

import Layout from './components/common/Layout'

import Home from './pages/Home'
import Login from './pages/Login'
import Report from './pages/Report'
import ReportDetail from './pages/ReportDetail'
import Document from './pages/Document'
import DocumentDetail from './pages/DocumentDetail'

function App() {
  return (
    <Routes>
      {/* 레이아웃 없는 페이지 */}
      <Route path="/login" element={<Login />} />

      {/* 레이아웃 적용 영역 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="/documents" element={<Document />} />
        <Route path="/documents/:id" element={<DocumentDetail />} />
      </Route>
    </Routes>
  )
}

export default App
