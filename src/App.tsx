import { Routes, Route } from 'react-router-dom'

import Layout from './components/common/Layout'
import DetectLayout from './components/common/DetectLayout'

import ProtectedRoute from './components/common/ProtectedRoute'

import Home from './pages/Home'
import Detect from './pages/Detect'
import DetectUpload from './pages/DetectUpload'
import DetectDetail from './pages/DetectDetail'
import Report from './pages/Report'
import ReportDetail from './pages/ReportDetail'
import Document from './pages/Document'
import DocumentDetail from './pages/DocumentDetail'
import Auth from './pages/Auth'
import Test from './pages/test'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/detects" element={<DetectLayout />}>
            <Route path="/detects" element={<Detect />} />
            <Route path="/detects/upload" element={<DetectUpload />} />
            <Route path="/detects/:id" element={<DetectDetail />} />
          </Route>

          <Route path="/reports" element={<Report />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/documents" element={<Document />} />
          <Route path="/documents/:documentId" element={<DocumentDetail />} />

          <Route path="/test" element={<Test />}/>

        </Route>
      </Route>
    </Routes>
  )
}

export default App
