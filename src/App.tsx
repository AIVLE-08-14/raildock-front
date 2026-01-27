import { Routes, Route } from 'react-router-dom'

import Layout from './components/common/Layout'
import DefectLayout from './components/common/DefectLayout'

import ProtectedRoute from './components/common/ProtectedRoute'

import Home from './pages/Home'
import Defect from './pages/Defect'
import DefectUpload from './pages/DefectUpload'
import DefectDetail from './pages/DefectDetail'
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

          <Route path="/defects" element={<DefectLayout />}>
            <Route path="/defects" element={<Defect />} />
            <Route path="/defects/upload" element={<DefectUpload />} />
            <Route path="/defects/:defectId" element={<DefectDetail />} />
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
