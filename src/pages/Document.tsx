import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDocumentList } from '@/api/documents'
import type { DocumentListItem } from '@/types/document'
import DocumentCreateModal from '@/components/documents/DocumentCreateModal'

function Document() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await getDocumentList()
    setDocuments(res)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          유지보수 문서
        </h1>

        <button
          className="px-4 py-2 rounded bg-blue-500 text-white text-sm"
          onClick={() => setOpen(true)}
        >
          문서 생성
        </button>
      </div>

      <div className="bg-white rounded-xl shadow divide-y">
        {loading && (
          <div className="p-4 text-gray-500">
            로딩 중...
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className="p-4 text-gray-500">
            등록된 문서가 없습니다.
          </div>
        )}

        {documents.map((doc) => (
          <Link
            key={doc.id}
            to={`/documents/${doc.id}`}
            className="block p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {doc.name}
                </h2>
                <p className="text-sm text-gray-500">
                  최신 버전 v{doc.latestVersion} ·{' '}
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                보기
              </span>
            </div>
          </Link>
        ))}
      </div>

      {open && (
        <DocumentCreateModal
          onClose={() => setOpen(false)}
          onSuccess={load}
        />
      )}
    </div>
  )
}

export default Document
